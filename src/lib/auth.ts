import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_AUTH_sECRET as string, 
        }, 
    },
});