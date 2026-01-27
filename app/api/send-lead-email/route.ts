import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { leadEmail, businessName, websiteUrl, auditContent } = body;

        if (!leadEmail || !businessName) {
            return NextResponse.json(
                { error: "Lead email and business name are required" },
                { status: 400 }
            );
        }

        const n8nUrl = process.env.N8N_SEND_EMAIL_WEBHOOK_URL;

        if (!n8nUrl) {
            throw new Error("N8N_SEND_EMAIL_WEBHOOK_URL is not configured");
        }

        // Professional, compelling, but not pushy email body
        const emailSubject = `Important: Your website visibility and SEO audit for ${businessName}`;
        const emailBody = `
Hi there,

I was recently looking into local businesses in your area and came across ${businessName}.

While you have a great business, I noticed that potential customers might be having trouble finding you online. It appears that some of your website's SEO settings are currently "invisible" to search engines like Google, which means people searching for your services may not be seeing your site.

I've taken the liberty of generating a detailed SEO Audit Report for ${websiteUrl} to show you exactly where the gaps are.

Updating these settings could significantly help more customers find and reach your website. 

Please find the attached SEO report for your review. If you'd like me to help you fix these issues and get more customers through your door, simply respond to this email with the word "SEO" and I'll be happy to assist you.

Best regards,

${session.user.name || "The SEO Reporter Team"}
        `.trim();

        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: leadEmail,
                subject: emailSubject,
                textBody: emailBody,
                businessName,
                websiteUrl,
                auditContent, // Sending this so n8n can generate the PDF
                agencyName: session.user.name,
                agencyEmail: session.user.email
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`n8n responded with ${response.status}: ${errorText}`);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Send Email Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send email" },
            { status: 500 }
        );
    }
}
