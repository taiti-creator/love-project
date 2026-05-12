"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users } from "lucide-react";

const heroContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7f2] text-[#2a2522]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(255,255,255,0.85),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#efe6dc] blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#e8e0f4] blur-3xl opacity-50" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
        <motion.header
          className="text-center"
          variants={heroContainer}
          initial="initial"
          animate="animate"
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.22em] text-[#8a7c73] sm:text-xs"
          >
            深層恋愛タイプ診断 · 64キャラ
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-6 max-w-[17rem] text-[1.65rem] font-semibold leading-snug tracking-tight text-[#1f1a17] sm:max-w-none sm:text-4xl sm:leading-tight"
          >
            好きになる人と、
            <br />
            幸せになれる人は違う。
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-[#5c534d] sm:text-base sm:leading-relaxed"
          >
            60問の質問で、あなたの「恋愛」と「結婚」のズレが輪郭として見えてきます。64タイプの中から、あなただけの傾向をまとめます。
          </motion.p>
        </motion.header>

        <motion.ul
          className="mx-auto mt-10 grid w-full max-w-sm grid-cols-3 gap-2.5 sm:mt-12 sm:gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          {[
            { n: "60", l: "質問", icon: Sparkles },
            { n: "64", l: "キャラ", icon: Users },
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
            className="group relative w-full max-w-sm overflow-hidden rounded-full bg-[#2a2522] px-8 py-4 text-center text-base font-semibold text-white shadow-[0_14px_40px_rgba(42,37,34,0.28)] transition hover:shadow-[0_18px_48px_rgba(42,37,34,0.34)] active:scale-[0.99] sm:py-[1.125rem] sm:text-lg"
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
