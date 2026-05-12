"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import questionsData from "@/app/data/questions.json";

type Question = {
  id: string;
  question: string;
  [key: string]: string;
};

type StoredAnswer = {
  questionId: number;
  answer: number;
};

const loadingMessages = [
  "深層恋愛人格を分析中…",
  "愛着構造を解析中…",
  "感情依存パターンを照合中…",
  "無意識の恋愛傾向を生成中…",
];

const questions = questionsData as Question[];

export default function DiagnosisPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female">("female");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const current = questions[index];
  const total = questions.length;
  const progress = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((answers.length / total) * 100);
  }, [answers.length, total]);

  useEffect(() => {
    if (!isLoadingResult) return;

    const messageTimer = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 700);

    const navTimer = setTimeout(() => {
      sessionStorage.setItem(
        "diagnosisPayload",
        JSON.stringify({
          gender,
          answers,
        })
      );
      router.push("/result");
    }, 3000);

    return () => {
      clearInterval(messageTimer);
      clearTimeout(navTimer);
    };
  }, [answers, gender, isLoadingResult, router]);

  const handleSelect = (value: number) => {
    if (!current || isLoadingResult) return;

    const nextAnswers = [
      ...answers,
      {
        questionId: Number(current.id),
        answer: value,
      },
    ];
    setAnswers(nextAnswers);

    if (index >= total - 1) {
      setIsLoadingResult(true);
      return;
    }

    setIndex((prev) => prev + 1);
  };

  if (!current && !isLoadingResult) {
    return (
      <main className="min-h-screen bg-[#fbf7f2] px-4 py-10 text-[#2a2522]">
        <div className="mx-auto max-w-md rounded-3xl bg-white/85 p-6 shadow-sm">
          質問データが見つかりませんでした。
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-[#fbf7f2] px-4 py-10 text-[#2a2522]">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-[0_14px_40px_rgba(40,30,20,0.08)]">
          <p className="text-xs tracking-[0.14em] text-[#8a7c73]">DIAGNOSIS</p>
          <h1 className="mt-2 text-2xl font-semibold">恋愛人格の深層分析</h1>
          <p className="mt-3 text-sm leading-7 text-[#675b54]">
            60の質問から、あなたの無意識パターンを5軸で抽出します。
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => setGender("female")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                gender === "female"
                  ? "bg-[#2a2522] text-white"
                  : "border border-[#e8ddd2] bg-[#fffdfa] text-[#3a332f]"
              }`}
            >
              女性として診断
            </button>
            <button
              onClick={() => setGender("male")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                gender === "male"
                  ? "bg-[#2a2522] text-white"
                  : "border border-[#e8ddd2] bg-[#fffdfa] text-[#3a332f]"
              }`}
            >
              男性として診断
            </button>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="mt-6 w-full rounded-full bg-[#2a2522] px-4 py-3 text-sm font-semibold text-white"
          >
            診断を開始する
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-6 text-[#2a2522]">
      <div className="mx-auto max-w-md">
        <div className="mb-5 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center justify-between text-sm text-[#6f645d]">
            <span>恋愛人格診断</span>
            <span>
              {Math.min(answers.length + 1, total)} / {total}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#eadfd3]">
            <motion.div
              className="h-full rounded-full bg-[#2a2522]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isLoadingResult ? (
            <motion.section
              key={current?.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="rounded-3xl bg-white p-6 shadow-[0_14px_40px_rgba(40,30,20,0.08)]"
            >
              <p className="text-xs tracking-[0.14em] text-[#8a7c73]">QUESTION</p>
              <h1 className="mt-3 text-xl leading-8">{current?.question}</h1>

              <div className="mt-6 grid gap-2.5">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <motion.button
                    key={n}
                    whileTap={{ scale: 0.985 }}
                    className="rounded-2xl border border-[#e8ddd2] bg-[#fffdfa] px-4 py-3 text-left text-[15px] text-[#3a332f] shadow-sm transition hover:bg-[#f8f0e8]"
                    onClick={() => handleSelect(n)}
                  >
                    {current?.[`answer_${n}`]}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-[#2c2522] p-8 text-center text-[#f8efe7] shadow-[0_20px_60px_rgba(25,18,12,0.35)]"
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-5 h-2 w-24 rounded-full bg-[#e4cdb7]"
              />
              <p className="text-sm tracking-[0.08em] text-[#ceb7a3]">ANALYZING</p>
              <motion.p
                key={loadingMessages[loadingIndex]}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-lg"
              >
                {loadingMessages[loadingIndex]}
              </motion.p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
