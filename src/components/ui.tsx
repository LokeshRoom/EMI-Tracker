import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:from-violet-500 hover:to-purple-600 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 touch-manipulation min-h-[42px] cursor-pointer ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-md shadow-xs transition-all duration-200 hover:border-amber-400/50 hover:bg-white/12 hover:text-white active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 touch-manipulation min-h-[42px] cursor-pointer ${className}`}
      {...props}
    />
  );
}

export function DangerButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-all duration-200 hover:bg-red-400 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 touch-manipulation min-h-[42px] cursor-pointer ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-white/15 bg-white/8 px-3.5 py-2.5 text-sm text-slate-100 outline-none backdrop-blur-md transition-colors duration-200 placeholder:text-slate-500 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20 min-h-[42px] ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-xl border border-white/15 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 outline-none backdrop-blur-md transition-colors duration-200 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20 min-h-[42px] ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs sm:text-sm font-medium text-slate-300">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/8 p-4 sm:p-5 backdrop-blur-xl shadow-lg transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-50">{title}</h1>
        {description ? <p className="mt-1 text-xs sm:text-sm text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">{actions}</div> : null}
    </div>
  );
}

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm py-8">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
      <span className="font-medium text-slate-300">{label}</span>
    </div>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 backdrop-blur-md shadow-xs">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center sm:px-6 sm:py-10 backdrop-blur-md">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      {description ? <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">{description}</p> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "zinc",
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: "indigo" | "violet" | "emerald" | "amber" | "zinc";
  trend?: string;
}) {
  const accentStyles = {
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-400/25",
    violet: "bg-violet-500/15 text-violet-300 border-violet-400/25",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
    amber: "bg-amber-500/15 text-amber-300 border-amber-400/25",
    zinc: "bg-white/10 text-slate-300 border-white/15",
  };

  return (
    <Card className="p-3.5 sm:p-4.5 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-medium text-slate-300 truncate">{label}</span>
          {icon ? (
            <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border text-sm transition-transform duration-200 group-hover:scale-105 ${accentStyles[accent]}`}>
              {icon}
            </span>
          ) : null}
        </div>
        <div className="mt-2.5 sm:mt-3">
          <p className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-slate-50 tabular-nums break-words">
            {value}
          </p>
        </div>
      </div>
      {(hint || trend) ? (
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{hint}</span>
          {trend ? <span className="font-medium text-slate-300 shrink-0 ml-1">{trend}</span> : null}
        </div>
      ) : null}
    </Card>
  );
}

export function Badge({
  variant = "default",
  children,
}: {
  variant?: "default" | "indigo" | "emerald" | "amber" | "rose" | "purple";
  children: ReactNode;
}) {
  const variants = {
    default: "bg-white/10 text-slate-300 border-white/15",
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-400/25",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-400/25",
    amber: "bg-amber-500/10 text-amber-300 border-amber-400/25",
    rose: "bg-rose-500/10 text-rose-300 border-rose-400/25",
    purple: "bg-violet-500/10 text-violet-300 border-violet-400/25",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight backdrop-blur-md ${variants[variant]}`}>
      {children}
    </span>
  );
}
