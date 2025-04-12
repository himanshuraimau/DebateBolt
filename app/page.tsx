import type React from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { GradientHeading, GlassCard, HexagonIcon, GridBackground } from "@/components/ui-elements"
import Link from "next/link"
import { Zap, MessageSquare, Award, Brain, Laptop, Users, Bot, Video } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <GridBackground className="h-full w-full">
              <></>
            </GridBackground>
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <GradientHeading as="h1" className="text-4xl md:text-6xl">
                  Decentralized Debates
                </GradientHeading>
                <span className="block mt-2">for the Digital Era</span>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-foreground/80">
                Connect, debate, and grow with our cutting-edge WebRTC platform powered by AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/80">
                    Enter App
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 text-foreground">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-1/4 left-10 w-24 h-24 opacity-20 animate-float hidden lg:block">
              <div className="w-full h-full rounded-full bg-primary blur-xl"></div>
            </div>
            <div className="absolute bottom-1/4 right-10 w-32 h-32 opacity-20 animate-float animation-delay-2000 hidden lg:block">
              <div className="w-full h-full rounded-full bg-accent blur-xl"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <GradientHeading className="text-3xl md:text-4xl mb-4">Revolutionary Features</GradientHeading>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                Experience debate like never before with our modern platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Video className="h-10 w-10 text-primary" />}
                title="WebRTC Live Debates"
                description="Connect with opponents in real-time with high-quality video and audio streaming."
              />
              <FeatureCard
                icon={<Bot className="h-10 w-10 text-primary" />}
                title="AI Debate Opponents"
                description="Practice with our advanced AI opponents when human debaters aren't available."
              />
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-primary" />}
                title="Real-time Analysis"
                description="Get instant feedback on your arguments with our AI-powered analysis engine."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-primary" />}
                title="Fair Judging"
                description="Fair and transparent scoring with verified results."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Community Challenges"
                description="Join tournaments and climb the leaderboard in our global debate community."
              />
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10 text-primary" />}
                title="Advanced Feedback"
                description="Receive detailed insights to improve your debating skills over time."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <GradientHeading className="text-3xl md:text-4xl mb-4">How It Works</GradientHeading>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                Getting started with DebateBolt is simple and intuitive
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard
                number="01"
                title="Create or Join"
                description="Create a new debate room or join an existing one with a simple room code."
              />
              <StepCard
                number="02"
                title="Choose Your Mode"
                description="Select between human opponents via WebRTC or challenge our AI for practice."
              />
              <StepCard
                number="03"
                title="Debate & Improve"
                description="Engage in structured debates and receive feedback to enhance your skills."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto text-center p-12" glowing>
              <GradientHeading className="text-3xl md:text-4xl mb-6">Ready to Transform Your Debates?</GradientHeading>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/80">
                Join DebateBolt today and experience the future of debate platforms with modern technology.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-10 py-6 bg-primary hover:bg-primary/80">
                  <Laptop className="mr-2 h-5 w-5" />
                  Launch Dashboard
                </Button>
              </Link>
            </GlassCard>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold">DebateBolt</span>
            </div>
            <div className="text-sm text-foreground/60">
              © {new Date().getFullYear()} DebateBolt. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <GlassCard className="h-full transition-all duration-300 hover:translate-y-[-5px]">
      <div className="mb-4">
        <HexagonIcon className="w-16 h-16">{icon}</HexagonIcon>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </GlassCard>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="relative">
      <div className="text-6xl font-bold text-primary/20 absolute -top-6 left-0">{number}</div>
      <div className="pt-8 pl-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </div>
    </div>
  )
}
