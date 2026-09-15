import { deleteCompany } from "@/lib/actions/companies";

async function handleDeleteCompany(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteCompany(id);
}

type CompanyRow = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  size: string | null;
  contactCount: number;
};

export function CompanyTable({ companies }: { companies: CompanyRow[] }) {
  if (!companies.length) {
    return (
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Companies</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          No companies yet. Add the first company to start tracking your accounts.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Companies</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Industry</th>
              <th className="px-6 py-3 font-medium">Size</th>
              <th className="px-6 py-3 font-medium">Contacts</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-t align-top">
                <td className="px-6 py-4">
                  <div className="font-medium">{company.name}</div>
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-primary underline-offset-4 hover:underline">
                      {company.website}
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{company.industry ?? "—"}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {company.size ? company.size.replace("SIZE_", "").replace("_", "-").replace("_", "-") : "—"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{company.contactCount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/companies?edit=${company.id}`}
                      className="rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      Edit
                    </a>
                    <form action={handleDeleteCompany}>
                      <input type="hidden" name="id" value={company.id} />
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
