"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import logicData from "@/app/data/logic.json";
import typesData from "@/app/data/types.json";
import charactersData from "@/app/data/characters.json";
import templatesData from "@/app/data/result_templates.json";

type Gender = "male" | "female";
type StoredAnswer = { questionId: number; answer: number };
type Payload = { gender: Gender; answers: StoredAnswer[] };
type LogicRow = {
  question_id: string | null;
  positive_type: string | null;
  negative_type: string | null;
  weight: string | null;
  [key: string]: string | null;
};
type Character = {
  code: string;
  gender: Gender;
  character_name: string;
  archetype: string;
  expression_vibe: string;
  love_behavior: string;
};
type Template = {
  code: string;
  gender: Gender;
  headline: string;
  love_type: string;
  marriage_type: string;
  gap: string;
  collapse_pattern: string;
  long_term_secret: string;
  final_message: string;
};
type TypeRow = {
  code: string;
  relationship_theme: string;
};

const logicRows = logicData as LogicRow[];
const typesRows = typesData as TypeRow[];
const characterRows = charactersData as Character[];
const templateRows = templatesData as Template[];

const codeTypePairs = [
  ["Connection", "Passion", "C", "P"],
  ["Security", "Freedom", "S", "F"],
  ["Independent", "Bond", "I", "B"],
  ["Approval", "Value", "A", "V"],
  ["Lead", "Receive", "L", "R"],
] as const;

export default function ResultPage() {
  const [result] = useState(() => {
    if (typeof window === "undefined") return 0;
    const raw = window.sessionStorage.getItem("diagnosisPayload");
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as Payload;
      const answerMap = new Map(parsed.answers.map((item) => [String(item.questionId), item.answer]));
      const scoreMap: Record<string, number> = {};

      for (const row of logicRows) {
        if (!row.question_id) continue;
        const answer = answerMap.get(row.question_id);
        if (!answer) continue;

        const score = Number(row[`answer_${answer}_score`] ?? 0) * Number(row.weight ?? 1);
        const positive = row.positive_type ?? "";
        const negative = row.negative_type ?? "";

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

      const typeInfo = typesRows.find((item) => item.code === code);
      const character = characterRows.find(
        (item) => item.code === code && item.gender === parsed.gender
      );
      const template = templateRows.find(
        (item) => item.code === code && item.gender === parsed.gender
      );

      const axisRanks = codeTypePairs.map(([leftType, rightType], idx) => {
        const left = scoreMap[leftType] ?? 0;
        const right = scoreMap[rightType] ?? 0;
        const intensity = Math.min(3, Math.max(1, Math.round(Math.abs(left - right) / 6) + 1));
        return `${String.fromCharCode(65 + idx)}${intensity}`;
      });

      return {
        gender: parsed.gender,
        code,
        axisSignature: axisRanks.join("-"),
        typeInfo,
        character,
        template,
      };
    } catch {
      return null;
    }
  });

  if (!result || !result.character || !result.template) {
    return (
      <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-[#2a2522]">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
          結果データの読み込みに失敗しました。再診断をお試しください。
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-[#2a2522]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-md rounded-3xl bg-white p-7 shadow-[0_16px_46px_rgba(35,25,15,0.09)]"
      >
        <p className="text-xs tracking-[0.15em] text-[#8a7c73]">RESULT</p>
        <h1 className="mt-2 text-3xl font-semibold">{result.character.character_name}</h1>
        <p className="mt-2 text-sm text-[#756963]">{result.character.archetype}</p>
        <p className="mt-2 text-xs text-[#8a7c73]">
          code: {result.code} / {result.axisSignature} / {result.gender}
        </p>

        <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#2f2824] to-[#4a3e36] p-5 text-[#f7ede4]">
          <p className="text-xs tracking-[0.13em] text-[#d6c2b3]">CHARACTER IMAGE AREA</p>
          <p className="mt-3 text-sm leading-7">{result.character.expression_vibe}</p>
          <p className="mt-3 text-xs text-[#d6c2b3]">「{result.template.headline}」</p>
        </div>

        <div className="mt-5 grid gap-2 rounded-2xl bg-[#f8f1e9] p-4 text-sm text-[#574d47]">
          <p>キャラ説明：{result.character.archetype}</p>
          <p>恋愛傾向：{result.template.love_type}</p>
          <p>結婚傾向：{result.template.marriage_type}</p>
          <p>求める相手とのズレ：{result.template.gap}</p>
          <p>関係を壊す行動：{result.template.collapse_pattern}</p>
          <p>長続きする秘訣：{result.template.long_term_secret}</p>
          {result.typeInfo && <p>相性コメント：{result.typeInfo.relationship_theme}</p>}
        </div>

        <p className="mt-4 rounded-xl bg-[#fff6ec] p-3 text-sm leading-7 text-[#5c5049]">
          {result.template.final_message}
          <br />
          AIがあなたの反応速度・依存傾向・境界の揺れ方を照合した結果です。
        </p>

        <div className="mt-7 flex gap-2">
          <Link
            href="/checkout"
            className="flex-1 rounded-full bg-[#2a2522] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            続きを見る
          </Link>
          <Link
            href="/diagnosis"
            className="flex-1 rounded-full border border-[#d8c9bb] bg-white px-4 py-3 text-center text-sm font-semibold"
          >
            もう一度診断する
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
