import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { website, email } = body;

        if (!website || !email) {
            return NextResponse.json(
                { error: "Website and email are required" },
                { status: 400 }
            );
        }

        const n8nUrl = process.env.N8N_AUDIT_WEBHOOK_URL;

        if (!n8nUrl) {
            throw new Error("N8N_AUDIT_WEBHOOK_URL is not configured");
        }

        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ website, email }),
        });

        const responseText = await response.text();
        console.log(`n8n Status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`n8n responded with ${response.status}: ${responseText}`);
        }

        // The user updated n8n to respond with pure HTML text (no JSON)
        const reportContent = responseText.trim() || "<p>The audit was generated but the report content was empty.</p>";

        // Find user to link audit
        const users = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);
        const user = users[0];

        if (user) {
            await db.insert(schema.audit).values({
                id: crypto.randomUUID(),
                userId: user.id,
                websiteUrl: website,
                reportContent: reportContent,
                createdAt: new Date(),
            });
        }

        return NextResponse.json({ success: true, report: reportContent });

    } catch (error: any) {
        console.error("Audit Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate audit" },
            { status: 500 }
        );
    }
}
