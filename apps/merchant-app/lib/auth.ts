import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";

export const authOptions = {
    providers: [
        GoogleProvider({
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
      async signIn({ user, account }: {
        user: {
          email: string;
          name: string
        },
        account: {
          provider: "google" | "github"
        }
      }) {
        console.log("hi signin")
        if (!user || !user.email) {
          return false;
        }

        await db.merchant.upsert({
          select: {
            id: true
          },
          where: {
            email: user.email
          },
          create: {
            email: user.email,
            name: user.name,
            auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
          },
          update: {
            name: user.name,
            auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
          }
        });

        return true;
      }
    },
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    secret: process.env.NEXTAUTH_SECRET || "secret"
  }