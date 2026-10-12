import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 touch-manipulation min-h-[42px] cursor-pointer ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-2xs transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] active:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50 touch-manipulation min-h-[42px] cursor-pointer ${className}`}
      {...props}
    />
  );
}

export function DangerButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-red-500 active:scale-[0.98] active:bg-red-700 disabled:pointer-events-none disabled:opacity-50 touch-manipulation min-h-[42px] cursor-pointer ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 min-h-[42px] ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 min-h-[42px] ${className}`}
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
      <span className="mb-1.5 block text-xs sm:text-sm font-medium text-zinc-700">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm ${className}`}>
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {description ? <p className="mt-1 text-xs sm:text-sm text-zinc-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">{actions}</div> : null}
    </div>
  );
}

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm text-zinc-500 py-8">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
      <span className="font-medium text-zinc-600">{label}</span>
    </div>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-2xs">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center sm:px-6 sm:py-10">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      {description ? <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">{description}</p> : null}
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
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    violet: "bg-purple-50 text-purple-600 border-purple-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    zinc: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <Card className="p-3.5 sm:p-4.5 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-medium text-zinc-500 truncate">{label}</span>
          {icon ? (
            <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border text-sm transition-transform group-hover:scale-105 ${accentStyles[accent]}`}>
              {icon}
            </span>
          ) : null}
        </div>
        <div className="mt-2.5 sm:mt-3">
          <p className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-900 tabular-nums break-words">
            {value}
          </p>
        </div>
      </div>
      {(hint || trend) ? (
        <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="truncate">{hint}</span>
          {trend ? <span className="font-medium text-zinc-700 shrink-0 ml-1">{trend}</span> : null}
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
    default: "bg-zinc-100 text-zinc-700 border-zinc-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200/60",
    rose: "bg-rose-50 text-rose-700 border-rose-200/60",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight ${variants[variant]}`}>
      {children}
    </span>
  );
}
