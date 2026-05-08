import Link from "next/link";
import { STAGE_METADATA } from "../models/sampleData";
// import { HeroSectionAnimation } from "./components/HeroSectionAnimation";
import { StageFlowChart } from "./components/StageFlowChart";

export function LandingPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-8 lg:px-12 lg:py-12">
        <HeroSection />

        <section id="stages" className="mt-8">
          <StageFlowChart stages={STAGE_METADATA} />
        </section>
      </main>
    </>
  );
}

const HeroSection = () => {
  return (
    <section className="grid items-center gap-8 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="inline-flex rounded-full border border-cyan-400/45 bg-cyan-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
          Intelligent system design workspace
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-slate-100 sm:text-5xl">
          Shape software architecture with a visually guided AI decision studio.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          An advanced workspace for software teams that turns intent into structured
          architecture, design artifacts, validation feedback, and final documentation.
          The flow is visual, human-centered, and built to make complex decisions feel clear.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Get Started
          </Link>
          <a
            href="#stages"
            className="rounded-full border border-slate-600 bg-slate-900 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-400"
          >
            Explore Stages
          </a>
        </div>
      </div>

      <div className="overflow-x-hidden">
        {/* <HeroSectionAnimation /> */}
      </div>
    </section>
  );
}