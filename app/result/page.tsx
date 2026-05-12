"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const dummyResults = [
  { name: "港区女子", mood: "温度差に敏感なロマン派" },
  { name: "商社男子", mood: "余裕と本音のギャップ型" },
  { name: "IT男子", mood: "静かな愛情の現実派" },
];

export default function ResultPage() {
  const [resultIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const raw = window.sessionStorage.getItem("diagnosisAnswers");
    if (!raw) return 0;

    try {
      const parsed = JSON.parse(raw) as Array<{ questionId: number; answer: number }>;
      const seed = parsed.reduce((sum, item) => sum + item.questionId * item.answer, 0);
      return seed % dummyResults.length;
    } catch {
      return 0;
    }
  });

  const picked = dummyResults[resultIndex];

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-8 text-[#2a2522]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-md rounded-3xl bg-white p-7 shadow-[0_16px_46px_rgba(35,25,15,0.09)]"
      >
        <p className="text-xs tracking-[0.15em] text-[#8a7c73]">RESULT</p>
        <h1 className="mt-3 text-3xl font-semibold">{picked.name}</h1>
        <p className="mt-3 text-[15px] leading-7 text-[#625751]">
          {picked.mood}
          <br />
          あなたの恋愛人格を丁寧に可視化する準備が整いました。
        </p>

        <div className="mt-7 grid gap-2 rounded-2xl bg-[#f8f1e9] p-4 text-sm text-[#574d47]">
          <p>・相手の温度差を読む速度が速い</p>
          <p>・本命ほど感情が繊細に揺れる</p>
          <p>・関係の主導権バランスが重要</p>
        </div>

        <div className="mt-7 flex gap-2">
          <Link
            href="/diagnosis"
            className="flex-1 rounded-full bg-[#2a2522] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            もう一度診断する
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-full border border-[#d8c9bb] bg-white px-4 py-3 text-center text-sm font-semibold"
          >
            LPへ戻る
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
