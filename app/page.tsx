import { Button } from "@/components/ui/button"
import { PricingSection } from "@/components/pricing-section"
import { ArrowRight, BarChart3, Globe, Zap, Target, Mail, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 container mx-auto text-center z-10">
        <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 backdrop-blur-xl mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
          The Future of Agency Prospecting
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40 mb-8 leading-[0.9] text-balance">
          Stop Praying For Leads. <br />
          <span className="text-blue-400">Start Sniping Them.</span>
        </h1>

        <p className="mx-auto max-w-[850px] text-xl text-slate-400 md:text-2xl mb-12 leading-relaxed text-balance">
          Uncover high-value leads in any niche, generate AI-powered SEO audits, and automate value-first outreach in <span className="text-white font-bold italic">under 60 seconds</span>.
          Stop being "just another spammer" and start being the solution they can't ignore.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button size="xl" variant="shiny" className="h-16 px-10 text-lg font-bold group" asChild>
            <Link href="/signup">
              Get Your First 10 Leads Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500/50" /> No Credit Card Required
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02] relative z-10">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white">The "Invisible Website" Problem</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Most business owners have zero idea why their phones aren't ringing. They have a "Great Website" that is completely invisible to their customers.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                SEO Agencies are failing because they sell "services" rather than "answers." Our system flips the script. You provide the answer—the audit—first. They buy the service second.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "Identify", desc: "Find businesses by niche and city with verified contact data.", icon: <Target className="text-blue-400" /> },
                { title: "Audit", desc: "AI instantly scans their site for everything holding them back.", icon: <Zap className="text-yellow-400" /> },
                { title: "Convert", desc: "Auto-send the report. They reply 'SEO' to book a call.", icon: <Mail className="text-purple-400" /> }
              ].map((item, i) => (
                <div key={i} className="glass p-6 rounded-xl border border-white/10 flex gap-4 items-start">
                  <div className="p-3 rounded-lg bg-white/5">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="features" className="py-32 relative z-10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Built for the $100M Agency</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Everything you need to scale from zero to a dominating presence in your niche.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
              <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 ring-1 ring-blue-500/40">
                <Globe className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Deep AI Audits</h3>
              <p className="text-slate-400 leading-relaxed">Not just generic data. We provide actionable, "explain-it-to-your-grandma" level insights that make owners trust you instantly.</p>
            </div>

            <div className="group p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors" />
              <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 ring-1 ring-purple-500/40">
                <Mail className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Value-First Outreach</h3>
              <p className="text-slate-400 leading-relaxed">Our automated emails include the audit. You aren't "cold emailing"—you're delivering a custom-made business gift.</p>
            </div>

            <div className="group p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-green-500/50 transition-all duration-500 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors" />
              <div className="h-14 w-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-8 ring-1 ring-green-500/40">
                <BarChart3 className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Lead Intelligence</h3>
              <p className="text-slate-400 leading-relaxed">Search any niche, in any city. Get verified emails, phone numbers, and addresses. Your pipeline will never be empty again.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Trust Section */}
      <section className="py-24 text-center z-10 relative">
        <div className="container px-4 mx-auto max-w-3xl">
          <blockquote className="text-2xl md:text-3xl italic font-medium text-slate-300 mb-8 leading-snug">
            "Before SEO Sniper, I was sending 50 emails a day and getting crickets. Now, I send 10 emails with custom audits and book 3 meetings. It's a completely different game."
          </blockquote>
          <div className="flex items-center justify-center gap-4 text-left">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
            <div>
              <p className="font-bold text-white">Marcus Sterling</p>
              <p className="text-sm text-slate-500">Founder, RankMaster Agency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section Component */}
      <div id="pricing" className="relative z-10 px-4">
        <div className="max-w-6xl mx-auto py-24 mb-24 rounded-[3rem] bg-indigo-600/5 border border-indigo-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -z-10" />
          <PricingSection />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-32 relative z-10 border-t border-white/5 text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8">Ready to Stop Guessing?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">Join the 1% of agencies using AI to lead with value and dominate their markets.</p>
          <Button size="xl" variant="shiny" className="h-16 px-12 text-lg font-bold" asChild>
            <Link href="/signup">Burn Your Competition Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center relative z-10 bg-black/20">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 inline-block mb-6">
            SEO Sniper
          </Link>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} SEO Sniper. All rights reserved. <br />
            Built for those who lead with value.
          </p>
        </div>
      </footer>
    </main>
  )
}
