
export type StructuredOutputType = string | string[] | { [key: string]: StructuredOutputType } | null;

interface RendererPropsType {
  output: any;
}

export const StructuredOutputRenderer = ({ output }: RendererPropsType) => {
  if (!output) {
    return <p className="text-sm text-slate-400">No output available.</p>;
  }

  if (typeof output === "string" || typeof output === "number" || typeof output === "boolean") {
    return (
      <span>{output}</span>
    );
  }

  if (Array.isArray(output)) {
    return (
      <ul className="list-disc pl-5">
        {output.map((item, index) => (
          <li key={index}>
            <StructuredOutputRenderer output={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof output === "object") {
    return (
      <div className="max-h-[75vh] overflow-auto space-y-2 mt-2 rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm">
        {Object.entries(output).map(([key, value]) => (
          <div key={key} className="space-x-1">
            <span className="font-semibold">{key}:</span>
            <StructuredOutputRenderer output={value} />
          </div>
        ))}
      </div>
    );
  }

  // Fallback for any unexpected types
  return <span className="text-slate-400">
    Unable to render value of type: {typeof output}
  </span>;
};