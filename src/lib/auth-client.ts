import { createAuthClient } from "better-auth/react";

const getAuthBaseURL = () => {
  if (typeof window !== "undefined") {
    // Browser: use absolute URL from window origin
    return `${window.location.origin}/api/auth`;
  }

  // SSR: use environment variable or construct URL
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  return `${origin.replace(/\/$/, "")}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: { credentials: "include" },

  plugins: [
    {
      id: "next-cookies-request",
      fetchPlugins: [
        {
          id: "next-cookies-request-plugin",
          name: "next-cookies-request-plugin",
          hooks: {
            async onRequest(ctx) {
              if (typeof window === "undefined") {
                const { cookies } = await import("next/headers");
                const headers = await cookies();
                ctx.headers.set("cookie", headers.toString());
              }
            },
          },
        },
      ],
    },
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
