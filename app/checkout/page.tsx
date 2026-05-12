"use client";

import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#fbf7f2] px-4 py-10 text-[#2a2522]">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-7 shadow-[0_16px_46px_rgba(35,25,15,0.09)]">
        <p className="text-xs tracking-[0.15em] text-[#8a7c73]">PREMIUM</p>
        <h1 className="mt-2 text-2xl font-semibold">続きは有料解析で開放</h1>
        <p className="mt-3 text-sm leading-7 text-[#625751]">
          Stripe未接続のため、ここは仮の課金導線ページです。
          次段階で決済接続後にそのまま置き換えできます。
        </p>
        <Link
          href="/result"
          className="mt-6 inline-block rounded-full bg-[#2a2522] px-5 py-3 text-sm font-semibold text-white"
        >
          結果へ戻る
        </Link>
      </div>
    </main>
  );
}
