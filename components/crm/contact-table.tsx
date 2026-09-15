import { deleteContact } from "@/lib/actions/contacts";

async function handleDeleteContact(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteContact(id);
}

type ContactRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
  company?: { name: string | null } | null;
};

export function ContactTable({ contacts }: { contacts: ContactRow[] }) {
  if (!contacts.length) {
    return (
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Contacts</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          No contacts yet. Add the first contact to start building your pipeline.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Contacts</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-t align-top">
                <td className="px-6 py-4">
                  <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                  {contact.phone ? <div className="text-xs text-muted-foreground">{contact.phone}</div> : null}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{contact.email}</td>
                <td className="px-6 py-4 text-muted-foreground">{contact.company?.name ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/contacts?edit=${contact.id}`}
                      className="rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      Edit
                    </a>
                    <form action={handleDeleteContact}>
                      <input type="hidden" name="id" value={contact.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-destructive/20 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
