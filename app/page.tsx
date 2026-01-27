import { Button } from "@/components/ui/button"
import { PricingSection } from "@/components/pricing-section"
import { ArrowRight, BarChart3, Globe, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 container mx-auto text-center z-10">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white backdrop-blur-xl mb-8">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Now Available in Beta
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 mb-6 drop-shadow-sm">
          SEO Intelligence <br />
          <span className="text-white">Simplified.</span>
        </h1>

        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl mb-10 leading-relaxed">
          Stop guessing. Get actionable SEO audits for your site, or find high-intent leads for your agency. Powered by advanced automation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" variant="shiny" className="h-12 px-8 text-base" asChild>
            <a href="#pricing">
              Start for Free <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base glass" asChild>
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-lg">
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Full Site Audits</h3>
              <p className="text-muted-foreground">Comprehensive analysis of your website's performance, accessibility, and SEO health.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-lg">
              <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Instant Insights</h3>
              <p className="text-muted-foreground">Get your customized report delivered straight to your inbox in minutes, not days.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-lg">
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Lead Generation</h3>
              <p className="text-muted-foreground">Agencies can find targeted businesses and valid email addresses with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section Component */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10 text-center relative z-10">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SEO Reporter. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
