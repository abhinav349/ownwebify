import { withAuth } from "next-auth/middleware";

/**
 * Renamed from `middleware.ts`: Next.js 16 deprecated the `middleware`
 * convention in favour of `proxy`. Behaviour is unchanged. Note that `proxy`
 * always runs on the Node.js runtime, and that is not configurable.
 *
 * This is an *optimistic* gate only — it keeps unauthenticated users from
 * landing on dashboard shells. It is not the authorization boundary. The
 * `/admin` and `/dashboard` layouts re-check the session server-side, and
 * every API route authorizes independently, which is what actually protects
 * the data: API paths are not even in the matcher below.
 */
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;

      if (path.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }

      if (path.startsWith("/dashboard")) {
        return !!token;
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
