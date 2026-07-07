"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";

const INDUSTRIES = [
  "Healthcare", "Finance", "Technology", "Retail", "Manufacturing",
  "Education", "Government", "Hospitality", "Legal", "Media & Entertainment",
  "Transportation", "Construction", "Energy & Utilities", "Professional Services", "Other",
];

const formSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  employees: z.coerce.number().min(1, "Must have at least 1 employee"),
  salary: z.coerce.number().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface Results {
  presenteeism: number;
  absenteeism: number;
  turnover: number;
  total: number;
}

export function CalculatorForm() {
  const [results, setResults] = useState<Results | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { industry: "Technology", employees: 100, salary: 35000 },
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
              Industry
            </label>
            <select
              id="industry"
              {...form.register("industry")}
              className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
            >
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="employees" className="text-sm font-medium text-foreground">
              Number of Employees <span className="text-destructive">*</span>
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
              Annual Average Salary in EUR (optional)
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
              Defaults to &euro;35,000 if left empty
            </p>
          </div>

          <Button type="submit" className="h-12 w-full rounded-full text-lg">
            Calculate Cost
          </Button>
        </form>
      </div>

      <div className="space-y-6" aria-live="polite">
        {results ? (
          <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
            <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-sm">
              <h2 className="mb-2 text-lg font-medium opacity-80">Total Estimated Annual Cost</h2>
              <div className="font-exo text-5xl font-bold">
                <AnimatedCounter prefix="€" end={results.total} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Presenteeism", value: results.presenteeism, desc: "20% productivity loss", color: "text-primary" },
                { label: "Absenteeism", value: results.absenteeism, desc: "17.5% sick leaves", color: "text-primary" },
              ].map(({ label, value, desc, color }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">{label}</h3>
                  <div className={`font-exo text-2xl font-bold ${color}`}>
                    <AnimatedCounter prefix="€" end={value} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:col-span-2">
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">Turnover</h3>
                <div className="font-exo text-2xl font-bold text-secondary">
                  <AnimatedCounter prefix="€" end={results.turnover} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">15% of annual payroll cost</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
            Enter your company details to see the hidden financial impact of poor mental health.
          </div>
        )}
      </div>
    </div>
  );
}
