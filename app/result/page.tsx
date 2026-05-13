"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { computeDiagnosisResult, type DiagnosisResult } from "@/app/lib/compute-diagnosis-result";

type JsonRow = Record<string, string | null | undefined>;

function pick(row: JsonRow | undefined, key: string): string {
  if (!row) return "";
  const v = row[key];
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

/** result_templates.json を優先。headline はヒーローで表示するため一覧からは除外 */
const TEMPLATE_SECTION_ORDER: { title: string; key: string }[] = [
  { title: "幸せな結婚のために、あなたが成長すべきこと", key: "growth_message" },
  { title: "結婚で苦しくならないための具体的な行動", key: "marriage_advice" },
  { title: "苦しくなりやすい点（注意）", key: "warning" },
  { title: "最後にあなたへ", key: "final_message" },
  { title: "あなたの恋愛の癖（傾向）", key: "love_type" },
  { title: "結婚生活で出やすい傾向", key: "marriage_type" },
  { title: "交際と結婚のギャップ", key: "gap" },
  { title: "結婚で苦しくなりやすいパターン", key: "collapse_pattern" },
  { title: "気持ちが冷めやすいところ", key: "cooling_pattern" },
  { title: "本音の望み", key: "hidden_desire" },
  { title: "相性が合いやすい相手像（参考）", key: "best_partner" },
  { title: "長く整えるためのヒント", key: "long_term_secret" },
];

function typeField(result: DiagnosisResult, key: "relationship_theme" | "core_desire"): string {
  const t = result.typeInfo;
  if (!t) return "";
  const v = t[key];
  return typeof v === "string" ? v.trim() : "";
}

function buildLockedSections(result: DiagnosisResult): { title: string; body: string }[] {
  const out: { title: string; body: string }[] = [];
  const seen = new Set<string>();

  for (const def of TEMPLATE_SECTION_ORDER) {
    const body = pick(result.template, def.key);
    if (!body) continue;
    const dedupeKey = `${def.title}:${body}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push({ title: def.title, body });
  }

  const theme = typeField(result, "relationship_theme");
  if (theme) {
    const dedupeKey = `結婚で見えやすい関係のテーマ:${theme}`;
    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey);
      out.push({ title: "結婚で見えやすい関係のテーマ", body: theme });
    }
  }

  const core = typeField(result, "core_desire");
  if (core) {
    const dedupeKey = `結婚人格の核になりやすい欲求:${core}`;
    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey);
      out.push({ title: "結婚人格の核になりやすい欲求", body: core });
    }
  }

  return out;
}

export default function ResultPage() {
  const [result] = useState<DiagnosisResult | null>(() => computeDiagnosisResult());

  const lockedSections = useMemo(() => (result ? buildLockedSections(result) : []), [result]);

  const headline = useMemo(() => {
    if (!result) return "";
    const h = pick(result.template, "headline");
    return h || `${result.character.character_name}：結婚人格の結果プレビュー`;
  }, [result]);

  const themeSubtitle = useMemo(() => {
    if (!result) return "";
    return typeField(result, "relationship_theme") || typeField(result, "core_desire");
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
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
        className="mx-auto max-w-md"
      >
        <div className="rounded-[1.75rem] border border-[#efe6dc] bg-white p-6 shadow-[0_20px_56px_rgba(35,25,15,0.1)] sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ebe3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6d64]">
              <Sparkles className="h-3 w-3" strokeWidth={2} />
              結婚人格分析 · 32キャラ
            </span>
            <span className="rounded-full border border-[#e8ddd2] bg-[#fffdfa] px-2.5 py-1 text-[10px] font-medium tabular-nums text-[#8a7c73]">
              {result.code} · {result.axisSignature}
            </span>
          </div>

          <p className="mt-6 text-center text-xs font-medium tracking-[0.2em] text-[#8a7c73]">
            あなたの結婚人格
          </p>
          <h1 className="mt-2 text-center text-3xl font-semibold leading-tight tracking-tight text-[#1f1a17] sm:text-[2rem]">
            {result.character.character_name}
          </h1>
          {themeSubtitle ? (
            <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-[#7a6d64]">
              {themeSubtitle}
            </p>
          ) : null}

          <div className="mt-8 rounded-2xl border border-[#ebe3d9] bg-gradient-to-b from-[#fffdfa] to-[#f9f4ee] px-5 py-6 text-center shadow-inner">
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#9a8b82]">FREE PREVIEW</p>
            <p className="mx-auto mt-4 max-w-xs text-lg font-semibold leading-snug text-[#2a2522] sm:text-xl">
              {headline}
            </p>
          </div>

          <p className="mt-10 text-center text-[11px] font-semibold tracking-[0.22em] text-[#8a7c73]">
            フルレポート（有料エリア）
          </p>

          <div className="relative mt-3 min-h-[22rem] overflow-hidden rounded-2xl border border-[#ebe3d9] bg-[#faf6f1] sm:min-h-[24rem]">
            <div className="pointer-events-none space-y-4 p-5 select-none">
              {lockedSections.length > 0 ? (
                lockedSections.map((block) => (
                  <div key={`${block.title}-${block.body.slice(0, 24)}`}>
                    <p className="text-xs font-semibold text-[#6f645d]">{block.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#4a423c] blur-[5px]">
                      {block.body}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#7a6d64] blur-[5px]">
                  レポート本文は有料で全文を解放したときに表示されます。
                </p>
              )}
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
                恋愛の癖、結婚で苦しくなる理由、幸せな結婚に向けた成長のヒントまで一気に読めます。
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
