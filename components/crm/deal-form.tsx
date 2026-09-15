"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/actions/auth";
import { createDeal, updateDeal } from "@/lib/actions/deals";

type Contact = { id: string; firstName: string; lastName: string };
type Company = { id: string; name: string };

type DealFormProps = {
  deal?: {
    id?: string;
    title?: string;
    value?: number;
    currency?: string;
    stage?: string;
    expectedCloseDate?: Date | string | null;
    contactId?: string | null;
    companyId?: string | null;
  } | null;
  contacts?: Contact[];
  companies?: Company[];
};

const STAGES = [
  { value: "PROSPECT", label: "Prospect" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "CLOSED_WON", label: "Closed Won" },
  { value: "CLOSED_LOST", label: "Closed Lost" },
];

const initialState: ActionState<unknown> = { success: true };

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function DealForm({ deal, contacts = [], companies = [] }: DealFormProps) {
  const isEditing = !!deal?.id;
  const action = isEditing
    ? (prevState: ActionState<unknown>, formData: FormData) =>
        updateDeal(deal.id as string, prevState, formData)
    : createDeal;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Deal details
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            {isEditing ? "Edit deal" : "Add a new deal"}
          </h2>
        </div>
        {isEditing ? (
          <a
            href="/deals"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Cancel
          </a>
        ) : null}
      </div>

      <form action={formAction} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Deal title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={deal?.title ?? ""}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            aria-invalid={Boolean(state.errors?.title)}
          />
          {state.errors?.title ? (
            <p className="text-xs text-destructive">{state.errors.title[0]}</p>
          ) : null}
        </div>

        {/* Value + Currency */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="value" className="text-sm font-medium">
              Value
            </label>
            <input
              id="value"
              name="value"
              type="number"
              min="0"
              step="0.01"
              defaultValue={deal?.value ?? 0}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={Boolean(state.errors?.value)}
            />
            {state.errors?.value ? (
              <p className="text-xs text-destructive">{state.errors.value[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className="text-sm font-medium">
              Currency
            </label>
            <input
              id="currency"
              name="currency"
              defaultValue={deal?.currency ?? "USD"}
              maxLength={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Stage */}
        <div className="space-y-2">
          <label htmlFor="stage" className="text-sm font-medium">
            Stage
          </label>
          <select
            id="stage"
            name="stage"
            defaultValue={deal?.stage ?? "PROSPECT"}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expected close date */}
        <div className="space-y-2">
          <label htmlFor="expectedCloseDate" className="text-sm font-medium">
            Expected close date
          </label>
          <input
            id="expectedCloseDate"
            name="expectedCloseDate"
            type="date"
            defaultValue={toDateInputValue(deal?.expectedCloseDate)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Contact */}
        {contacts.length > 0 ? (
          <div className="space-y-2">
            <label htmlFor="contactId" className="text-sm font-medium">
              Contact
            </label>
            <select
              id="contactId"
              name="contactId"
              defaultValue={deal?.contactId ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No contact</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
            {state.errors?.contactId ? (
              <p className="text-xs text-destructive">{state.errors.contactId[0]}</p>
            ) : null}
          </div>
        ) : null}

        {/* Company */}
        {companies.length > 0 ? (
          <div className="space-y-2">
            <label htmlFor="companyId" className="text-sm font-medium">
              Company
            </label>
            <select
              id="companyId"
              name="companyId"
              defaultValue={deal?.companyId ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {state.errors?.companyId ? (
              <p className="text-xs text-destructive">{state.errors.companyId[0]}</p>
            ) : null}
          </div>
        ) : null}

        {/* Messages */}
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
          {pending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save changes"
              : "Create deal"}
        </button>
      </form>
    </section>
  );
}
