"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientHeading, GlassCard } from "@/components/ui-elements"
import { Mic, MicOff, Send, Bot, Award, Brain, ArrowLeft, Clock, Lightbulb, BarChart, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchDebateTopics } from "@/lib/api"
import { generateDebateResponse, analyzeArgument } from "@/lib/services/cerebras"
import { useArgumentAnalysis, useDebateResponse, DebateMessage } from "@/lib/api/ai"

type Message = {
  id: string
  sender: "You" | "AI"
  text: string
  timestamp: Date
}

type DebateState = {
  topic: string
  userScore: number
  aiScore: number
  round: number
  status: "selecting" | "debating" | "finished"
  feedback: string | null
}

export default function AIDebatePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isAiThinking, setIsAiThinking] = useState(false)

  const [debateState, setDebateState] = useState<DebateState>({
    topic: "",
    userScore: 0,
    aiScore: 0,
    round: 0,
    status: "selecting",
    feedback: null,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch debate topics using TanStack Query
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ["debateTopics"],
    queryFn: fetchDebateTopics,
  })

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Timer effect
  useEffect(() => {
    if (debateState.status === "debating") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [debateState.status])

  const selectTopic = (topic: string) => {
    setDebateState({
      ...debateState,
      topic,
      status: "debating",
      round: 1,
    })

    // Add system message
    const systemMessage: Message = {
      id: Date.now().toString(),
      sender: "AI",
      text: `Topic selected: "${topic}". I'll take the opposing side. You can start with your opening argument.`,
      timestamp: new Date(),
    }

    setMessages([systemMessage])
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    // In a real app, this would start/stop speech recognition
    if (!isRecording) {
      // Simulate speech recognition
      setTimeout(() => {
        setMessageText("I believe that this topic is important because...")
      }, 2000)
    }
  }

  const sendMessage = async () => {
    if (!messageText.trim() || isAiThinking) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageText("")

    // Analyze the user's argument
    const { data: analysis } = await useArgumentAnalysis(messageText)
    
    if (analysis) {
      // Update user score based on analysis
      setDebateState((prev) => ({
        ...prev,
        userScore: prev.userScore + analysis.score,
        feedback: `+${analysis.score} points! ${analysis.feedback}`,
      }))

      // Clear feedback after 5 seconds
      setTimeout(() => {
        setDebateState((prev) => ({ ...prev, feedback: null }))
      }, 5000)
    }

    // Generate AI response
    setIsAiThinking(true)
    try {
      const debateMessages: DebateMessage[] = [
        { role: "system", content: `You are debating the topic: "${debateState.topic}". Take the opposing position.` },
        ...messages.map(msg => ({
          role: msg.sender === "You" ? "user" : "assistant",
          content: msg.text
        })),
        { role: "user", content: messageText }
      ]

      const { mutateAsync: generateResponse } = useDebateResponse(debateMessages)
      const aiResponse = await generateResponse(debateMessages)

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "AI",
        text: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, responseMessage])

      // Update AI score (random for demo)
      const aiPointsGained = Math.floor(Math.random() * 15) + 5
      setDebateState((prev) => ({
        ...prev,
        aiScore: prev.aiScore + aiPointsGained,
        round: prev.round + 1,
      }))

      // End debate after 5 rounds
      if (debateState.round >= 4) {
        setTimeout(() => {
          setDebateState((prev) => ({
            ...prev,
            status: "finished",
          }))

          const conclusionMessage: Message = {
            id: (Date.now() + 2).toString(),
            sender: "AI",
            text: `This concludes our debate on "${debateState.topic}". ${
              debateState.userScore > debateState.aiScore
                ? "Congratulations! You've won this debate with compelling arguments."
                : debateState.userScore === debateState.aiScore
                  ? "This debate ends in a tie. Both sides presented strong arguments."
                  : "I've won this debate, but you made some excellent points."
            }`,
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, conclusionMessage])
        }, 2000)
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
      // Fallback to a simple response if the AI fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "AI",
        text: "I apologize, but I'm having trouble generating a response right now. Could you please rephrase your argument?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsAiThinking(false)
    }
  }

  const getRandomFeedback = () => {
    const feedbackOptions = [
      "Good use of evidence to support your claim.",
      "Your argument structure is clear and logical.",
      "Try to address counterarguments more directly.",
      "Consider using more specific examples.",
      "Your rhetorical techniques are effective.",
      "Work on connecting your points more cohesively.",
    ]

    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetDebate = () => {
    setMessages([])
    setMessageText("")
    setElapsedTime(0)
    setDebateState({
      topic: "",
      userScore: 0,
      aiScore: 0,
      round: 0,
      status: "selecting",
      feedback: null,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <GradientHeading className="text-3xl md:text-4xl mb-2">AI Debate Arena</GradientHeading>
            <p className="text-foreground/70">Challenge our AI to a structured debate on various topics</p>
          </div>
          <div className="flex items-center gap-4">
            {debateState.status === "debating" && (
              <div className="bg-muted px-4 py-2 rounded-md flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            )}
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {debateState.status === "selecting" ? (
          <div className="max-w-4xl mx-auto">
            <GlassCard className="mb-8">
              <div className="text-center py-6">
                <Bot className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Select a Debate Topic</h2>
                <p className="text-foreground/70 mb-8 max-w-lg mx-auto">
                  Choose a topic to start debating with our AI. The AI will take the opposing viewpoint to challenge
                  your arguments.
                </p>
              </div>
            </GlassCard>

            {topicsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : topics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => selectTopic(topic.title)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/20 p-2 rounded-md">
                          <Lightbulb className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">{topic.title}</h3>
                          <p className="text-sm text-foreground/70">
                            {topic.category} • {topic.difficulty}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-foreground/70">Failed to load topics. Please try again later.</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Topic: {debateState.topic}
                  </CardTitle>
                </CardHeader>
              </Card>

              {debateState.feedback && (
                <div className="mb-6 cyber-border p-4 bg-muted/30 flex items-start gap-4">
                  <Brain className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Feedback</h3>
                    <p className="text-foreground/80">{debateState.feedback}</p>
                  </div>
                </div>
              )}

              <Card className="mb-6">
                <CardContent className="p-0">
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.sender === "You" ? "bg-primary/20 text-foreground" : "bg-muted text-foreground"
                          }`}
                        >
                          <div className="font-semibold text-xs mb-1 flex items-center gap-1">
                            {message.sender === "AI" && <Bot className="h-3 w-3" />}
                            {message.sender}
                          </div>
                          <p>{message.text}</p>
                          <div className="text-xs text-foreground/50 text-right mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isAiThinking && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted text-foreground">
                          <div className="font-semibold text-xs mb-1 flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            AI
                          </div>
                          <div className="flex gap-1">
                            <span className="animate-pulse">•</span>
                            <span className="animate-pulse animation-delay-200">•</span>
                            <span className="animate-pulse animation-delay-400">•</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
              </Card>

              {debateState.status === "debating" ? (
                <div className="flex gap-2">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    className="flex-shrink-0"
                    onClick={toggleRecording}
                  >
                    {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                    {isRecording ? "Stop" : "Record"}
                  </Button>
                  <Textarea
                    placeholder="Type your argument..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[60px]"
                    disabled={isAiThinking}
                  />
                  <Button
                    className="flex-shrink-0"
                    onClick={sendMessage}
                    disabled={!messageText.trim() || isAiThinking}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button onClick={resetDebate} className="px-8">
                    Start New Debate
                  </Button>
                </div>
              )}
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
                        <span className="font-semibold">{debateState.userScore}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, debateState.userScore)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>AI</span>
                        <span className="font-semibold">{debateState.aiScore}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${Math.min(100, debateState.aiScore)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Debate Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Current Round</span>
                          <span>{debateState.round}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Leading</span>
                          <span>
                            {debateState.userScore > debateState.aiScore
                              ? "You"
                              : debateState.userScore < debateState.aiScore
                                ? "AI"
                                : "Tied"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Point Difference</span>
                          <span>{Math.abs(debateState.userScore - debateState.aiScore)}</span>
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
                    Debate Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/30 rounded-md">
                      <p className="text-sm">"Use specific examples and data to support your arguments."</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <p className="text-sm">"Address your opponent's points directly to show engagement."</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <p className="text-sm">"Structure your arguments with clear claims, evidence, and reasoning."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Logic</span>
                        <span>Good</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Evidence</span>
                        <span>Fair</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rebuttals</span>
                        <span>Excellent</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clarity</span>
                        <span>Good</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "70%" }}></div>
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
