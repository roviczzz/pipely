"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/actions/auth";
import { createContact, updateContact } from "@/lib/actions/contacts";

type CompanyOption = {
  id: string;
  name: string;
};

type ContactFormProps = {
  companies: CompanyOption[];
  contact?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    status?: string | null;
    companyId?: string | null;
  } | null;
};

const initialState: ActionState<unknown> = { success: true };

export function ContactForm({ companies, contact }: ContactFormProps) {
  const isEditing = !!contact?.id;
  const action = isEditing
    ? (prevState: ActionState<unknown>, formData: FormData) =>
        updateContact(contact.id as string, prevState, formData)
    : createContact;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Contact details
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            {isEditing ? "Edit contact" : "Add a new contact"}
          </h2>
        </div>
        {isEditing ? (
          <a href="/contacts" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
            Cancel
          </a>
        ) : null}
      </div>

      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              defaultValue={contact?.firstName ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={Boolean(state.errors?.firstName)}
            />
            {state.errors?.firstName ? (
              <p className="text-xs text-destructive">{state.errors.firstName[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              defaultValue={contact?.lastName ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={Boolean(state.errors?.lastName)}
            />
            {state.errors?.lastName ? (
              <p className="text-xs text-destructive">{state.errors.lastName[0]}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={contact?.email ?? ""}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            aria-invalid={Boolean(state.errors?.email)}
          />
          {state.errors?.email ? <p className="text-xs text-destructive">{state.errors.email[0]}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={contact?.phone ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={contact?.status ?? "LEAD"}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="LEAD">Lead</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="companyId" className="text-sm font-medium">
            Company
          </label>
          <select
            id="companyId"
            name="companyId"
            defaultValue={contact?.companyId ?? ""}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">No company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
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
          {pending ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save changes" : "Create contact"}
        </button>
      </form>
    </section>
  );
}
