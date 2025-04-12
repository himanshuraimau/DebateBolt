"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientHeading, GlassCard } from "@/components/ui-elements"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Send,
  Users,
  Settings,
  Award,
  Clock,
  Brain,
  Share2,
  X,
} from "lucide-react"
import Link from "next/link"
import { generateDebateFeedback } from "@/lib/services/cerebras"
import { useDebateFeedback } from "@/lib/api/ai"

type Message = {
  id: string
  sender: string
  text: string
  timestamp: Date
}

export default function DebateRoomPage() {
  const params = useParams()
  const roomId = params.roomId as string

  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isWaiting, setIsWaiting] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Mock WebRTC connection
  useEffect(() => {
    // Simulate connection after 3 seconds
    const timer = setTimeout(() => {
      setIsWaiting(false)
      setIsConnected(true)

      // Start debate timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)

      // Simulate getting local video
      if (localVideoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localVideoRef.current!.srcObject = stream
          })
          .catch((err) => {
            console.error("Error accessing media devices:", err)
          })
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Generate AI feedback
  useEffect(() => {
    if (isConnected && elapsedTime > 0 && elapsedTime % 30 === 0) {
      const transcript = messages
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join('\n')
      
      const { data: feedback } = useDebateFeedback(transcript)
      
      if (feedback) {
        setFeedback(feedback)

        // Clear feedback after 5 seconds
        setTimeout(() => {
          setFeedback(null)
        }, 5000)
      }
    }
  }, [elapsedTime, isConnected, messages])

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const sendMessage = () => {
    if (!messageText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageText("")

    // Simulate response after 1 second
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "Opponent",
        text: "I see your point, but I'd like to offer a different perspective...",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <GradientHeading className="text-3xl md:text-4xl mb-2">Debate Room: {roomId}</GradientHeading>
            <p className="text-foreground/70">Live WebRTC debate session</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-muted px-4 py-2 rounded-md flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Link href="/dashboard">
              <Button variant="destructive" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {isWaiting ? (
          <GlassCard className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-pulse mb-6">
              <Users className="h-16 w-16 mx-auto text-primary opacity-70" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Waiting for opponent to join...</h2>
            <p className="text-foreground/70 mb-6">
              Share the room code <span className="font-mono bg-muted px-2 py-1 rounded">{roomId}</span> with your
              opponent
            </p>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(roomId)}>
                Copy Room Code
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-[300px] object-cover rounded-lg ${isVideoOn ? "" : "bg-muted"}`}
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background/80 p-4 rounded-full">
                        <VideoOff className="h-8 w-8 text-foreground/70" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-background/80 px-3 py-1 rounded-md text-sm">
                    You (Proposition)
                  </div>
                </div>

                <div className="relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-[300px] bg-muted object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/80 p-4 rounded-full">
                      <Users className="h-8 w-8 text-foreground/70" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-background/80 px-3 py-1 rounded-md text-sm">
                    Opponent (Opposition)
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <Button
                  variant={isMicOn ? "default" : "destructive"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={toggleMic}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </div>

              {feedback && (
                <div className="mb-8 cyber-border p-4 bg-muted/30 flex items-start gap-4">
                  <Brain className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">AI Feedback</h3>
                    <p className="text-foreground/80">{feedback}</p>
                  </div>
                </div>
              )}

              <Tabs defaultValue="chat">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Chat
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" /> Notes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="border rounded-md mt-4">
                  <div className="h-[300px] overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-foreground/50 h-full flex items-center justify-center">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.sender === "You" ? "bg-primary/20 text-foreground" : "bg-muted text-foreground"
                            }`}
                          >
                            <div className="font-semibold text-xs mb-1">{message.sender}</div>
                            <p>{message.text}</p>
                            <div className="text-xs text-foreground/50 text-right mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <Textarea
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-[60px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                    />
                    <Button className="self-end" onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="border rounded-md mt-4 p-4">
                  <Textarea placeholder="Take notes during the debate..." className="min-h-[360px] bg-muted/30" />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Debate Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>You</span>
                        <span className="font-semibold">72/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "72%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Opponent</span>
                        <span className="font-semibold">68/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: "68%" }}></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Score Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Logic</span>
                          <span>24/30</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Evidence</span>
                          <span>18/25</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Delivery</span>
                          <span>15/20</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Rebuttals</span>
                          <span>15/25</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      <>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <p className="text-sm">"Consider addressing the economic impact of your opponent's proposal."</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <p className="text-sm">
                            "Your argument about sustainability lacks specific examples. Try mentioning case studies."
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <p className="text-sm">
                            "When your opponent mentions statistics, ask for their source to strengthen your position."
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-foreground/70 text-center py-4">
                        Suggestions will appear as the debate progresses
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Room Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>AI Feedback</span>
                      <div className="w-12 h-6 bg-muted rounded-full relative">
                        <div className="absolute w-5 h-5 bg-primary rounded-full top-0.5 right-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-Recording</span>
                      <div className="w-12 h-6 bg-muted rounded-full relative">
                        <div className="absolute w-5 h-5 bg-primary rounded-full top-0.5 right-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Public Room</span>
                      <div className="w-12 h-6 bg-muted rounded-full relative">
                        <div className="absolute w-5 h-5 bg-muted-foreground rounded-full top-0.5 left-0.5"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
