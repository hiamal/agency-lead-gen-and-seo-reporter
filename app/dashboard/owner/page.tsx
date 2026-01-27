"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Loader2, Search } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function OwnerDashboard() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { data: session } = authClient.useSession()

    const { data: audits, refetch } = useQuery({
        queryKey: ["audits"],
        queryFn: async () => {
            const res = await fetch("/api/audits")
            if (!res.ok) return []
            return res.json()
        },
        enabled: !!session?.user?.email
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session?.user?.email) {
            alert("Please sign in first")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/generate-audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    website: url,
                    email: session.user.email
                })
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to start audit");
            }

            setSuccess(true)
            setUrl("")
            refetch()
            setTimeout(() => setSuccess(false), 5000)

        } catch (error: any) {
            console.error(error)
            alert(error.message || "Something went wrong starting the audit. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Website Audit</h1>
                <p className="text-muted-foreground">Enter your website URL to receive a comprehensive SEO report.</p>
            </div>

            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle>Request New Audit</CardTitle>
                    <CardDescription>We'll analyze your site and record the results here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-medium">Audit Requested!</h3>
                                <p className="text-muted-foreground">The report has been generated and saved to your history below.</p>
                            </div>
                            <Button variant="outline" onClick={() => setSuccess(false)}>Request Another</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Website URL</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="https://example.com"
                                        className="pl-9"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                        type="url"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" variant="shiny" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Generate Audit Report <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Audits</h3>
                <div className="grid gap-4">
                    {audits?.map((audit: any) => (
                        <div key={audit.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 glass border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <span className="font-bold text-blue-500">
                                        {audit.websiteUrl ? audit.websiteUrl.replace(/https?:\/\/(www\.)?/, "").slice(0, 2).toUpperCase() : "NA"}
                                    </span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium truncate max-w-[200px] sm:max-w-md">{audit.websiteUrl}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(audit.createdAt).toLocaleDateString()} at {new Date(audit.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline-flex text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">Completed</span>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="hover:bg-white/10">View</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl h-[85vh] glass border-white/20 bg-slate-950/95 text-slate-50 overflow-hidden flex flex-col p-0">
                                        <DialogHeader className="p-6 pb-2 border-b border-white/10">
                                            <DialogTitle className="text-2xl font-bold tracking-tight">
                                                Audit Report: <span className="text-indigo-400">{audit.websiteUrl}</span>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                                            <ScrollArea className="h-full w-full">
                                                <div className="p-8">
                                                    {audit.reportContent ? (
                                                        <div
                                                            className="prose prose-invert max-w-none 
                                                            prose-h1:text-indigo-400 prose-h2:text-indigo-300 prose-h1:text-3xl prose-h2:text-2xl
                                                            prose-strong:text-indigo-300 prose-hr:border-white/10
                                                            prose-p:text-slate-300 prose-li:text-slate-300"
                                                            dangerouslySetInnerHTML={{ __html: audit.reportContent }}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                            <div className="p-4 rounded-full bg-slate-900 border border-white/10">
                                                                <Search className="h-8 w-8 text-slate-500" />
                                                            </div>
                                                            <p className="text-slate-400">This audit report is empty.</p>
                                                        </div>
                                                    )}
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
                        </div>
                    ))}
                    {!audits?.length && !loading && (
                        <div className="text-center py-12 rounded-lg border border-dashed border-white/10 bg-white/5">
                            <p className="text-muted-foreground">No audits found. Submit a URL above to start!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
