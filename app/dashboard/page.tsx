"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientHeading, GlassCard } from "@/components/ui-elements"
import { Users, Bot, Copy, Check, ArrowRight, Award, History, Settings, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchDebateTopics, fetchUserStats } from "@/lib/api"

export default function DashboardPage() {
  const [roomCode, setRoomCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [generatedRoomCode, setGeneratedRoomCode] = useState("")

  // Fetch debate topics using TanStack Query
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ["debateTopics"],
    queryFn: fetchDebateTopics,
  })

  // Fetch user stats using TanStack Query
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  })

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedRoomCode(code)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRoomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <GradientHeading className="text-3xl md:text-4xl mb-2">Debate Dashboard</GradientHeading>
          <p className="text-foreground/70">Create or join debates, track your progress, and improve your skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="create" className="text-lg py-3">
                  Create Debate
                </TabsTrigger>
                <TabsTrigger value="join" className="text-lg py-3">
                  Join Debate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-8">
                <GlassCard>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-muted/50 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Human Opponent
                        </CardTitle>
                        <CardDescription>Debate with another person using WebRTC video and audio</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/70 mb-4">
                          Create a room and share the code with your opponent to start a live debate session.
                        </p>
                        {generatedRoomCode ? (
                          <div className="bg-background p-4 rounded-md flex items-center justify-between">
                            <span className="font-mono text-lg">{generatedRoomCode}</span>
                            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        ) : null}
                      </CardContent>
                      <CardFooter>
                        {generatedRoomCode ? (
                          <div className="w-full flex gap-4">
                            <Button className="w-full" onClick={copyToClipboard}>
                              {copied ? "Copied!" : "Copy Code"}
                            </Button>
                            <Link href={`/debate/room/${generatedRoomCode}`} className="w-full">
                              <Button className="w-full bg-primary hover:bg-primary/80">Enter Room</Button>
                            </Link>
                          </div>
                        ) : (
                          <Button className="w-full" onClick={generateRoomCode}>
                            Generate Room Code
                          </Button>
                        )}
                      </CardFooter>
                    </Card>

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
                  </div>
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
                        <option>Peer Voting</option>
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

              <TabsContent value="join">
                <GlassCard>
                  <div className="text-center py-6">
                    <h3 className="text-xl font-semibold mb-4">Join an Existing Debate</h3>
                    <p className="text-foreground/70 mb-6 max-w-md mx-auto">
                      Enter the room code shared by the debate creator to join their session
                    </p>
                    <div className="flex gap-4 max-w-md mx-auto">
                      <Input
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="text-center text-lg font-mono"
                      />
                      <Link href={roomCode ? `/debate/room/${roomCode}` : "#"}>
                        <Button disabled={!roomCode} className="bg-primary hover:bg-primary/80">
                          Join <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </GlassCard>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Recent Rooms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { code: "XY12Z9", topic: "Climate Change Solutions", time: "2 hours ago" },
                      { code: "AB34CD", topic: "AI Ethics Debate", time: "Yesterday" },
                      { code: "QW56ER", topic: "Education Reform", time: "3 days ago" },
                    ].map((room) => (
                      <Card key={room.code} className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">{room.topic}</CardTitle>
                          <CardDescription className="text-xs">{room.time}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2">
                          <Link href={`/debate/room/${room.code}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              Rejoin Room
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
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
                    <span>Camera</span>
                    <div className="w-12 h-6 bg-muted rounded-full relative">
                      <div className="absolute w-5 h-5 bg-primary rounded-full top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Microphone</span>
                    <div className="w-12 h-6 bg-muted rounded-full relative">
                      <div className="absolute w-5 h-5 bg-primary rounded-full top-0.5 right-0.5"></div>
                    </div>
                  </div>
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
