import { DesignStageState } from "../../model/design_stage_models";

interface DesignSystemVisualizationProps {
  design: DesignStageState;
}

// export function DesignSystemVisualization({ design }: DesignSystemVisualizationProps) {
//   return (
//     <div className="rounded-2xl border border-indigo-700/40 bg-linear-to-br from-indigo-950/30 via-sky-950/20 to-slate-950/25 p-4">
//       <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">Design Visualization</p>
//       <div className="mt-3 grid gap-3 lg:grid-cols-2">
//         <div className="rounded-xl border border-slate-700 bg-slate-900/75 p-3">
//           <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Service Topology</p>
//           <div className="mt-2 grid gap-2">
//             {design.services?.services.map((service) => (
//               <div key={service.name} className="rounded-lg border border-slate-700 bg-slate-950/70 p-2 text-xs text-slate-200">
//                 <span className="font-semibold text-slate-100">{service.name}:</span> {service.responsibility}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="rounded-xl border border-slate-700 bg-slate-900/75 p-3">
//           <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">ER-like DB Snapshot</p>
//           <svg viewBox="0 0 420 220" className="mt-2 w-full rounded-lg bg-slate-950/95 p-2">
//             <rect x="16" y="18" width="180" height="88" rx="10" fill="#0f766e" />
//             <text x="28" y="42" fill="#ecfeff" fontSize="11" fontWeight="700">project_runs</text>
//             <text x="28" y="62" fill="#ccfbf1" fontSize="10">id (uuid)</text>
//             <text x="28" y="78" fill="#ccfbf1" fontSize="10">user_input (text)</text>
//             <text x="28" y="94" fill="#ccfbf1" fontSize="10">score (int)</text>

//             <rect x="228" y="112" width="176" height="88" rx="10" fill="#4338ca" />
//             <text x="240" y="136" fill="#eef2ff" fontSize="11" fontWeight="700">stage_outputs</text>
//             <text x="240" y="156" fill="#e0e7ff" fontSize="10">id (uuid)</text>
//             <text x="240" y="172" fill="#e0e7ff" fontSize="10">run_id (uuid FK)</text>
//             <text x="240" y="188" fill="#e0e7ff" fontSize="10">payload (jsonb)</text>

//             <line x1="170" y1="104" x2="244" y2="118" stroke="#facc15" strokeWidth="2" />
//             <text x="184" y="106" fill="#fde68a" fontSize="9">1:N</text>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }
