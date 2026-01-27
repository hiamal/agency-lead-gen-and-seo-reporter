"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

export function Navbar() {
    const { data: session, isPending } = authClient.useSession()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hover:opacity-80 transition-opacity">
                    SEO Sniper
                </Link>

                <div className="flex items-center gap-4">
                    {isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : session ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-white"
                                onClick={() => authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            window.location.href = "/"
                                        }
                                    }
                                })}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                                <Link href="/signin">Sign In</Link>
                            </Button>
                            <Button size="sm" variant="shiny" asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
