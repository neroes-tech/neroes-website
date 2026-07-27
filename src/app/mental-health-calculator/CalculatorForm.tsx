"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface Results {
  presenteeism: number;
  absenteeism: number;
  turnover: number;
  total: number;
}

export function CalculatorForm() {
  const { t } = useLanguage();
  const [results, setResults] = useState<Results | null>(null);

  const formSchema = useMemo(
    () =>
      z.object({
        // Keyed by index rather than the translated label, so the selection
        // survives a language switch instead of silently resetting because
        // the previously stored label no longer matches any option.
        industry: z.string().min(1),
        employees: z.coerce.number().min(1, t.calculator.form.employeesError),
        salary: z.coerce.number().optional().or(z.literal("")),
      }),
    [t],
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { industry: "2", employees: 100, salary: 35000 },
  });

  const onSubmit = (values: FormValues) => {
    const salary = values.salary ? Number(values.salary) : 35000;
    const employees = values.employees;
    const presenteeism = employees * salary * 0.2;
    const absenteeism = employees * salary * 0.075;
    const turnover = employees * salary * 0.15;
    setResults({ presenteeism, absenteeism, turnover, total: presenteeism + absenteeism + turnover });
  };

  return (
    <div className="grid items-start gap-12 lg:grid-cols-2">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label htmlFor="industry" className="text-sm font-medium text-foreground">
              {t.calculator.form.industryLabel}
            </label>
            <select
              id="industry"
              {...form.register("industry")}
              className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t.calculator.form.industries.map((industry, i) => (
                <option key={i} value={String(i)}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="employees" className="text-sm font-medium text-foreground">
              {t.calculator.form.employeesLabel} <span className="text-destructive">*</span>
            </label>
            <input
              id="employees"
              type="number"
              aria-required="true"
              aria-invalid={!!form.formState.errors.employees}
              aria-describedby={form.formState.errors.employees ? "employees-error" : undefined}
              {...form.register("employees")}
              className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
            />
            {form.formState.errors.employees && (
              <p id="employees-error" className="text-sm text-destructive">
                {form.formState.errors.employees.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="salary" className="text-sm font-medium text-foreground">
              {t.calculator.form.salaryLabel}
            </label>
            <input
              id="salary"
              type="number"
              placeholder="35000"
              aria-describedby="salary-hint"
              {...form.register("salary")}
              className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p id="salary-hint" className="text-xs text-muted-foreground">
              {t.calculator.form.salaryHint}
            </p>
          </div>

          <Button type="submit" className="h-12 w-full rounded-full text-lg">
            {t.calculator.form.submitLabel}
          </Button>
        </form>
      </div>

      <div className="space-y-6" aria-live="polite">
        {results ? (
          <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
            <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-sm">
              <h2 className="mb-2 text-lg font-medium opacity-80">{t.calculator.form.totalHeading}</h2>
              <div className="font-exo text-5xl font-bold">
                <AnimatedCounter prefix="€" end={results.total} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: t.calculator.form.presenteeismLabel,
                  value: results.presenteeism,
                  desc: t.calculator.form.presenteeismDesc,
                  color: "text-primary",
                },
                {
                  label: t.calculator.form.absenteeismLabel,
                  value: results.absenteeism,
                  desc: t.calculator.form.absenteeismDesc,
                  color: "text-primary",
                },
              ].map(({ label, value, desc, color }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">{label}</h3>
                  <div className={`font-exo text-2xl font-bold ${color}`}>
                    <AnimatedCounter prefix="€" end={value} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:col-span-2 sm:mx-auto sm:w-1/2 sm:min-w-[220px]">
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                  {t.calculator.form.turnoverLabel}
                </h3>
                <div className="font-exo text-2xl font-bold text-secondary">
                  <AnimatedCounter prefix="€" end={results.turnover} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{t.calculator.form.turnoverDesc}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
            {t.calculator.form.placeholderText}
          </div>
        )}
      </div>
    </div>
  );
}
