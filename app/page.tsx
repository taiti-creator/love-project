"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Lock,
  Sparkles,
} from "lucide-react";

export default function MarriagePersonalityLP() {
  return (
    <div className="min-h-screen bg-[#fbf7f2] text-[#2a2522]">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3e7dc] via-[#fbf7f2] to-[#fbf7f2]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm shadow-sm"
          >
            <Sparkles size={16} />
            恋愛と結婚のズレを読む、60問診断
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          >
            好きになる人と、
            <br />
            幸せになれる人は違う。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#665b55] md:text-lg"
          >
            毎回同じ恋愛を繰り返す理由。
            <br />
            好きになる人と、幸せになれる人がズレる理由。
            <br />
            あなたの恋愛人格を、
            64種類の恋愛キャラとして診断します。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button className="rounded-full bg-[#2a2522] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#443b35]">
              <span className="flex items-center gap-2">
                診断をはじめる
                <ArrowRight size={18} />
              </span>
            </button>

            <p className="text-sm text-[#7d716b]">
              60問の恋愛人格診断
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3 CARDS */}
      <section className="px-5 py-12">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            [
              "恋愛タイプ",
              "どんな人に惹かれ、どんな恋をしやすいか。",
            ],
            [
              "結婚タイプ",
              "生活・金銭感覚・安心感の作り方。",
            ],
            [
              "ズレ分析",
              "好きになる相手と、本当に合う相手の違い。",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl bg-white/80 p-6 shadow-sm"
            >
              <Heart className="mb-4" size={24} />

              <h3 className="text-xl font-bold">{title}</h3>

              <p className="mt-3 leading-7 text-[#665b55]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 POINTS */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#2a2522] p-7 text-white md:p-12">
          <p className="text-sm text-[#d8cabe]">
            診断結果で分かること
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            あなたの恋愛が、
            <br />
            うまくいかない理由を読む。
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              "恋愛タイプ",
              "結婚タイプ",
              "求める相手と現実のズレ",
              "関係を壊す行動・考え方",
              "いい相手を見つけ、捕まえ、長続きする秘訣",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl bg-white/10 p-4"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#2a2522]">
                  {index + 1}
                </div>

                <p className="text-sm leading-6">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARACTER TYPES */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            64種類の恋愛キャラで表示
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center leading-7 text-[#665b55]">
            同じ心理タイプでも、
            男性と女性で恋愛の出方は変わります。
            商社男子、港区女子、IT男子、保育士女子など、
            現実にいそうなキャラで結果を表示します。
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "商社男子",
              "港区女子",
              "IT男子",
              "保育士女子",
              "弁護士男子",
              "看護師女子",
              "バンドマン男子",
              "深夜女子",
            ].map((name) => (
              <div
                key={name}
                className="rounded-2xl bg-white p-5 text-center font-bold shadow-sm"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-sm md:p-12">
          <Lock className="mx-auto mb-4" size={28} />

          <h2 className="text-3xl font-bold">
            答え合わせを、
            <br />
            最後まで見る
          </h2>

          <p className="mt-4 leading-8 text-[#665b55]">
            60問に答えると、
            あなたの恋愛人格を64タイプから診断。
            好きになる相手と幸せになれる相手のズレ、
            恋愛を壊す癖、
            長続きする秘訣まで表示します。
          </p>

          <button className="mt-7 rounded-full bg-[#2a2522] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#443b35]">
            <span className="flex items-center gap-2">
              診断をはじめる
              <MessageCircle size={18} />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}