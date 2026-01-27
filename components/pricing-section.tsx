"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PricingRole = "owner" | "agency"

export function PricingSection() {
    const [role, setRole] = useState<PricingRole>("owner")

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>

                    <div className="flex items-center p-1 bg-secondary/50 rounded-full border border-white/10 mt-8 relative isolate">
                        {(["owner", "agency"] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={cn(
                                    "relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                                    role === r ? "text-white" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                <span className="relative z-10">{r === "owner" ? "Website Owner" : "Agency"}</span>
                                {role === r && (
                                    <motion.div
                                        layoutId="pricing-role-indicator"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        style={{ zIndex: 0 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        key={`${role}-free`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-colors">
                            <CardHeader>
                                <CardTitle>Free</CardTitle>
                                <CardDescription>Perfect for getting started</CardDescription>
                                <div className="mt-4 text-4xl font-bold">$0</div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {role === "owner" ? (
                                        <>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>3 SEO Audit Reviews</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>Basic Email Support</span>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>100 Leads</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>Basic Filtering</span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="outline" asChild>
                                    <a href={`/signup?role=${role}`}>Get Started</a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        key={`${role}-pro`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card className="h-full border-purple-500/50 bg-black/40 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500 transition-all shadow-2xl shadow-purple-900/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="text-purple-400">Pro</CardTitle>
                                <CardDescription>For serious growth</CardDescription>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">
                                        {role === "owner" ? "$10" : "$25"}
                                    </span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {role === "owner" ? (
                                        <>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-purple-400" />
                                                <span>Unlimited SEO Audits</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-purple-400" />
                                                <span>Priority Email Delivery</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-purple-400" />
                                                <span>Advanced Insights</span>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-purple-400" />
                                                <span>Unlimited Leads</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-purple-400" />
                                                <span>Advanced Filtering</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-purple-400" />
                                                <span>Direct Export to CRM</span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="shiny" asChild>
                                    <a href={`/signup?role=${role}`}>
                                        Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
