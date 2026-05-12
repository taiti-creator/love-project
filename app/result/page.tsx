"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
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

type ResultState = {
  gender: Gender;
  code: string;
  axisSignature: string;
  typeInfo?: TypeRow;
  character: Character;
  template: Template;
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

function computeResult(): ResultState | null {
  if (typeof window === "undefined") return null;
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

    if (!character || !template) return null;

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
}

export default function ResultPage() {
  const [result] = useState<ResultState | null>(() => computeResult());

  const lockedSections = useMemo(() => {
    if (!result) return [];
    const { character, template, typeInfo } = result;
    return [
      { title: "恋愛で出やすい傾向", body: template.love_type },
      { title: "結婚生活で出やすい傾向", body: template.marriage_type },
      { title: "恋愛と結婚のズレ", body: template.gap },
      { title: "関係が壊れやすいパターン", body: template.collapse_pattern },
      { title: "長く幸せでいるためのヒント", body: template.long_term_secret },
      { title: "無意識の恋愛行動", body: character.love_behavior },
      { title: "雰囲気・印象の深読み", body: character.expression_vibe },
      ...(typeInfo
        ? [{ title: "相性・関係性のテーマ", body: typeInfo.relationship_theme }]
        : []),
      { title: "最後にあなたへ", body: template.final_message },
    ];
  }, [result]);

  if (!result) {
    return (
      <main className="min-h-screen bg-[#fbf7f2] px-4 py-12 text-[#2a2522]">
        <div className="mx-auto max-w-md rounded-3xl border border-[#ebe3d9] bg-white p-8 text-center shadow-[0_14px_40px_rgba(40,30,20,0.08)]">
          <p className="text-sm leading-relaxed text-[#5c534d]">
            結果データの読み込みに失敗しました。診断からもう一度お試しください。
          </p>
          <Link
            href="/diagnosis"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2a2522] py-3.5 text-sm font-semibold text-white shadow-[0_10px_32px_rgba(42,37,34,0.2)] transition hover:shadow-[0_14px_40px_rgba(42,37,34,0.26)]"
          >
            診断に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 pb-12 text-[#2a2522] sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-md"
      >
        <div className="rounded-[1.75rem] border border-[#efe6dc] bg-white p-6 shadow-[0_20px_56px_rgba(35,25,15,0.1)] sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ebe3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6d64]">
              <Sparkles className="h-3 w-3" strokeWidth={2} />
              64タイプ診断
            </span>
            <span className="rounded-full border border-[#e8ddd2] bg-[#fffdfa] px-2.5 py-1 text-[10px] font-medium tabular-nums text-[#8a7c73]">
              {result.code} · {result.axisSignature}
            </span>
          </div>

          <p className="mt-6 text-center text-xs font-medium tracking-[0.2em] text-[#8a7c73]">
            あなたのタイプ
          </p>
          <h1 className="mt-2 text-center text-3xl font-semibold leading-tight tracking-tight text-[#1f1a17] sm:text-[2rem]">
            {result.character.character_name}
          </h1>
          <p className="mt-3 text-center text-base font-medium text-[#5c534d]">
            あなたは「{result.character.character_name}」タイプです
          </p>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-[#7a6d64]">
            {result.character.archetype}
          </p>

          <div className="mt-8 rounded-2xl border border-[#ebe3d9] bg-gradient-to-b from-[#fffdfa] to-[#f9f4ee] px-5 py-6 text-center shadow-inner">
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#9a8b82]">FREE PREVIEW</p>
            <p className="mx-auto mt-4 max-w-xs text-lg font-semibold leading-snug text-[#2a2522] sm:text-xl">
              {result.template.headline}
            </p>
          </div>

          <p className="mt-10 text-center text-[11px] font-semibold tracking-[0.22em] text-[#8a7c73]">
            フルレポート（有料エリア）
          </p>

          <div className="relative mt-3 min-h-[22rem] overflow-hidden rounded-2xl border border-[#ebe3d9] bg-[#faf6f1] sm:min-h-[24rem]">
            <div className="pointer-events-none space-y-4 p-5 select-none">
              {lockedSections.map((block) => (
                <div key={block.title}>
                  <p className="text-xs font-semibold text-[#6f645d]">{block.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#4a423c] blur-[5px]">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-10% via-[#fbf7f2]/65 to-[#fbf7f2]" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-6 pt-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8ddd2] bg-white shadow-[0_8px_24px_rgba(42,37,34,0.1)]">
                <Lock className="h-5 w-5 text-[#5c534d]" strokeWidth={2} aria-hidden />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-[#2a2522]">
                有料で全文を解放
              </p>
              <p className="mt-1 max-w-[17rem] text-center text-xs leading-relaxed text-[#7a6d64]">
                恋愛・結婚のズレ、崩れやすいパターン、長続きの秘訣まで一気に読めます。
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center rounded-full bg-[#2a2522] px-6 py-4 text-center text-base font-semibold text-white shadow-[0_14px_44px_rgba(42,37,34,0.28)] transition hover:shadow-[0_18px_52px_rgba(42,37,34,0.34)] active:scale-[0.99]"
            >
              続きを見る（フルレポート）
            </Link>
            <Link
              href="/diagnosis"
              className="flex w-full items-center justify-center rounded-full border border-[#dcd2c6] bg-white py-3.5 text-sm font-semibold text-[#3a332f] transition hover:bg-[#fffdfa]"
            >
              もう一度診断する
            </Link>
            <Link
              href="/"
              className="text-center text-xs font-medium text-[#8a7c73] underline-offset-4 hover:text-[#5c534d] hover:underline"
            >
              トップへ
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
