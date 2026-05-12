"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

/** 1=強い肯定 … 7=強い否定（保存値は従来どおり 1〜7） */
const ANSWER_SCALE_LABELS: Record<number, string> = {
  1: "とても当てはまる",
  2: "かなり当てはまる",
  3: "少し当てはまる",
  4: "どちらでもない",
  5: "あまり当てはまらない",
  6: "ほとんど当てはまらない",
  7: "全く当てはまらない",
};

const SCALE_BUTTON_META: Record<
  number,
  { sizeClass: string; colors: { idle: string; selected: string; ring: string } }
> = {
  1: {
    sizeClass:
      "h-10 w-10 min-h-10 min-w-10 sm:h-12 sm:w-12 sm:min-h-[3rem] sm:min-w-[3rem]",
    colors: {
      idle: "border-[#3d8f62]/45 bg-[#e8f4ec] text-[#1f5a3a]",
      selected: "border-[#2d6a4a] bg-[#2d6a4a] text-white shadow-[0_10px_28px_rgba(45,106,74,0.45)]",
      ring: "ring-[#2d6a4a]/35",
    },
  },
  2: {
    sizeClass: "h-10 w-10 min-h-10 min-w-10 sm:h-11 sm:w-11 sm:min-h-[2.75rem] sm:min-w-[2.75rem]",
    colors: {
      idle: "border-[#4a9d72]/40 bg-[#eef7f1] text-[#256844]",
      selected: "border-[#35825c] bg-[#35825c] text-white shadow-[0_8px_22px_rgba(53,130,92,0.38)]",
      ring: "ring-[#35825c]/30",
    },
  },
  3: {
    sizeClass: "h-9 w-9 min-h-9 min-w-9 sm:h-10 sm:w-10 sm:min-h-10 sm:min-w-10",
    colors: {
      idle: "border-[#6aab8a]/38 bg-[#f2faf5] text-[#2d5c45]",
      selected: "border-[#4a9d72] bg-[#4a9d72] text-white shadow-[0_6px_18px_rgba(74,157,114,0.32)]",
      ring: "ring-[#4a9d72]/28",
    },
  },
  4: {
    sizeClass: "h-8 w-8 min-h-8 min-w-8 sm:h-8 sm:w-8",
    colors: {
      idle: "border-[#c9bfb5] bg-[#f3f0ec] text-[#6f645d]",
      selected: "border-[#9a9189] bg-[#9a9189] text-white shadow-[0_6px_16px_rgba(120,112,104,0.28)]",
      ring: "ring-[#9a9189]/30",
    },
  },
  5: {
    sizeClass: "h-9 w-9 min-h-9 min-w-9 sm:h-10 sm:w-10 sm:min-h-10 sm:min-w-10",
    colors: {
      idle: "border-[#a890c4]/42 bg-[#f5f0fa] text-[#5c4578]",
      selected: "border-[#8b6fb0] bg-[#8b6fb0] text-white shadow-[0_6px_18px_rgba(139,111,176,0.32)]",
      ring: "ring-[#8b6fb0]/28",
    },
  },
  6: {
    sizeClass: "h-10 w-10 min-h-10 min-w-10 sm:h-11 sm:w-11 sm:min-h-[2.75rem] sm:min-w-[2.75rem]",
    colors: {
      idle: "border-[#8b6fb0]/45 bg-[#efe8f7] text-[#4f3a68]",
      selected: "border-[#6f5494] bg-[#6f5494] text-white shadow-[0_8px_22px_rgba(111,84,148,0.38)]",
      ring: "ring-[#6f5494]/30",
    },
  },
  7: {
    sizeClass:
      "h-10 w-10 min-h-10 min-w-10 sm:h-12 sm:w-12 sm:min-h-[3rem] sm:min-w-[3rem]",
    colors: {
      idle: "border-[#6f5494]/50 bg-[#ede6f4] text-[#3d2d52]",
      selected: "border-[#5a3f7a] bg-[#5a3f7a] text-white shadow-[0_10px_28px_rgba(90,63,122,0.45)]",
      ring: "ring-[#5a3f7a]/35",
    },
  },
};

const questions = questionsData as Question[];

export default function DiagnosisPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female">("female");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    };
  }, []);

  const handleSelect = (value: number) => {
    if (!current || isLoadingResult || pendingAnswer !== null) return;

    setPendingAnswer(value);
    if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    commitTimerRef.current = setTimeout(() => {
      commitTimerRef.current = null;
      setPendingAnswer(null);

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
    }, 260);
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

              <div className="mt-8 w-full max-w-full overflow-x-hidden">
                <div
                  className="flex w-full items-center justify-between gap-0.5 sm:gap-1.5"
                  role="radiogroup"
                  aria-label="回答の程度（1が最も当てはまる）"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                    const meta = SCALE_BUTTON_META[n];
                    const label = ANSWER_SCALE_LABELS[n];
                    const selected = pendingAnswer === n;
                    const dimOthers = pendingAnswer !== null && !selected;
                    return (
                      <div key={n} className="flex min-w-0 flex-1 justify-center">
                        <motion.button
                          type="button"
                          aria-label={label}
                          title={label}
                          disabled={pendingAnswer !== null}
                          whileTap={
                            pendingAnswer === null ? { scale: 0.94 } : undefined
                          }
                          animate={{
                            scale: selected ? 1.1 : 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 460,
                            damping: 22,
                          }}
                          className={[
                            "touch-manipulation rounded-full border-2 transition-colors duration-200",
                            meta.sizeClass,
                            selected
                              ? `${meta.colors.selected} z-[1] ring-4 ring-offset-2 ring-offset-white ${meta.colors.ring}`
                              : `${meta.colors.idle} shadow-[0_2px_8px_rgba(42,37,34,0.06)] hover:brightness-[0.99]`,
                            dimOthers ? "pointer-events-none opacity-40" : "",
                          ].join(" ")}
                          onClick={() => handleSelect(n)}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between gap-2 px-0.5 text-[11px] font-medium tracking-[0.06em] sm:text-xs">
                  <span className="max-w-[42%] text-left text-[#356d52]">そう思う</span>
                  <span className="max-w-[42%] text-right text-[#5c4578]">
                    そう思わない
                  </span>
                </div>
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
