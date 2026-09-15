"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/actions/auth";
import { createCompany, updateCompany } from "@/lib/actions/companies";

type CompanyFormProps = {
  company?: {
    id?: string;
    name?: string;
    industry?: string | null;
    website?: string | null;
    size?: string | null;
  } | null;
};

const initialState: ActionState<unknown> = { success: true };

export function CompanyForm({ company }: CompanyFormProps) {
  const isEditing = !!company?.id;
  const action = isEditing
    ? (prevState: ActionState<unknown>, formData: FormData) =>
        updateCompany(company.id as string, prevState, formData)
    : createCompany;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Company profile
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            {isEditing ? "Edit company" : "Add a new company"}
          </h2>
        </div>
        {isEditing ? (
          <a href="/companies" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
            Cancel
          </a>
        ) : null}
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Company name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={company?.name ?? ""}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            aria-invalid={Boolean(state.errors?.name)}
          />
          {state.errors?.name ? <p className="text-xs text-destructive">{state.errors.name[0]}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="industry" className="text-sm font-medium">
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              defaultValue={company?.industry ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="size" className="text-sm font-medium">
              Company size
            </label>
            <select
              id="size"
              name="size"
              defaultValue={company?.size ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select size</option>
              <option value="SIZE_1_10">1-10</option>
              <option value="SIZE_11_50">11-50</option>
              <option value="SIZE_51_200">51-200</option>
              <option value="SIZE_200_PLUS">200+</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={company?.website ?? ""}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            aria-invalid={Boolean(state.errors?.website)}
          />
          {state.errors?.website ? <p className="text-xs text-destructive">{state.errors.website[0]}</p> : null}
        </div>

        {state.message && !state.success ? (
          <p className="text-sm text-destructive" aria-live="polite">
            {state.message}
          </p>
        ) : null}
        {state.success && state.message ? (
          <p className="text-sm text-emerald-600" aria-live="polite">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {pending ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save changes" : "Create company"}
        </button>
      </form>
    </section>
  );
}
