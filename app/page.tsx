"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users } from "lucide-react";
import questionsData from "@/app/data/questions.json";

const questionCount = Array.isArray(questionsData) ? questionsData.length : 0;

const heroContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Page() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f6f0ea] text-[#2a2522]">
      {/* ベース：ベージュ〜クリームの縦グラデ（白飛びしにくい） */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fdf8f5] via-[#f9f3ec] to-[#ebe4db]"
        aria-hidden
      />
      {/* 上部：淡いピンクベージュの灯り（深夜の一室・柔らかい照明） */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_115%_60%_at_50%_-12%,rgba(250,228,218,0.5),transparent_58%)]"
        aria-hidden
      />
      {/* 中央：わずかに肌色寄りのハイライト */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_38%,rgba(255,248,242,0.35),transparent_65%)]"
        aria-hidden
      />
      {/* 下部：薄いブラウン／黒の余韻（床寄りの影・落ち着き） */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(32,26,22,0.11)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_55%_at_50%_108%,rgba(24,18,14,0.16),transparent_52%)]"
        aria-hidden
      />
      {/* 丸いぼかし装飾（控えめ・安心感のあるトーン） */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[min(22rem,78vw)] w-[min(24rem,88vw)] -translate-x-1/2 rounded-full bg-[#f3d8ce] blur-[72px] opacity-[0.42] sm:blur-[88px] sm:opacity-[0.38]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[20%] top-[26%] h-56 w-56 rounded-full bg-[#e8ddd4] blur-[64px] opacity-55 sm:h-72 sm:w-72 sm:blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[8%] -left-[18%] h-72 w-72 rounded-full bg-[#cfc4bc] blur-[90px] opacity-35 sm:h-80 sm:w-80"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <motion.header
          className="text-center"
          variants={heroContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto h-px w-10 rounded-full bg-gradient-to-r from-transparent via-[#c9bfb5] to-transparent"
            aria-hidden
          />
          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[22rem] text-balance text-center text-[1.75rem] font-semibold leading-[1.22] tracking-[-0.03em] text-[#1f1a17] sm:mt-6 sm:max-w-[26rem] sm:text-[2.375rem] sm:leading-[1.18] md:max-w-2xl md:text-[2.875rem] md:leading-[1.15]"
          >
            結婚MBTI・32キャラ診断
          </motion.h1>
          <motion.h2
            variants={fadeUp}
            className="mx-auto mt-7 max-w-[19rem] text-balance text-center sm:mt-8 sm:max-w-[24rem] md:max-w-xl"
          >
            <span className="block text-[1.375rem] font-semibold leading-[1.45] tracking-[-0.02em] text-[#1f1a17] sm:text-[1.625rem] sm:leading-[1.4] md:text-[1.875rem] md:leading-[1.38]">
              あなたの「好き」は、
            </span>
            <span className="mt-1 block text-[1.375rem] font-semibold leading-[1.45] tracking-[-0.02em] text-[#1f1a17] sm:mt-1.5 sm:text-[1.625rem] sm:leading-[1.4] md:text-[1.875rem] md:leading-[1.38]">
              本当にあなたを幸せにしていますか？
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-sm text-[15px] leading-[1.75] text-[#5c534d] sm:mt-8 sm:text-base sm:leading-[1.72]"
          >
            {questionCount > 0 ? (
              <>
                {questionCount}問で、あなたが恋愛で繰り返しやすい不安や、結婚で苦しくなる理由を分析します。相手の性格診断ではなく、あなた自身の未成熟さや癖に光を当てます。
              </>
            ) : (
              <>質問データを読み込めませんでした。</>
            )}
          </motion.p>
        </motion.header>

        <motion.ul
          className="mx-auto mt-10 grid w-full max-w-sm grid-cols-3 gap-2.5 sm:mt-12 sm:gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          {[
            { n: questionCount > 0 ? String(questionCount) : "—", l: "質問", icon: Sparkles },
            { n: "32", l: "キャラ", icon: Users },
            { n: "5", l: "軸スコア", icon: Heart },
          ].map((item) => (
            <li
              key={item.l}
              className="flex flex-col items-center rounded-2xl border border-[#ebe3d9] bg-white/90 px-2 py-4 text-center shadow-[0_8px_28px_rgba(42,37,34,0.06)] backdrop-blur-sm sm:py-5"
            >
              <item.icon className="h-4 w-4 text-[#9a8b82] sm:h-5 sm:w-5" strokeWidth={1.5} />
              <span className="mt-2 text-xl font-semibold tabular-nums text-[#2a2522] sm:text-2xl">
                {item.n}
              </span>
              <span className="mt-0.5 text-[10px] font-medium tracking-wide text-[#8a7c73] sm:text-xs">
                {item.l}
              </span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-auto flex w-full flex-col items-center pt-12 sm:pt-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <Link
            href="/diagnosis"
            className="group relative w-full max-w-sm -translate-y-0.5 overflow-hidden rounded-full bg-[#2a2522] px-8 py-4 text-center text-base font-semibold text-white shadow-[0_18px_48px_rgba(28,22,18,0.32),0_6px_16px_rgba(42,37,34,0.12)] ring-1 ring-white/15 transition hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(28,22,18,0.38),0_8px_20px_rgba(42,37,34,0.14)] active:translate-y-0 active:scale-[0.99] sm:py-[1.125rem] sm:text-lg"
          >
            <span className="relative z-10">無料で診断をはじめる</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition group-hover:opacity-100" />
          </Link>
          <p className="mt-4 max-w-xs text-center text-xs leading-relaxed text-[#8a7c73]">
            所要時間は目安で10〜15分。回答は端末内にのみ保存され、落ち着いた画面で進められます。
          </p>
        </motion.div>
      </div>
    </main>
  );
}
