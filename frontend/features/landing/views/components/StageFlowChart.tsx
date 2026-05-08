import { StageMeta } from "../../models/types";

interface StageFlowChartProps {
  stages: readonly StageMeta[];
}

export function StageFlowChart({ stages }: StageFlowChartProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Stage Flow</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-100">From intake to final document</h2>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="min-w-230">
          <div className="grid grid-cols-5 gap-3">
            {stages.map((stage, index) => (
              <div key={stage.title} className="relative">
                <div className="h-full rounded-2xl border border-slate-700 bg-linear-to-br from-slate-900 to-slate-950 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      {index === 0 ? "start" : index === stages.length - 1 ? "finish" : "node"}
                    </span>
                  </div>
                  <p className="mt-4 text-lg font-black text-slate-100">{stage.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{stage.description}</p>
                </div>
                {index < stages.length - 1 ? (
                  <div className="absolute -right-4.5 top-1/2 hidden h-0.5 w-9 bg-linear-to-r from-cyan-400 to-emerald-400 md:block" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-5 gap-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <span>Ask</span>
            <span>Align</span>
            <span>Design</span>
            <span>Validate</span>
            <span>Compile</span>
          </div>
        </div>
      </div>
    </section>
  );
}
