/**
 * The `ProjectStatus` enum values, as a runtime-checkable list.
 *
 * Mirrors the enum in `prisma/schema.prisma`. Needed because status arrives
 * from query strings and request bodies, where it has to be validated before
 * it reaches Prisma — an unrecognised value otherwise throws deep in the
 * query layer and surfaces as a 500 instead of a 400.
 */
export const PROJECT_STATUSES = [
  "NEW",
  "REVIEWING",
  "QUOTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return (
    typeof value === "string" &&
    PROJECT_STATUSES.includes(value as ProjectStatus)
  );
}
