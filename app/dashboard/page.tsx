"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientHeading, GlassCard } from "@/components/ui-elements"
import { Bot, Award, History, Settings, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchUserStats } from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  // Fetch user stats using TanStack Query
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <GradientHeading className="text-3xl md:text-4xl mb-2">Debate Dashboard</GradientHeading>
          <p className="text-foreground/70">Track your progress and improve your skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="create" className="text-lg py-3">
                  Create Debate
                </TabsTrigger>
                <TabsTrigger value="history" className="text-lg py-3">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-8">
                <GlassCard>
                  <Card className="bg-muted/50 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        AI Opponent
                      </CardTitle>
                      <CardDescription>Practice your skills against our advanced AI debate system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70">
                        Select a topic and difficulty level to start debating against our AI. Perfect for practice and
                        skill development.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/debate/ai" className="w-full">
                        <Button className="w-full">Start AI Debate</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </GlassCard>

                <Card>
                  <CardHeader>
                    <CardTitle>Debate Settings</CardTitle>
                    <CardDescription>Customize your debate experience</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Debate Format</label>
                      <select className="w-full bg-muted p-2 rounded-md border border-border">
                        <option>Oxford Style</option>
                        <option>Lincoln-Douglas</option>
                        <option>Parliamentary</option>
                        <option>Cross-Examination</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Time Limit</label>
                      <select className="w-full bg-muted p-2 rounded-md border border-border">
                        <option>2 minutes</option>
                        <option>3 minutes</option>
                        <option>5 minutes</option>
                        <option>10 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Judging</label>
                      <select className="w-full bg-muted p-2 rounded-md border border-border">
                        <option>AI Judge</option>
                        <option>No Judging</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Topic Category</label>
                      <select className="w-full bg-muted p-2 rounded-md border border-border">
                        <option>Politics</option>
                        <option>Technology</option>
                        <option>Ethics</option>
                        <option>Environment</option>
                        <option>Education</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Debate History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">Your past debates will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userStats ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Total Debates</span>
                      <span className="font-semibold">{userStats.totalDebates}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Win Rate</span>
                      <span className="font-semibold">{userStats.winRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Average Score</span>
                      <span className="font-semibold">{userStats.averageScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Debates This Week</span>
                      <span className="font-semibold">{userStats.debatesThisWeek}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-foreground/70">Failed to load stats</div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/stats" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Detailed Stats
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userStats ? (
                  <div className="space-y-4">
                    {userStats.recentActivity.map((activity, i) => (
                      <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-foreground/60">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-foreground/70">Failed to load activity</div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/history" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Quick Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <div className="w-12 h-6 bg-muted rounded-full relative">
                      <div className="absolute w-5 h-5 bg-primary rounded-full top-0.5 right-0.5"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/settings" className="w-full">
                  <Button variant="outline" className="w-full">
                    All Settings
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
