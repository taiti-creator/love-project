"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Heart, Lock, Sparkles, Star, Users } from "lucide-react";
import questionsData from "@/app/data/questions.json";

const questionCount = Array.isArray(questionsData) ? questionsData.length : 0;
const questionLabel = questionCount > 0 ? String(questionCount) : "60";

const heroContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** 植物モチーフ（極薄・主張控えめ） */
function BotanicalBackdrop({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M160 200c-8-28-4-52 12-72 10-12 8-24-2-36-18 8-28 22-32 42-4 20 2 44 22 66Z"
        className="fill-[#c9a88e]/[0.12]"
      />
      <path
        d="M48 210c12-36 6-62-10-84-8-10-6-22 4-32 16 12 26 30 28 52 2 22-6 46-22 64Z"
        className="fill-[#a8907a]/[0.1]"
      />
      <path
        stroke="#9a8b82"
        strokeOpacity={0.15}
        strokeWidth={0.6}
        d="M100 20v80M85 60c16 8 30 8 44 0M72 100c20 12 40 12 56 0"
      />
    </svg>
  );
}

function HeroIllustration() {
  const [useFallback, setUseFallback] = useState(false);

  const onImgError = useCallback(() => {
    setUseFallback(true);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[280px] justify-center sm:max-w-[300px] lg:max-w-[340px]">
      {/* 淡いハロー */}
      <div
        className="pointer-events-none absolute left-1/2 top-[18%] h-[min(72%,18rem)] w-[min(90%,20rem)] -translate-x-1/2 rounded-full bg-[#f0e0cc]/[0.55] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 bottom-[12%] h-32 w-32 rounded-full bg-[#e8d4c4]/30 blur-2xl"
        aria-hidden
      />

      <BotanicalBackdrop className="pointer-events-none absolute -right-2 top-8 h-40 w-32 opacity-90" />
      <BotanicalBackdrop className="pointer-events-none absolute -bottom-4 -left-6 h-36 w-28 rotate-[15deg] scale-x-[-1] opacity-80" />

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.85rem] border border-white/60 bg-white/40 shadow-[0_20px_56px_rgba(55,40,28,0.08)] backdrop-blur-[2px]">
        {!useFallback ? (
          <Image
            src="/hero-woman.png"
            alt=""
            role="presentation"
            fill
            className="object-cover object-[50%_15%]"
            sizes="(max-width: 1024px) 280px, 340px"
            priority
            onError={onImgError}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#faf4ec] to-[#ebe3d9] px-6 text-center">
            <div className="h-24 w-24 rounded-full bg-[#f0e4d8]/80 blur-sm" aria-hidden />
            <p className="mt-4 text-xs leading-relaxed text-[#8a7c73]">
              イラストを読み込めませんでした。
              <br />
              <span className="text-[11px]">落ち着いたトーンで表示を続けます。</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fffaf5] via-[#f8efe6] to-[#eee3d7] text-[#2a2522]">
      {/* 奥行き：ぼかし円 */}
      <div
        className="pointer-events-none absolute -left-[20%] top-[-10%] h-[min(28rem,85vw)] w-[min(28rem,85vw)] rounded-full bg-[#f3d8c8]/35 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[15%] top-[32%] h-[min(22rem,70vw)] w-[min(22rem,70vw)] rounded-full bg-[#e5d8cc]/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-8%] left-[20%] h-[min(20rem,60vw)] w-[min(20rem,60vw)] rounded-full bg-[#dcd0c4]/30 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-28 pt-12 sm:px-8 sm:pb-24 sm:pt-16 md:px-10 md:pt-20 lg:px-12">
        <motion.div
          className="flex w-full flex-1 flex-col"
          variants={heroContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:max-w-2xl lg:text-left"
          >
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e5dcd2]/80 bg-[#f2ebe3]/90 px-4 py-2.5 text-[11px] font-medium tracking-wide text-[#6b5346] shadow-sm backdrop-blur-sm sm:text-xs">
                <Star className="h-3.5 w-3.5 shrink-0 fill-[#c4a990]/50 text-[#8a7264]" strokeWidth={1.2} aria-hidden />
                結婚MBTI・32キャラ診断
              </span>
            </div>

            <h1 className="font-serif-jp mt-8 text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1a1512] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]">
              結婚MBTI
            </h1>

            <p className="font-serif-jp mx-auto mt-5 max-w-md text-base leading-[1.75] tracking-[-0.01em] text-[#5c4f47] sm:text-lg lg:mx-0">
              <span className="block">自分の恋愛パターンを知る、</span>
              <span className="block">幸せな結婚のための自己分析</span>
            </p>

            <div
              className="mx-auto mt-8 h-px w-14 bg-gradient-to-r from-transparent via-[#c9bfb5] to-transparent lg:mx-0"
              aria-hidden
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 grid w-full flex-1 grid-cols-1 items-start gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_min(340px,38vw)] lg:gap-x-16 lg:gap-y-10"
          >
            <div className="order-2 flex min-w-0 flex-col lg:order-1">
              <div className="text-center lg:text-left">
                <p className="font-serif-jp text-balance text-[1.375rem] font-semibold leading-[1.72] tracking-[-0.02em] text-[#1f1a17] sm:text-[1.5rem] md:text-[1.625rem] lg:text-[1.75rem] lg:leading-[1.78]">
                  <span className="block">あなたの「好き」は、</span>
                  <span className="block">本当にあなたを</span>
                  <span className="block">幸せにしていますか？</span>
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-lg space-y-5 text-left text-[15px] leading-[1.9] text-[#5c534d] sm:text-base lg:mx-0">
                <p>
                  {questionLabel}問で、あなたが恋愛で繰り返しやすい不安や、
                  <br className="hidden sm:block" />
                  結婚で苦しくなる理由を分析します。
                </p>
                <p>
                  相手の性格診断ではなく、
                  <br className="hidden sm:block" />
                  あなた自身の恋愛パターンや心の反応を
                  <br className="hidden sm:block" />
                  読み解く自己分析です。
                </p>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end lg:pt-2">
              <HeroIllustration />
            </div>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mx-auto mt-14 grid w-full max-w-2xl grid-cols-3 gap-2 sm:mt-16 sm:gap-3 md:max-w-3xl md:gap-4"
          >
            {[
              { n: questionLabel, l: "質問", icon: Sparkles },
              { n: "32", l: "キャラ", icon: Users },
              { n: "5", l: "軸スコア", icon: Heart },
            ].map((item) => (
              <li
                key={item.l}
                className="flex flex-col items-center rounded-2xl border border-[#e8e0d6] bg-white/90 px-1.5 py-5 shadow-[0_10px_36px_rgba(45,35,25,0.06)] sm:rounded-3xl sm:px-3 sm:py-7"
              >
                <item.icon className="h-4 w-4 text-[#a8988a] sm:h-5 sm:w-5" strokeWidth={1.4} />
                <span className="mt-3 text-lg font-semibold tabular-nums text-[#1f1a17] sm:mt-4 sm:text-2xl md:text-3xl">
                  {item.n}
                </span>
                <span className="mt-1 text-[10px] font-medium tracking-wide text-[#8a7c73] sm:text-xs">
                  {item.l}
                </span>
              </li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-14 flex w-full max-w-lg flex-col items-center sm:mt-16 md:max-w-xl"
          >
            <Link
              href="/diagnosis"
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-full bg-[#1a1512] px-8 py-4 text-base font-semibold text-[#faf7f2] shadow-[0_18px_48px_rgba(26,21,18,0.28)] ring-1 ring-black/5 transition hover:bg-[#252019] hover:shadow-[0_22px_56px_rgba(26,21,18,0.32)] active:scale-[0.99] sm:py-[1.125rem] sm:text-lg"
            >
              <Gift className="h-5 w-5 shrink-0 opacity-90 sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden />
              <span className="relative z-10">無料で診断をはじめる</span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition group-hover:opacity-100" />
            </Link>

            <p className="mx-auto mt-6 flex max-w-md items-start gap-2.5 text-left text-[12px] leading-[1.85] text-[#7a6d64] sm:text-sm">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#9a8b82]" strokeWidth={1.8} aria-hidden />
              <span>
                所要時間は目安で10〜15分。
                <br />
                回答は端末内にのみ保存され、
                <br />
                落ち着いた画面で進められます。
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
