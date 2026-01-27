"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, MapPin, Building2, Globe, Phone, Mail, FileText, BarChart3, CheckCircle2, Send } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

export default function AgencyDashboard() {
    const [searchTerms, setSearchTerms] = useState("")
    const [location, setLocation] = useState("")
    const [loading, setLoading] = useState(false)
    const [fetchingAuditFor, setFetchingAuditFor] = useState<string | null>(null)
    const [sendingEmailFor, setSendingEmailFor] = useState<string | null>(null)
    const [viewingAudit, setViewingAudit] = useState<any>(null)
    const { data: session } = authClient.useSession()

    const { data: sessions, refetch } = useQuery({
        queryKey: ["lead-sessions"],
        queryFn: async () => {
            const res = await fetch("/api/lead-sessions")
            if (!res.ok) return []
            return res.json()
        },
        enabled: !!session?.user?.email
    })

    // Fetch existing audits to know which leads already have them
    const { data: audits, refetch: refetchAudits } = useQuery({
        queryKey: ["all-audits"],
        queryFn: async () => {
            const res = await fetch("/api/audits")
            if (!res.ok) return []
            return res.json()
        },
        enabled: !!session?.user?.email
    })

    const handleSearchLeads = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session?.user?.id) {
            alert("Please sign in first")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/scrape-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    searchTerms,
                    locationQuery: location
                })
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to find leads");
            }

            setSearchTerms("")
            setLocation("")
            refetch()

        } catch (error: any) {
            console.error(error)
            alert(error.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleFetchAudit = async (lead: any) => {
        if (!lead.website) return
        if (!session?.user?.email) return

        setFetchingAuditFor(lead.id)
        try {
            const res = await fetch("/api/generate-audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    website: lead.website,
                    email: session.user.email
                })
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to start audit");
            }

            // Successfully started/fetched
            refetchAudits()
            alert(`Audit fetched for ${lead.businessName}!`)

        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to fetch audit.")
        } finally {
            setFetchingAuditFor(null)
        }
    }

    const handleViewAudit = (lead: any) => {
        const audit = audits?.find((a: any) => a.websiteUrl === lead.website)
        if (audit) {
            setViewingAudit({
                websiteUrl: lead.website,
                reportContent: audit.reportContent
            })
        } else {
            alert("No audit found for this website yet. Click 'Fetch SEO Report' first.")
        }
    }

    const handleSendEmail = async (lead: any) => {
        const audit = audits?.find((a: any) => a.websiteUrl === lead.website)
        if (!audit) {
            alert("Please generate an audit report first.")
            return
        }
        if (!lead.email) {
            alert("No email address found for this lead.")
            return
        }

        setSendingEmailFor(lead.id)
        try {
            const res = await fetch("/api/send-lead-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadEmail: lead.email,
                    businessName: lead.businessName,
                    websiteUrl: lead.website,
                    auditContent: audit.reportContent
                })
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to send email");
            }

            alert(`Email sent successfully to ${lead.businessName}!`)
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to send email.")
        } finally {
            setSendingEmailFor(null)
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    SEO Sniper Engine
                </h1>
                <p className="text-muted-foreground text-lg text-balance">The ultimate value-first weapon. Find leads, audit sites, and dominate your niche.</p>
            </div>

            <Card className="glass border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <BarChart3 size={120} />
                </div>
                <CardHeader>
                    <CardTitle className="text-2xl">Find New Leads</CardTitle>
                    <CardDescription>Enter a niche and location to scrape business details via n8n.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearchLeads} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-slate-300">
                                <Building2 className="h-4 w-4 text-blue-400" /> Niche / Audience
                            </label>
                            <Input
                                placeholder="Dentists, Plumbing, HVAC..."
                                value={searchTerms}
                                onChange={(e) => setSearchTerms(e.target.value)}
                                required
                                className="bg-slate-950/50 border-white/10 h-11 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-slate-300">
                                <MapPin className="h-4 w-4 text-indigo-400" /> Location
                            </label>
                            <Input
                                placeholder="New York, London, Paris..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="bg-slate-950/50 border-white/10 h-11 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button type="submit" className="w-full h-11 font-bold" variant="shiny" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Scraping Leads...
                                    </>
                                ) : (
                                    <>
                                        Find Leads <Search className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-400" /> Lead Segments
                    </h3>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{sessions?.length || 0} Search Sessions</span>
                </div>

                {sessions?.length > 0 ? (
                    <Accordion type="multiple" className="space-y-4">
                        {sessions.map((session: any) => (
                            <AccordionItem key={session.id} value={session.id} className="glass border-white/10 rounded-xl overflow-hidden px-4 mb-4">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 shadow-inner">
                                                {session.leads?.length || 0}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-100 block">{session.searchTerms}</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                                                    {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                            <MapPin className="h-3 w-3 text-indigo-400" /> {session.locationQuery}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="rounded-xl border border-white/5 bg-slate-950/50 overflow-hidden shadow-2xl">
                                        <ScrollArea className="w-full max-h-[600px]">
                                            <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                                <thead className="sticky top-0 bg-slate-900 border-b border-white/10 z-10">
                                                    <tr>
                                                        <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Business Details</th>
                                                        <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Website</th>
                                                        <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Contact Info</th>
                                                        <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px] text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {session.leads?.map((lead: any) => {
                                                        const auditExists = audits?.some((a: any) => a.websiteUrl === lead.website);
                                                        return (
                                                            <tr key={lead.id} className="border-b border-white/5 hover:bg-blue-500/[0.03] transition-colors group">
                                                                <td className="p-4 align-top">
                                                                    <div className="font-bold text-slate-200 text-base">{lead.businessName}</div>
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-500/10">
                                                                            {lead.categoryName}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                                            <MapPin className="h-2 w-2" /> {lead.address}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-top">
                                                                    {lead.website ? (
                                                                        <div className="flex flex-col gap-1">
                                                                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-medium hover:underline flex items-center gap-1 truncate max-w-[150px]">
                                                                                <Globe className="h-3 w-3 shrink-0" /> {lead.website.replace(/https?:\/\/(www\.)?/, "")}
                                                                            </a>
                                                                            {auditExists && <span className="text-[9px] text-green-500 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Audit Ready</span>}
                                                                        </div>
                                                                    ) : <span className="text-slate-600 italic">No website</span>}
                                                                </td>
                                                                <td className="p-4 align-top">
                                                                    <div className="space-y-1">
                                                                        {lead.phone && <div className="flex items-center gap-2 text-slate-400"><Phone className="h-3 w-3 text-slate-600" /> {lead.phone}</div>}
                                                                        {lead.email && <div className="flex items-center gap-2 text-slate-400"><Mail className="h-3 w-3 text-slate-600" /> {lead.email}</div>}
                                                                        {!lead.phone && !lead.email && <span className="text-slate-600 italic">No contact found</span>}
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-top text-right">
                                                                    <div className="flex flex-col gap-2">
                                                                        <Button
                                                                            size="xs"
                                                                            variant={auditExists ? "outline" : "shiny"}
                                                                            disabled={!lead.website || fetchingAuditFor === lead.id}
                                                                            onClick={() => handleFetchAudit(lead)}
                                                                            className="h-8 text-[10px] font-bold"
                                                                        >
                                                                            {fetchingAuditFor === lead.id ? (
                                                                                <Loader2 size={12} className="animate-spin mr-1" />
                                                                            ) : (
                                                                                <FileText size={12} className="mr-1" />
                                                                            )}
                                                                            {auditExists ? "Update Audit" : "Fetch SEO Report"}
                                                                        </Button>

                                                                        {auditExists && (
                                                                            <Button
                                                                                size="xs"
                                                                                variant="outline"
                                                                                onClick={() => handleViewAudit(lead)}
                                                                                className="h-8 text-[10px] font-bold border-indigo-500/20 hover:bg-indigo-500/10 hover:text-indigo-400"
                                                                            >
                                                                                <Search size={12} className="mr-1" /> View Report
                                                                            </Button>
                                                                        )}

                                                                        {auditExists && lead.email && (
                                                                            <Button
                                                                                size="xs"
                                                                                variant="shiny"
                                                                                disabled={sendingEmailFor === lead.id}
                                                                                onClick={() => handleSendEmail(lead)}
                                                                                className="h-8 text-[10px] font-bold"
                                                                            >
                                                                                {sendingEmailFor === lead.id ? (
                                                                                    <Loader2 size={12} className="animate-spin mr-1" />
                                                                                ) : (
                                                                                    <Send size={12} className="mr-1" />
                                                                                )}
                                                                                Send Email
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </ScrollArea>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                        <div className="flex flex-col items-center gap-6">
                            <div className="h-20 w-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                                <Search className="h-10 w-10 text-indigo-400/50" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-bold text-slate-200">No leads found yet</h4>
                                <p className="text-muted-foreground max-w-xs mx-auto text-sm">Use the form above to find potential clients for your SEO agency services.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Audit View Dialog */}
            <Dialog open={!!viewingAudit} onOpenChange={(open) => !open && setViewingAudit(null)}>
                <DialogContent className="max-w-4xl h-[85vh] glass border-white/20 bg-slate-950/95 text-slate-50 overflow-hidden flex flex-col p-0">
                    <DialogHeader className="p-6 pb-2 border-b border-white/10">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            Audit Report: <span className="text-indigo-400">{viewingAudit?.websiteUrl}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        <ScrollArea className="h-full w-full">
                            <div className="p-8">
                                <div
                                    className="prose prose-invert max-w-none 
                                    prose-h1:text-indigo-400 prose-h2:text-indigo-300 prose-h1:text-3xl prose-h2:text-2xl
                                    prose-strong:text-indigo-300 prose-hr:border-white/10
                                    prose-p:text-slate-300 prose-li:text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: viewingAudit?.reportContent || "" }}
                                />
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="p-4 border-t border-white/10 flex justify-end bg-slate-900/50">
                        <DialogClose asChild>
                            <Button variant="outline" className="border-white/10 hover:bg-white/5">Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
