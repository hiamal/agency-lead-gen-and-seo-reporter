"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function DashboardRedirect() {
    const router = useRouter()

    useEffect(() => {
        async function checkSession() {
            const session = await authClient.getSession()
            const user = session?.data?.user as any // Cast to any to access role if custom field typed poorly

            if (user?.role === "agency") {
                router.replace("/dashboard/agency")
            } else if (user?.role === "owner") {
                router.replace("/dashboard/owner")
            } else {
                // Fallback or unauthenticated
                router.replace("/signin")
            }
        }
        checkSession()
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
}
