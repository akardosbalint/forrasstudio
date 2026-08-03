import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { CreateTemplateForm } from "./CreateTemplateForm";
import { setActiveTemplate, deleteTemplate } from "./actions";
import { ConfirmSubmitButton } from "../../ConfirmSubmitButton";

export default async function QuestionnairesPage() {
  await requireRole("ADMIN");

  const templates = await prisma.questionnaireTemplate.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true, responses: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">
        Kérdőív-sablonok
      </h1>

      <CreateTemplateForm />

      <div className="overflow-x-auto rounded-xl border border-paper-3 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-3 text-left text-ink/50">
              <th className="px-4 py-3 font-medium">Név</th>
              <th className="px-4 py-3 font-medium">Kérdések</th>
              <th className="px-4 py-3 font-medium">Kitöltések</th>
              <th className="px-4 py-3 font-medium">Állapot</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id} className="border-b border-paper-3 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/crm/admin/questionnaires/${template.id}`}
                    className="font-medium hover:underline"
                  >
                    {template.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {template._count.questions}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {template._count.responses}
                </td>
                <td className="px-4 py-3">
                  {template.isActive ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Aktív
                    </span>
                  ) : (
                    <form action={setActiveTemplate}>
                      <input type="hidden" name="id" value={template.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-paper-3 px-2 py-1 text-xs font-medium text-ink/70"
                      >
                        Aktiválás
                      </button>
                    </form>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!template.isActive && template._count.responses === 0 && (
                    <form action={deleteTemplate}>
                      <input type="hidden" name="id" value={template.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`Biztosan törlöd a(z) "${template.name}" kérdőív-sablont? Ez nem vonható vissza.`}
                        className="text-xs font-medium text-red-600"
                      >
                        Törlés
                      </ConfirmSubmitButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
