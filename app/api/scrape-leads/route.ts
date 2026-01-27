import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { searchTerms, locationQuery } = body;

        if (!searchTerms || !locationQuery) {
            return NextResponse.json(
                { error: "Search terms and location are required" },
                { status: 400 }
            );
        }

        const scrapeSessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const n8nUrl = process.env.N8N_SCRAPE_WEBHOOK_URL;

        if (!n8nUrl) {
            throw new Error("N8N_SCRAPE_WEBHOOK_URL is not configured");
        }

        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerEmail: session.user.email,
                searchTerms,
                locationQuery,
                scrapeSessionId
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`n8n responded with ${response.status}: ${errorText}`);
        }

        let rawData = await response.json();
        console.log("n8n Raw Response:", JSON.stringify(rawData, null, 2));

        let leadsData: any[] = [];

        // 1. Normalize into an array
        if (Array.isArray(rawData)) {
            leadsData = rawData;
        } else if (rawData && typeof rawData === "object") {
            if (Array.isArray(rawData.items)) leadsData = rawData.items;
            else if (Array.isArray(rawData.data)) leadsData = rawData.data;
            else if (Array.isArray(rawData.results)) leadsData = rawData.results;
            else if (rawData["Business Name"] || rawData.businessName) {
                leadsData = [rawData]; // Single object case
            } else {
                // Check if any property is an array
                const anyArray = Object.values(rawData).find(v => Array.isArray(v));
                if (anyArray) leadsData = anyArray as any[];
            }
        }

        // 2. Normalize n8n item format: [ { "json": { ... } } ] -> [ { ... } ]
        leadsData = leadsData.map(item => (item && typeof item === "object" && item.json) ? item.json : item);

        console.log(`Normalized leads count: ${leadsData.length}`);

        // 3. Last validation
        if (!leadsData || (leadsData.length === 0 && !Array.isArray(rawData))) {
            console.error("Failed to parse leads from response:", rawData);
            throw new Error("Invalid response format from lead generator.");
        }

        const sessionId = scrapeSessionId;
        console.log(`Creating session: ${sessionId}`);

        // Create the session
        await db.insert(schema.scrapeSession).values({
            id: sessionId,
            userId: session.user.id,
            searchTerms,
            locationQuery,
            createdAt: new Date(),
        });

        // Insert leads
        let savedCount = 0;
        if (leadsData.length > 0) {
            console.log(`Starting insertion of ${leadsData.length} leads...`);

            for (const [index, leadData] of leadsData.entries()) {
                const leadId = crypto.randomUUID();
                try {
                    await db.insert(schema.lead).values({
                        id: leadId,
                        sessionId: sessionId,
                        businessName: leadData["Business Name"] || leadData.businessName || "Unknown Business",
                        categoryName: leadData["Category Name"] || leadData.categoryName,
                        address: leadData["Address"] || leadData.address,
                        website: leadData["Website"] || leadData.website,
                        phone: leadData["Phone"] || leadData.phone,
                        email: leadData["Email"] || leadData.email,
                        createdAt: new Date(),
                    });
                    savedCount++;
                    console.log(`  [${index + 1}/${leadsData.length}] Saved lead: ${leadData["Business Name"] || leadData.businessName}`);
                } catch (err) {
                    console.error(`  [${index + 1}/${leadsData.length}] Failed to save lead:`, leadData, err);
                }
            }
        }

        console.log(`Successfully saved ${savedCount} leads for session ${sessionId}`);

        return NextResponse.json({ success: true, sessionId, leadCount: savedCount });

    } catch (error: any) {
        console.error("Scrape Leads Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to scrape leads" },
            { status: 500 }
        );
    }
}


