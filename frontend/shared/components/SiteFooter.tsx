export function SiteFooter() {
  return (
    <footer className="border-t border-gradient-to-r from-cyan-900/40 via-slate-700/40 to-emerald-900/40 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl gap-2 px-4 py-6 text-sm text-slate-300 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <p className="font-semibold bg-linear-to-r from-slate-100 to-cyan-200 bg-clip-text text-transparent">
            ArchFlow - Agentic Design Studio
          </p>
        </div>
        <p className="text-xs leading-4 text-slate-500">
          Automated software architecture design powered by advanced AI agents. Transforming requirements into production-ready systems.
        </p>
        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Anmol Khurana. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
