"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import questionsData from "@/app/data/questions.json";

type Question = {
  id: string;
  question: string;
  category?: string;
  [key: string]: string | undefined;
};

type StoredAnswer = {
  questionId: number;
  answer: number;
};

const PART_SIZE = 5;

const loadingMessages = [
  "結婚MBTIの傾向を読み取っています…",
  "恋愛の癖と、結婚で苦しくなる理由を整理中…",
  "未成熟さが出やすいパターンを照合中…",
  "結婚MBTIの結果を生成しています…",
];

/** questions.json の category キー → パート見出し（なければキーをそのまま表示） */
const CATEGORY_META: Record<
  string,
  { partTitle: string; themes: string }
> = {
  sex: {
    partTitle: "親密性パート",
    themes: "愛情確認・触れ合い・距離感",
  },
  金: {
    partTitle: "金銭感覚パート",
    themes: "安定・将来・生活感",
  },
  孤独: {
    partTitle: "孤独耐性パート",
    themes: "一人時間・放置耐性・連絡頻度",
  },
  承認: {
    partTitle: "承認欲求パート",
    themes: "必要とされたい気持ち・比較・不安",
  },
  支配: {
    partTitle: "主導性パート",
    themes: "支配・依存・合わせ方",
  },
};

const ANSWER_SCALE_LABELS: Record<number, string> = {
  1: "とても当てはまる",
  2: "かなり当てはまる",
  3: "少し当てはまる",
  4: "どちらでもない",
  5: "あまり当てはまらない",
  6: "ほとんど当てはまらない",
  7: "全く当てはまらない",
};

function scaleLabelForQuestion(q: Question, n: number): string {
  const raw = q[`answer_${n}`];
  if (typeof raw === "string" && raw.trim()) return raw;
  return ANSWER_SCALE_LABELS[n] ?? "";
}

const SCALE_BUTTON_META: Record<
  number,
  { sizeClass: string; colors: { idle: string; selected: string; ring: string } }
> = {
  1: {
    sizeClass:
      "h-9 w-9 min-h-9 min-w-9 sm:h-10 sm:w-10 sm:min-h-10 sm:min-w-10 md:h-11 md:w-11",
    colors: {
      idle: "border-[#3d8f62]/45 bg-[#e8f4ec] text-[#1f5a3a]",
      selected:
        "border-[#2d6a4a] bg-[#2d6a4a] text-white shadow-[0_10px_28px_rgba(45,106,74,0.45)]",
      ring: "ring-[#2d6a4a]/35",
    },
  },
  2: {
    sizeClass: "h-8 w-8 min-h-8 min-w-8 sm:h-9 sm:w-9 sm:min-h-9 sm:min-w-9 md:h-10 md:w-10",
    colors: {
      idle: "border-[#4a9d72]/40 bg-[#eef7f1] text-[#256844]",
      selected:
        "border-[#35825c] bg-[#35825c] text-white shadow-[0_8px_22px_rgba(53,130,92,0.38)]",
      ring: "ring-[#35825c]/30",
    },
  },
  3: {
    sizeClass: "h-8 w-8 min-h-8 min-w-8 sm:h-8 sm:w-8 md:h-9 md:w-9",
    colors: {
      idle: "border-[#6aab8a]/38 bg-[#f2faf5] text-[#2d5c45]",
      selected:
        "border-[#4a9d72] bg-[#4a9d72] text-white shadow-[0_6px_18px_rgba(74,157,114,0.32)]",
      ring: "ring-[#4a9d72]/28",
    },
  },
  4: {
    sizeClass: "h-7 w-7 min-h-7 min-w-7 sm:h-8 sm:w-8",
    colors: {
      idle: "border-[#c9bfb5] bg-[#f3f0ec] text-[#6f645d]",
      selected:
        "border-[#9a9189] bg-[#9a9189] text-white shadow-[0_6px_16px_rgba(120,112,104,0.28)]",
      ring: "ring-[#9a9189]/30",
    },
  },
  5: {
    sizeClass: "h-8 w-8 min-h-8 min-w-8 sm:h-8 sm:w-8 md:h-9 md:w-9",
    colors: {
      idle: "border-[#a890c4]/42 bg-[#f5f0fa] text-[#5c4578]",
      selected:
        "border-[#8b6fb0] bg-[#8b6fb0] text-white shadow-[0_6px_18px_rgba(139,111,176,0.32)]",
      ring: "ring-[#8b6fb0]/28",
    },
  },
  6: {
    sizeClass: "h-8 w-8 min-h-8 min-w-8 sm:h-9 sm:w-9 sm:min-h-9 sm:min-w-9 md:h-10 md:w-10",
    colors: {
      idle: "border-[#8b6fb0]/45 bg-[#efe8f7] text-[#4f3a68]",
      selected:
        "border-[#6f5494] bg-[#6f5494] text-white shadow-[0_8px_22px_rgba(111,84,148,0.38)]",
      ring: "ring-[#6f5494]/30",
    },
  },
  7: {
    sizeClass:
      "h-9 w-9 min-h-9 min-w-9 sm:h-10 sm:w-10 sm:min-h-10 sm:min-w-10 md:h-11 md:w-11",
    colors: {
      idle: "border-[#6f5494]/50 bg-[#ede6f4] text-[#3d2d52]",
      selected:
        "border-[#5a3f7a] bg-[#5a3f7a] text-white shadow-[0_10px_28px_rgba(90,63,122,0.45)]",
      ring: "ring-[#5a3f7a]/35",
    },
  },
};

const questions = questionsData as Question[];

function partHeaderForQuestions(slice: Question[]): { title: string; themes: string } {
  const keys = slice.map((q) => q.category ?? "").filter(Boolean);
  const unique: string[] = [];
  for (const k of keys) {
    if (!unique.includes(k)) unique.push(k);
  }
  const titles = unique.map((k) => CATEGORY_META[k]?.partTitle ?? `${k}パート`);
  const themes = unique.map((k) => CATEGORY_META[k]?.themes ?? "あなたの傾向");
  return {
    title: titles.join(" · "),
    themes: themes.join(" · "),
  };
}

function getAnswerAtGlobalIndex(answers: StoredAnswer[], g: number): number | undefined {
  const q = questions[g];
  if (!q) return undefined;
  const id = Number(q.id);
  return answers.find((a) => a.questionId === id)?.answer;
}

export default function DiagnosisPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female">("female");
  const [started, setStarted] = useState(false);
  const [partCursor, setPartCursor] = useState(0);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [pending, setPending] = useState<{ globalIndex: number; value: number } | null>(
    null
  );
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = questions.length;
  const lastPartIndex = Math.ceil(total / PART_SIZE) - 1;

  const progress = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((answers.length / total) * 100);
  }, [answers.length, total]);

  const partStart = partCursor * PART_SIZE;
  const partEndExclusive = Math.min(partStart + PART_SIZE, total);
  const partSlice = useMemo(
    () => questions.slice(partStart, partEndExclusive),
    [partStart, partEndExclusive]
  );
  const partHeader = useMemo(() => partHeaderForQuestions(partSlice), [partSlice]);

  const rangeLabel = `${partStart + 1}〜${partEndExclusive}問`;
  const nextGlobalIndex = answers.length;
  const workingPartIndex = total > 0 ? Math.min(Math.floor(nextGlobalIndex / PART_SIZE), lastPartIndex) : 0;

  const waitingForNextPartAdvance =
    answers.length > 0 &&
    answers.length < total &&
    answers.length % PART_SIZE === 0 &&
    partCursor === answers.length / PART_SIZE - 1;

  const showJumpToWork =
    answers.length > 0 &&
    partCursor < workingPartIndex &&
    !waitingForNextPartAdvance;

  const showNextPartButton = waitingForNextPartAdvance;

  const showAlmostThere =
    started &&
    !isLoadingResult &&
    total > PART_SIZE &&
    answers.length >= total - PART_SIZE &&
    answers.length < total;

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

  const handleSelect = useCallback(
    (globalIndex: number, value: number) => {
      if (isLoadingResult || pending !== null) return;
      if (globalIndex !== answers.length) return;
      const q = questions[globalIndex];
      if (!q) return;

      setPending({ globalIndex, value });
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
      commitTimerRef.current = setTimeout(() => {
        commitTimerRef.current = null;
        setPending(null);

        const nextAnswers = [
          ...answers,
          { questionId: Number(q.id), answer: value },
        ];
        setAnswers(nextAnswers);

        if (nextAnswers.length >= total) {
          setIsLoadingResult(true);
        }
      }, 280);
    },
    [answers, isLoadingResult, pending, total]
  );

  const handleHeaderBack = () => {
    if (pending !== null || isLoadingResult) return;
    if (!started) return;
    if (partCursor > 0) {
      setPartCursor((p) => p - 1);
      return;
    }
    setStarted(false);
  };

  const handleGoToNextPart = () => {
    if (pending !== null || isLoadingResult) return;
    if (!showNextPartButton) return;
    setPartCursor((p) => p + 1);
  };

  const handleJumpToCurrentWork = () => {
    if (pending !== null || isLoadingResult) return;
    setPartCursor(workingPartIndex);
  };

  if (total === 0 && !isLoadingResult) {
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
        <div className="mx-auto max-w-md rounded-3xl bg-white p-7 text-center shadow-[0_14px_40px_rgba(40,30,20,0.08)]">
          <h1 className="text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-[#1f1a17] sm:text-[1.75rem] sm:leading-tight">
            結婚MBTI・32キャラ診断
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-left text-sm leading-relaxed text-[#675b54]">
            相手を測るためではなく、あなた自身の恋愛の癖・未成熟さ・結婚で苦しくなりやすい理由を見える化します。
            {total}問を<strong className="font-semibold text-[#3a332f]">{PART_SIZE}問ずつ</strong>
            進めます。直感で、当てはまる程度を選んでください。
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
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
              type="button"
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
            type="button"
            onClick={() => {
              setPartCursor(0);
              setAnswers([]);
              setStarted(true);
            }}
            className="mt-6 w-full rounded-full bg-[#2a2522] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_32px_rgba(42,37,34,0.22)] transition hover:shadow-[0_12px_36px_rgba(42,37,34,0.28)] active:scale-[0.99]"
          >
            診断を開始する
          </button>
          <p className="mt-5 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-[#8a7c73] underline-offset-4 transition hover:text-[#5c534d] hover:underline"
            >
              トップに戻る
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-5 pb-10 text-[#2a2522] sm:py-6">
      <div className="mx-auto max-w-md">
        <div className="mb-5 flex items-start gap-2">
          <button
            type="button"
            onClick={handleHeaderBack}
            disabled={isLoadingResult || pending !== null}
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#e8ddd2] bg-white/90 text-[#4a423c] shadow-sm transition hover:bg-[#fffdfa] disabled:pointer-events-none disabled:opacity-40"
            aria-label={partCursor > 0 ? "前の5問へ戻る" : "性別選択に戻る"}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <div className="min-w-0 flex-1 rounded-2xl border border-[#ebe3d9] bg-white/90 p-4 shadow-[0_10px_32px_rgba(40,30,20,0.06)] sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-medium tracking-[0.16em] text-[#8a7c73]">
                  進行状況
                </p>
                <p className="mt-1 text-base font-semibold leading-snug text-[#2a2522] sm:text-lg">
                  現在{" "}
                  <span className="tabular-nums text-[#1f1a17]">{rangeLabel}</span>
                  <span className="text-sm font-normal text-[#8a7c73]">
                    {" "}
                    / 全{total}問
                  </span>
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#f4ebe3] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#5c534d]">
                {progress}%
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#eadfd3]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#2a2522] to-[#3d3530]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            {showAlmostThere && (
              <p className="mt-3 text-xs leading-relaxed text-[#7a6d64]">
                あと少しで結婚MBTIの結果です。このパートも、直感のまま選んで大丈夫です。
              </p>
            )}
          </div>
        </div>

        {showJumpToWork && (
          <div className="mb-4 rounded-2xl border border-[#e8ddd2] bg-[#fffdfa] px-4 py-3 text-sm text-[#5c534d] shadow-sm">
            <p className="text-xs leading-relaxed text-[#7a6d64]">
              ここから先は、すでに回答済みのブロックです。
            </p>
            <button
              type="button"
              onClick={handleJumpToCurrentWork}
              className="mt-2 w-full rounded-full border border-[#2a2522] bg-[#2a2522] py-2.5 text-xs font-semibold text-white transition hover:opacity-95"
            >
              回答を続ける（第{workingPartIndex + 1}パートへ）
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isLoadingResult ? (
            <motion.div
              key={partCursor}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-[#f0e8df] bg-white p-5 shadow-[0_16px_48px_rgba(40,30,20,0.08)] sm:p-7 sm:pb-8"
            >
              <div className="rounded-2xl border border-[#ebe3d9] bg-gradient-to-b from-[#fffdfa] to-[#f9f4ee] px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-[11px] font-medium tracking-[0.14em] text-[#9a8b82]">
                  このパートで見ること
                </p>
                <p className="mt-2 text-sm font-semibold leading-snug text-[#2a2522] sm:text-base">
                  {partHeader.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#6f645d] sm:text-[13px]">
                  {partHeader.themes}
                </p>
              </div>

              <ul className="mt-8 flex flex-col gap-8 sm:gap-10">
                {partSlice.map((q, slot) => {
                  const globalIndex = partStart + slot;
                  const saved = getAnswerAtGlobalIndex(answers, globalIndex);
                  const isActive = globalIndex === nextGlobalIndex && globalIndex < total;
                  const isPast = saved !== undefined;
                  const isFuture = !isPast && globalIndex > nextGlobalIndex;
                  const rowPending =
                    pending?.globalIndex === globalIndex ? pending.value : null;

                  return (
                    <li
                      key={q.id}
                      className={[
                        "rounded-2xl border px-4 py-5 transition sm:px-5 sm:py-6",
                        isActive
                          ? "border-[#dcd2c6] bg-[#fffdfa] shadow-[0_8px_28px_rgba(42,37,34,0.07)]"
                          : isFuture
                            ? "border-[#f0ebe6] bg-[#fdfbf9] opacity-[0.42]"
                            : "border-[#efe8e0] bg-[#fffcfa] opacity-[0.78]",
                      ].join(" ")}
                    >
                      <p className="text-[11px] font-medium tabular-nums text-[#8a7c73]">
                        Q{globalIndex + 1}
                      </p>
                      <p
                        className={[
                          "mt-2 text-[15px] font-medium leading-relaxed sm:text-base sm:leading-relaxed",
                          isActive ? "text-[#1f1a17]" : "text-[#4a423c]",
                        ].join(" ")}
                      >
                        {q.question}
                      </p>

                      <div className="mt-6 w-full max-w-full overflow-x-hidden">
                        <div
                          className="flex w-full items-center justify-between gap-0.5 sm:gap-1.5"
                          role="radiogroup"
                          aria-label={`Q${globalIndex + 1}の回答（1が最も当てはまる）`}
                          aria-disabled={!isActive}
                        >
                          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                            const meta = SCALE_BUTTON_META[n];
                            const label = scaleLabelForQuestion(q, n);
                            const selected =
                              rowPending !== null
                                ? rowPending === n
                                : saved === n;
                            const dimOthers =
                              isActive && pending !== null && rowPending !== n;
                            const interactive = isActive && pending === null;
                            const showAnswered = isPast && saved === n;

                            return (
                              <div
                                key={n}
                                className="flex min-w-0 flex-1 justify-center px-0.5 py-0.5 sm:px-0.5"
                              >
                                <motion.button
                                  type="button"
                                  aria-label={label}
                                  title={label}
                                  disabled={!interactive}
                                  whileTap={
                                    interactive ? { scale: 0.92 } : undefined
                                  }
                                  animate={{
                                    scale: selected ? 1.1 : 1,
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                  }}
                                  className={[
                                    "touch-manipulation rounded-full border-2 transition-colors duration-200",
                                    meta.sizeClass,
                                    selected
                                      ? `${meta.colors.selected} z-[1] ring-4 ring-offset-2 ring-offset-white ${meta.colors.ring}`
                                      : `${meta.colors.idle} shadow-[0_2px_8px_rgba(42,37,34,0.06)]`,
                                    !interactive && !showAnswered
                                      ? "pointer-events-none opacity-35"
                                      : "",
                                    dimOthers ? "pointer-events-none opacity-35" : "",
                                    isPast && !selected
                                      ? "pointer-events-none opacity-30"
                                      : "",
                                    showAnswered
                                      ? `${meta.colors.selected} pointer-events-none`
                                      : "",
                                  ].join(" ")}
                                  onClick={() => handleSelect(globalIndex, n)}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex justify-between gap-2 px-0.5 text-[10px] font-medium tracking-[0.05em] text-[#8a7c73] sm:text-[11px]">
                          <span className="max-w-[44%] text-left text-[#356d52]">
                            そう思う
                          </span>
                          <span className="max-w-[44%] text-right text-[#5c4578]">
                            そう思わない
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {showNextPartButton && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.35 }}
                  className="mt-10"
                >
                  <button
                    type="button"
                    onClick={handleGoToNextPart}
                    className="w-full rounded-full bg-[#2a2522] px-6 py-4 text-base font-semibold text-white shadow-[0_14px_40px_rgba(42,37,34,0.26)] transition hover:shadow-[0_18px_48px_rgba(42,37,34,0.32)] active:scale-[0.99]"
                  >
                    次の5問へ
                  </button>
                </motion.div>
              )}

            </motion.div>
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
