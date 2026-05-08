export function SiteFooter() {
  return (
    <footer className="border-t border-slate-700/80 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl gap-3 px-6 py-6 text-sm text-slate-300 sm:px-8 lg:px-12">
        <p className="font-semibold text-slate-200">
          Automated Software Design - advanced software architect agent
        </p>
        <p className="text-xs leading-6 text-slate-400">
          &copy; {new Date().getFullYear()} Anmol Khurana. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
