import logicData from "@/app/data/logic.json";
import typesData from "@/app/data/types.json";
import charactersData from "@/app/data/characters.json";
import templatesData from "@/app/data/result_templates.json";

export type Gender = "male" | "female";
export type StoredAnswer = { questionId: number; answer: number };
export type DiagnosisPayload = { gender: Gender; answers: StoredAnswer[] };

type JsonRow = Record<string, string | null | undefined>;

export type TypeRow = {
  code?: string;
  core_desire?: string;
  male_character?: string;
  female_character?: string;
  male_summary?: string;
  female_summary?: string;
  relationship_theme?: string;
  [key: string]: unknown;
};

export type DiagnosisResult = {
  gender: Gender;
  code: string;
  axisSignature: string;
  typeInfo?: TypeRow;
  character: {
    character_name: string;
    archetype: string;
    expression_vibe: string;
    love_behavior: string;
  };
  /** Raw template row; keys may vary by data version — read with safe helpers */
  template: JsonRow;
};

const logicRows = logicData as JsonRow[];
const typesRows = typesData as TypeRow[];
const characterRows = charactersData as JsonRow[];
const templateRows = templatesData as JsonRow[];

const codeTypePairs = [
  ["Connection", "Passion", "C", "P"],
  ["Security", "Freedom", "S", "F"],
  ["Independent", "Bond", "I", "B"],
  ["Approval", "Value", "A", "V"],
  ["Lead", "Receive", "L", "R"],
] as const;

function str(x: unknown): string {
  if (typeof x === "string") return x.trim();
  if (x == null) return "";
  return String(x).trim();
}

function num(x: unknown): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function pickRowGender(row: JsonRow, expected: Gender): boolean {
  const g = str(row.gender).toLowerCase();
  if (!g) return true;
  return g === expected;
}

function mergeCharacter(
  ch: JsonRow | undefined,
  tpl: JsonRow | undefined,
  gender: Gender,
  code: string,
  typeRow: TypeRow | undefined
): DiagnosisResult["character"] {
  const fromTypeName =
    gender === "male" ? str(typeRow?.male_character) : str(typeRow?.female_character);
  const name =
    str(ch?.character_name) || str(tpl?.character_name) || fromTypeName || code;
  const archetypeFromChar = str(ch?.archetype);
  const genericArchetype =
    archetypeFromChar === "恋と将来の人格図鑑タイプ" ||
    archetypeFromChar.includes("恋と将来") ||
    archetypeFromChar.includes("人格図鑑");
  const archetype = genericArchetype
    ? str(typeRow?.relationship_theme) || str(typeRow?.core_desire) || ""
    : archetypeFromChar ||
      str(typeRow?.relationship_theme) ||
      str(typeRow?.core_desire) ||
      "";
  const expression_vibe =
    str(ch?.expression_vibe) || str(tpl?.love_type) || str(typeRow?.relationship_theme) || "";
  const love_behavior =
    str(ch?.love_behavior) || str(tpl?.love_type) || str(typeRow?.relationship_theme) || "";
  return { character_name: name, archetype, expression_vibe, love_behavior };
}

function mergeTemplate(
  tpl: JsonRow | undefined,
  code: string,
  gender: Gender,
  typeRow: TypeRow | undefined
): JsonRow {
  if (tpl && Object.keys(tpl).length > 0) return tpl;
  const headline = `${code} タイプ`;
  const genderLine =
    gender === "male" ? str(typeRow?.male_summary) : str(typeRow?.female_summary);
  return {
    code,
    gender,
    character_name:
      gender === "male" ? str(typeRow?.male_character) : str(typeRow?.female_character),
    headline,
    love_type: genderLine || str(typeRow?.relationship_theme),
    marriage_type: "",
    gap: "",
    collapse_pattern: "",
    cooling_pattern: "",
    hidden_desire: "",
    best_partner: "",
    long_term_secret: "",
    warning: "",
    final_message: "",
    growth_message: "",
    marriage_advice: "",
  };
}

export function computeDiagnosisResult(): DiagnosisResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem("diagnosisPayload");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DiagnosisPayload;
    if (!parsed.answers || !Array.isArray(parsed.answers)) return null;

    const gender: Gender = parsed.gender === "male" ? "male" : "female";

    const answerMap = new Map(
      parsed.answers.map((item) => [String(item.questionId), item.answer])
    );
    const scoreMap: Record<string, number> = {};

    for (const row of logicRows) {
      const qid = str(row.question_id);
      if (!qid) continue;
      if (!answerMap.has(qid)) continue;
      const answer = answerMap.get(qid);
      if (answer === undefined) continue;

      const scoreCol = `answer_${answer}_score`;
      const rowScore = num(row[scoreCol]);
      const weight = num(row.weight);
      const w = weight === 0 ? 1 : weight;
      const score = rowScore * w;
      const positive = str(row.positive_type);
      const negative = str(row.negative_type);

      if (score >= 0 && positive) {
        scoreMap[positive] = (scoreMap[positive] ?? 0) + score;
      } else if (score < 0 && negative) {
        scoreMap[negative] = (scoreMap[negative] ?? 0) + Math.abs(score);
      }
    }

    const code = codeTypePairs
      .map(([leftType, rightType, leftCode, rightCode]) =>
        (scoreMap[leftType] ?? 0) >= (scoreMap[rightType] ?? 0) ? leftCode : rightCode
      )
      .join("");

    const typeInfo = typesRows.find((item) => str(item.code) === code);
    const character = characterRows.find(
      (item) => str(item.code) === code && pickRowGender(item, gender)
    );
    const templateRow = templateRows.find(
      (item) => str(item.code) === code && pickRowGender(item, gender)
    );

    const template = mergeTemplate(templateRow, code, gender, typeInfo);
    const characterMerged = mergeCharacter(character, templateRow, gender, code, typeInfo);

    const axisRanks = codeTypePairs.map(([leftType, rightType], idx) => {
      const left = scoreMap[leftType] ?? 0;
      const right = scoreMap[rightType] ?? 0;
      const intensity = Math.min(3, Math.max(1, Math.round(Math.abs(left - right) / 6) + 1));
      return `${String.fromCharCode(65 + idx)}${intensity}`;
    });

    return {
      gender,
      code,
      axisSignature: axisRanks.join("-"),
      typeInfo,
      character: characterMerged,
      template,
    };
  } catch {
    return null;
  }
}
