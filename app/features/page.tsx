import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import {
  Zap,
  MessageSquare,
  Award,
  Brain,
  Clock,
  Mic,
  ArrowLeft,
  BarChart,
  Lightbulb,
  Sparkles,
  RefreshCw,
  Users,
  Laptop,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <Zap className="h-6 w-6 text-amber-600" />
              <span className="font-bold text-xl">DebateBolt</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/debate">
              <Button>Start Debating</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Features</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover how DebateBolt can transform your debating experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <FeatureCard
              icon={<Mic className="h-8 w-8 text-amber-600" />}
              title="Live Input Processing"
              description="Capture spoken arguments via speech-to-text or type them directly. Our system processes both methods with equal efficiency."
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Real-time speech recognition with high accuracy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Support for two debaters in head-to-head format</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Automatic timer to keep arguments concise</span>
                </li>
              </ul>
            </FeatureCard>

            <FeatureCard
              icon={<Brain className="h-8 w-8 text-amber-600" />}
              title="Instant Coaching Feedback"
              description="Receive immediate analysis and feedback on your arguments to help you improve in real-time."
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Argument strength scores from 0-100</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Specific rebuttal suggestions to counter opponents</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Delivery tips to improve presentation style</span>
                </li>
              </ul>
            </FeatureCard>

            <FeatureCard
              icon={<Award className="h-8 w-8 text-amber-600" />}
              title="Real-Time Debate Judging"
              description="Get objective scoring and evaluation as if a professional judge were analyzing your debate."
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Point system based on logic, clarity, and persuasiveness</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Detailed score breakdown for each argument</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Live scoreboard with winner prediction</span>
                </li>
              </ul>
            </FeatureCard>

            <FeatureCard
              icon={<Clock className="h-8 w-8 text-amber-600" />}
              title="Speed Showcase"
              description="Experience the power of ultra-fast AI analysis with response times that will amaze you."
            >
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Real-time latency meter showing sub-second response times</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Powered by Cerebras's ultra-fast Llama 4 inference</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>No waiting for feedback - continue your debate flow</span>
                </li>
              </ul>
            </FeatureCard>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-amber-600" />}
              title="Visual Feedback"
              description="Intuitive visual cues help you quickly understand the quality of your arguments."
            />

            <FeatureCard
              icon={<BarChart className="h-8 w-8 text-amber-600" />}
              title="Debate Analytics"
              description="Track your performance over time with comprehensive statistics and metrics."
            />

            <FeatureCard
              icon={<Lightbulb className="h-8 w-8 text-amber-600" />}
              title="Learning Tools"
              description="Improve your debating skills with targeted suggestions and practice exercises."
            />

            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-amber-600" />}
              title="Customizable Experience"
              description="Adjust settings to match your debate style and preferences."
            />

            <FeatureCard
              icon={<RefreshCw className="h-8 w-8 text-amber-600" />}
              title="Continuous Improvement"
              description="Our AI learns from each debate to provide increasingly relevant feedback."
            />

            <FeatureCard
              icon={<Users className="h-8 w-8 text-amber-600" />}
              title="Multi-User Support"
              description="Perfect for debate teams, classrooms, or friendly competitions."
            />
          </div>

          <div className="bg-primary/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Debate Skills?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Experience the power of AI-assisted debate coaching and judging with DebateBolt. Start your first debate
              session today and see the difference.
            </p>
            <Link href="/debate">
              <Button size="lg" className="px-8">
                <Laptop className="mr-2 h-5 w-5" />
                Launch Debate Arena
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Zap className="h-5 w-5 text-amber-600" />
              <span className="font-bold">DebateBolt</span>
            </div>
            <div className="text-sm text-muted-foreground">
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
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}
