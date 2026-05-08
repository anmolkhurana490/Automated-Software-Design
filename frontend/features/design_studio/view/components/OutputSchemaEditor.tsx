"use client";

interface OutputSchemaEditorProps {
  value: unknown;
  onChange: (nextValue: unknown) => void;
  label?: string;
}

function PrimitiveField({
  value,
  onChange,
}: {
  value: string | number | boolean | null;
  onChange: (nextValue: string | number | boolean | null) => void;
}) {
  if (typeof value === "string") {
    return (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950/85 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      />
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={String(value)}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          onChange(Number.isNaN(nextValue) ? 0 : nextValue);
        }}
        className="w-full rounded-lg border border-slate-700 bg-slate-950/85 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <select
        value={value ? "true" : "false"}
        onChange={(event) => onChange(event.target.value === "true")}
        className="w-full rounded-lg border border-slate-700 bg-slate-950/85 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  return (
    <p className="rounded-lg border border-slate-700 bg-slate-950/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
      null
    </p>
  );
}

function isStringArray(value: unknown[]): value is string[] {
  return value.every((item) => typeof item === "string");
}

export function OutputSchemaEditor({ value, onChange, label }: OutputSchemaEditorProps) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return (
      <div className="space-y-2">
        {label ? (
          <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">{label}</p>
        ) : null}
        <PrimitiveField value={value} onChange={onChange} />
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (isStringArray(value)) {
      return (
        <div className="space-y-3">
          {label ? (
            <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">{label}</p>
          ) : null}

          {value.map((item, index) => (
            <div key={`string-item-${index}`} className="flex items-center gap-2">
              <input
                value={item}
                onChange={(event) => {
                  const next = [...value];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/85 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => {
                  const next = value.filter((_, itemIndex) => itemIndex !== index);
                  onChange(next);
                }}
                className="rounded-full border border-rose-500/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-200"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => onChange([...value, ""])}
            className="rounded-full border border-cyan-500/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-200"
          >
            Add Item
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {label ? (
          <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">{label}</p>
        ) : null}

        {value.map((item, index) => (
          <div key={`nested-array-${index}`} className="rounded-xl border border-slate-700 bg-slate-900/50 p-3">
            <OutputSchemaEditor
              value={item}
              onChange={(nextChild) => {
                const next = [...value];
                next[index] = nextChild;
                onChange(next);
              }}
              label={`Item ${index + 1}`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);

    return (
      <div className="space-y-3">
        {label ? (
          <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">{label}</p>
        ) : null}

        {entries.map(([key, childValue]) => (
          <div key={key} className="rounded-xl border border-slate-700 bg-slate-900/50 p-3">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.13em] text-slate-400">{key}</p>
            <OutputSchemaEditor
              value={childValue}
              onChange={(nextChild) => {
                onChange({
                  ...(value as Record<string, unknown>),
                  [key]: nextChild,
                });
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <p className="text-xs text-slate-400">Unsupported value type</p>
  );
}
