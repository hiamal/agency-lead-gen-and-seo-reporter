import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch sessions with their leads
        // Using db.query for easier relation fetching
        const sessions = await db.query.scrapeSession.findMany({
            where: eq(schema.scrapeSession.userId, session.user.id),
            with: {
                leads: true,
            },
            orderBy: [desc(schema.scrapeSession.createdAt)],
        });

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Fetch Lead Sessions Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
