import Link from "next/link";
import { StageFlowChart } from "./components/StageFlowChart";
import HeroVisual from "./components/HeroVisual";

export function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:py-8 sm:px-8 lg:px-12 lg:py-12">
      <HeroSection />

      <section id="stages" className="mt-8">
        <StageFlowChart />
      </section>
    </main>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-[22px] font-semibold text-slate-100">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{label}</div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative grid min-h-130 overflow-hidden rounded-[14px] bg-[#060c18] font-sans md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.08)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.07)_0%,transparent_50%)]" />
      {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[28px_28px]" /> */}
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 px-4 py-6 md:px-6 md:py-12 sm:px-10 lg:px-12 lg:py-12">
        <h1 className="text-[38px] font-semibold leading-[1.15] tracking-[-0.5px] text-slate-100 sm:text-[44px]">
          <span className="bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">ArchFlow</span>
        </h1>
        <h2 className="mt-3 text-[16px] font-medium leading-[1.4] tracking-[-0.3px] text-slate-300 sm:text-[26px]">
          Transform your software vision into reality.
        </h2>

        <p className="mt-4 text-[15px] leading-[1.7] text-slate-400">
          ArchFlow analyzes requirements, generates production-ready architecture, and iterates intelligently — all in minutes.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-6 py-3 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-px hover:bg-[#4f46e5]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Start designing
          </Link>
          <a
            href="#stages"
            className="inline-flex items-center rounded-lg border border-[rgba(148,163,184,0.2)] px-6 py-3 text-sm font-normal text-slate-400 transition-colors duration-200 hover:border-[rgba(148,163,184,0.5)] hover:text-slate-200"
          >
            See how it works
          </a>
        </div>

        <div className="mt-5 md:mt-9 flex max-md:justify-evenly gap-7 border-t border-white/5 pt-7">
          <HeroStat value="12x" label="faster delivery" />
          <HeroStat value="98%" label="design accuracy" />
          <HeroStat value="40+" label="patterns supported" />
        </div>
      </div>

      <HeroVisual />
    </section>
  );
}