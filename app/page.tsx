"use client";

import { useMemo, useState } from "react";
import questionsData from "@/app/data/questions.json";
import logicData from "@/app/data/logic.json";
import charactersData from "@/app/data/characters.json";
import templatesData from "@/app/data/result_templates.json";

type Gender = "male" | "female";

type Question = {
  id: string;
  question: string;
  [key: string]: string;
};

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
  love_behavior: string;
};

type ResultTemplate = {
  code: string;
  gender: Gender;
  headline: string;
  final_message: string;
};

const questions = questionsData as Question[];
const logicRows = (logicData as LogicRow[]).filter((row) => row.question_id);
const characters = charactersData as Character[];
const resultTemplates = templatesData as ResultTemplate[];

const codeTypePairs = [
  ["Connection", "Passion", "C", "P"],
  ["Security", "Freedom", "S", "F"],
  ["Independent", "Bond", "I", "B"],
  ["Approval", "Value", "A", "V"],
  ["Lead", "Receive", "L", "R"],
] as const;

export default function Page() {
  const [gender, setGender] = useState<Gender>("male");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentIndex];
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);
  const isComplete = Object.keys(answers).length === questions.length;

  const result = useMemo(() => {
    if (!isComplete) return null;

    const scores: Record<string, number> = {};

    for (const row of logicRows) {
      const qid = row.question_id;
      if (!qid) continue;
      const answer = answers[qid];
      if (!answer) continue;

      const scoreKey = `answer_${answer}_score`;
      const rawScore = Number(row[scoreKey] ?? 0);
      const weight = Number(row.weight ?? 1);
      const weightedScore = rawScore * weight;

      const positiveType = row.positive_type ?? "";
      const negativeType = row.negative_type ?? "";

      if (weightedScore >= 0 && positiveType) {
        scores[positiveType] = (scores[positiveType] ?? 0) + weightedScore;
      } else if (weightedScore < 0 && negativeType) {
        scores[negativeType] = (scores[negativeType] ?? 0) + Math.abs(weightedScore);
      }
    }

    const code = codeTypePairs
      .map(([leftType, rightType, leftCode, rightCode]) =>
        (scores[leftType] ?? 0) >= (scores[rightType] ?? 0) ? leftCode : rightCode
      )
      .join("");

    const character =
      characters.find((item) => item.code === code && item.gender === gender) ?? null;
    const template =
      resultTemplates.find((item) => item.code === code && item.gender === gender) ?? null;

    return { code, character, template };
  }, [answers, gender, isComplete]);

  const handleAnswer = (value: number) => {
    const qid = currentQuestion?.id;
    if (!qid) return;

    setAnswers((prev) => ({ ...prev, [qid]: value }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const reset = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
  };

  if (!started) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 text-[#2a2522]">
        <h1 className="text-3xl font-bold">恋愛人格診断</h1>
        <p className="mt-3 text-[#665b55]">60問に答えると、5軸スコアから結果コードを算出します。</p>
        <div className="mt-8 rounded-2xl border border-[#ddd3c9] bg-white p-6">
          <p className="mb-3 font-semibold">性別を選択してください</p>
          <div className="flex gap-2">
            <button
              className={`rounded-full px-4 py-2 ${gender === "male" ? "bg-[#2a2522] text-white" : "bg-[#f4ede5]"}`}
              onClick={() => setGender("male")}
            >
              male
            </button>
            <button
              className={`rounded-full px-4 py-2 ${gender === "female" ? "bg-[#2a2522] text-white" : "bg-[#f4ede5]"}`}
              onClick={() => setGender("female")}
            >
              female
            </button>
          </div>
          <button
            className="mt-6 rounded-full bg-[#2a2522] px-6 py-3 font-semibold text-white"
            onClick={() => setStarted(true)}
          >
            診断をはじめる
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 text-[#2a2522]">
      <div className="mb-6">
        <p className="text-sm text-[#7d716b]">進捗: {Object.keys(answers).length} / {questions.length}</p>
        <div className="mt-2 h-2 rounded-full bg-[#eadfd3]">
          <div className="h-2 rounded-full bg-[#2a2522]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!isComplete && currentQuestion && (
        <section className="rounded-2xl border border-[#ddd3c9] bg-white p-6">
          <p className="text-sm text-[#7d716b]">Q{currentIndex + 1}</p>
          <h2 className="mt-2 text-xl font-semibold leading-8">{currentQuestion.question}</h2>
          <div className="mt-6 grid gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((answerNo) => {
              const label = currentQuestion[`answer_${answerNo}`];
              return (
                <button
                  key={answerNo}
                  className="rounded-xl border border-[#ddd3c9] px-4 py-3 text-left hover:bg-[#f9f5ef]"
                  onClick={() => handleAnswer(answerNo)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {isComplete && result && (
        <section className="rounded-2xl border border-[#ddd3c9] bg-white p-6">
          <p className="text-sm text-[#7d716b]">診断結果</p>
          <h2 className="mt-2 text-3xl font-bold">{result.code}</h2>

          {result.character && (
            <div className="mt-5 rounded-xl bg-[#f9f5ef] p-4">
              <p className="font-semibold">{result.character.character_name}</p>
              <p className="mt-1 text-sm text-[#665b55]">{result.character.archetype}</p>
              <p className="mt-3 text-sm">{result.character.love_behavior}</p>
            </div>
          )}

          {result.template && (
            <div className="mt-4 rounded-xl bg-[#f4ede5] p-4">
              <p className="font-semibold">{result.template.headline}</p>
              <p className="mt-2 text-sm">{result.template.final_message}</p>
            </div>
          )}

          {!result.character && !result.template && (
            <p className="mt-4 text-sm text-red-600">
              この gender + code に一致する表示データが見つかりませんでした。
            </p>
          )}

          <button
            className="mt-6 rounded-full bg-[#2a2522] px-6 py-3 font-semibold text-white"
            onClick={reset}
          >
            もう一度診断する
          </button>
        </section>
      )}
    </main>
  );
}