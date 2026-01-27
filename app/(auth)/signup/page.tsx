"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client" // We need to create this export if not exists or use direct import
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function SignUpForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const defaultRole = searchParams.get("role") === "agency" ? "agency" : "owner"
    const [role, setRole] = useState<"owner" | "agency">(defaultRole)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
                // @ts-ignore
                role: role,
                callbackURL: role === "agency" ? "/dashboard/agency" : "/dashboard/owner"
            })

            if (error) {
                console.error("Signup error:", error)
                setError(error.message || error.statusText || "Something went wrong. Please check your connection and try again.")
            } else {
                router.push(role === "agency" ? "/dashboard/agency" : "/dashboard/owner")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                <CardDescription className="text-center">
                    Get started with your free account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Role Toggles */}
                <div className="flex bg-secondary/50 p-1 rounded-lg mb-6 relative isolate">
                    {(["owner", "agency"] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={cn(
                                "flex-1 relative text-sm font-medium py-1.5 rounded-md transition-colors duration-200",
                                role === r ? "text-white" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <span className="relative z-10">{r === "owner" ? "Website Owner" : "Agency"}</span>
                            {role === r && (
                                <motion.div
                                    layoutId="signup-role-indicator"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md shadow-md"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    style={{ zIndex: 0 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                        <Input
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <Input
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading} variant="shiny">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                </form>

                <div className="mt-4 relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-muted-foreground bg-[#0d111a]">Or continue with</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full mt-4 glass hover:bg-white/10"
                    onClick={async () => {
                        await authClient.signIn.social({
                            provider: "google",
                            callbackURL: role === "agency" ? "/dashboard/agency" : "/dashboard/owner"
                        })
                    }}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </Button>

            </CardContent>
            <CardFooter>
                <p className="text-sm text-center w-full text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary hover:underline">
                        Sign In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SignUpForm />
        </Suspense>
    )
}
