/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const workbookPath = path.resolve(process.cwd(), "marriage-db.xlsx");
const outputDir = path.resolve(process.cwd(), "app", "data");

const targetSheets = [
  { outputName: "questions", candidates: ["questions"] },
  { outputName: "logic", candidates: ["logic"] },
  { outputName: "types", candidates: ["types"] },
  { outputName: "characters", candidates: ["characters"] },
  {
    outputName: "result_templates",
    candidates: ["result_templates"],
  },
  {
    outputName: "numerology",
    candidates: ["numerology", "diagnosis_flow"],
  },
];

function ensureWorkbookExists() {
  if (!fs.existsSync(workbookPath)) {
    throw new Error(
      `Excel file not found: ${workbookPath}\nPlace marriage-db.xlsx in project root.`
    );
  }
}

function readWorkbook() {
  return XLSX.readFile(workbookPath, { cellDates: true });
}

function resolveSheetName(workbook, candidates) {
  return candidates.find((name) => workbook.Sheets[name]);
}

function convertSheetToJson(workbook, sheetName) {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found in marriage-db.xlsx`);
  }

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
    raw: false,
  });
}

function writeJsonFile(filename, data) {
  const outputPath = path.join(outputDir, filename);
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputPath, `${json}\n`, "utf8");
}

function run() {
  ensureWorkbookExists();
  fs.mkdirSync(outputDir, { recursive: true });

  const workbook = readWorkbook();

  for (const target of targetSheets) {
    const sheetName = resolveSheetName(workbook, target.candidates);
    if (!sheetName) {
      throw new Error(
        `Sheet "${target.outputName}" not found. Tried: ${target.candidates.join(
          ", "
        )}`
      );
    }

    const jsonData = convertSheetToJson(workbook, sheetName);
    writeJsonFile(`${target.outputName}.json`, jsonData);
    console.log(
      `Converted: ${sheetName} -> app/data/${target.outputName}.json`
    );
  }

  console.log("Import completed.");
}

try {
  run();
} catch (error) {
  console.error("[import-db] Failed:", error.message);
  process.exit(1);
}
