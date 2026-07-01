import { withAuth } from "next-auth/middleware";

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
