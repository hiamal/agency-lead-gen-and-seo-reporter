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

        const auditsList = await db.query.audit.findMany({
            where: eq(schema.audit.userId, session.user.id),
            orderBy: [desc(schema.audit.createdAt)],
        });

        return NextResponse.json(auditsList);
    } catch (error) {
        console.error("Fetch Audits Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
