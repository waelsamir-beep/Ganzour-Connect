export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "963236";

export function isAdmin(pw?: string | null) {
  return !!pw && pw === ADMIN_PASSWORD;
}
