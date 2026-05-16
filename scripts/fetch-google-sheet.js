/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const workbookPath = path.resolve(process.cwd(), "marriage-db.xlsx");
const csvTargets = [
  {
    outputName: "questions",
    envName: "QUESTIONS_CSV_URL",
    requiredHeaders: ["id"],
  },
  {
    outputName: "logic",
    envName: "LOGIC_CSV_URL",
    requiredHeaders: ["question_id"],
  },
  {
    outputName: "types",
    envName: "TYPES_CSV_URL",
    requiredHeaders: ["code", "core_desire"],
  },
  {
    outputName: "characters",
    envName: "CHARACTERS_CSV_URL",
    requiredHeaders: ["code", "gender", "character_name"],
  },
  {
    outputName: "result_templates",
    envName: "RESULT_TEMPLATES_CSV_URL",
    requiredHeaders: ["code", "gender", "character_name"],
  },
  {
    outputName: "numerology",
    envName: "NUMEROLOGY_CSV_URL",
    requiredHeaders: ["id"],
  },
];

function loadEnvFile(filename) {
  const envPath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const workbookUrl =
  process.env.GOOGLE_SHEET_XLSX_URL ||
  process.env.GOOGLE_SHEET_URL;
const genericCsvUrl =
  process.env.GOOGLE_SHEET_CSV_URL ||
  process.argv[2];

function ensureSourceUrl() {
  const hasSheetCsvUrl = csvTargets.some((target) => process.env[target.envName]);

  if (!workbookUrl && !genericCsvUrl && !hasSheetCsvUrl) {
    throw new Error(
      [
        "Google Sheet URL is required.",
        "Set GOOGLE_SHEET_URL for the published spreadsheet, or set a sheet-specific CSV URL.",
        "Example: GOOGLE_SHEET_URL='https://docs.google.com/spreadsheets/d/e/.../pub?output=csv' npm run sync-db",
      ].join("\n")
    );
  }
}

function headersFromCsv(csv) {
  const firstLine = csv.split(/\r?\n/, 1)[0] || "";
  return firstLine
    .split(",")
    .map((header) => header.trim().replace(/^\uFEFF/, "").replace(/^"|"$/g, ""));
}

function validateCsv(csv, requiredHeaders, label) {
  const headers = headersFromCsv(csv);
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    throw new Error(
      `${label} CSV is missing required headers: ${missingHeaders.join(", ")}`
    );
  }
}

function toXlsxUrl(url) {
  const parsed = new URL(url);
  parsed.searchParams.set("output", "xlsx");
  return parsed.toString();
}

function outputPathForCsv(outputName) {
  return path.resolve(process.cwd(), `${outputName}.csv`);
}

function detectCsvTarget(csv) {
  const headers = headersFromCsv(csv);
  return csvTargets.find((target) =>
    target.requiredHeaders.every((header) => headers.includes(header))
  );
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function fetchWorkbook(url) {
  const response = await fetch(toXlsxUrl(url), { redirect: "follow" });

  if (!response.ok) {
    throw new Error(`Failed to fetch workbook: ${response.status} ${response.statusText}`);
  }

  const workbook = Buffer.from(await response.arrayBuffer());
  const isXlsx = workbook.subarray(0, 4).toString("hex") === "504b0304";

  if (!isXlsx) {
    throw new Error("Fetched workbook is not a valid xlsx file.");
  }

  fs.writeFileSync(workbookPath, workbook);
  console.log(`Fetched Google Sheet workbook -> ${path.relative(process.cwd(), workbookPath)}`);
}

async function fetchCsv(url, target) {
  const csv = await fetchText(url);
  const resolvedTarget = target || detectCsvTarget(csv);

  if (!resolvedTarget) {
    throw new Error("Could not detect which data file this CSV belongs to.");
  }

  validateCsv(csv, resolvedTarget.requiredHeaders, resolvedTarget.outputName);
  const outputPath = outputPathForCsv(resolvedTarget.outputName);
  fs.writeFileSync(outputPath, csv.endsWith("\n") ? csv : `${csv}\n`, "utf8");

  console.log(`Fetched Google Sheet CSV -> ${path.relative(process.cwd(), outputPath)}`);
}

async function run() {
  ensureSourceUrl();

  if (workbookUrl) {
    await fetchWorkbook(workbookUrl);
  }

  for (const target of csvTargets) {
    const url = process.env[target.envName];
    if (!url) continue;
    await fetchCsv(url, target);
  }

  if (!workbookUrl && genericCsvUrl) {
    await fetchCsv(genericCsvUrl);
  }
}

run().catch((error) => {
  console.error("[fetch-google-sheet] Failed:", error.message);
  process.exit(1);
});
