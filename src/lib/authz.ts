import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export type ProjectAccess =
  | { ok: true; isAdmin: boolean; userId: string }
  | { ok: false; status: 401 | 403 | 404 };

/**
 * Authorize the current session against a single project.
 *
 * Every `/api/projects/[id]/*` handler needs this: `id` comes straight from
 * the URL, so a signed-in client can otherwise reach another client's
 * project simply by changing it. Being authenticated is not the same as
 * being entitled to *this* project.
 *
 * Returns 404 rather than 403 for a project the caller does not own, so the
 * endpoint does not confirm which project ids exist.
 */
export async function authorizeProject(
  projectId: string
): Promise<ProjectAccess> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, status: 401 };
  }

  const isAdmin = session.user.role === "ADMIN";

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true },
  });

  if (!project) {
    return { ok: false, status: 404 };
  }

  if (!isAdmin && project.clientId !== session.user.id) {
    return { ok: false, status: 404 };
  }

  return { ok: true, isAdmin, userId: session.user.id };
}
