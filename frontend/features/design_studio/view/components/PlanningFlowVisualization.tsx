import { PlanningStageState } from "../../model/planning_stage_models";

interface PlanningFlowVisualizationProps {
  planning: PlanningStageState;
}

// export function PlanningFlowVisualization({ planning }: PlanningFlowVisualizationProps) {
//   return (
//     <div className="rounded-2xl border border-cyan-700/40 bg-linear-to-br from-cyan-950/35 to-emerald-950/25 p-4 shadow-[0_14px_30px_rgba(6,182,212,0.2)]">
//       <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Planning Visualization</p>
//       <div className="mt-3 grid gap-2 md:grid-cols-3">
//         {planning.architecture_diagram.nodes.slice(0, 6).map((node, index) => (
//           <div
//             key={node}
//             className="relative rounded-xl border border-slate-700 bg-slate-900/75 p-2.5 text-xs font-semibold text-slate-200 shadow-sm"
//           >
//             <span className="absolute -left-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-black text-white">
//               {index + 1}
//             </span>
//             {node}
//           </div>
//         ))}
//       </div>
//       <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/65 p-3">
//         <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Flow Links</p>
//         <ul className="mt-2 grid gap-1 text-xs text-slate-200">
//           {planning.architecture_diagram.edges.map((edge, index) => (
//             <li key={`${edge.from}-${edge.to}-${index}`}>
//               {edge.from} → {edge.to} ({edge.label})
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
