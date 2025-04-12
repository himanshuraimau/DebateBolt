"use client"

import { useState, useRef, useEffect } from "react"
import { useDebate } from "@/lib/contexts/DebateContext"
import { analyzeArgumentAPI } from "@/lib/api/ai"
import { DebateControls } from "@/components/debate/DebateControls"
import { DebateMessages } from "@/components/debate/DebateMessages"
import { DebateFeedback } from "@/components/debate/DebateFeedback"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Lightbulb, Target, MessageSquare } from "lucide-react"

export default function DebatePage() {
  const { debate, state, error, startDebate, sendMessage, endDebate, resetDebate } = useDebate()
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [debate?.messages])

  const handleStartDebate = async (topic: string, position: string) => {
    await startDebate(topic, position)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !debate) return

    const messageText = input.trim()
    setInput("")
    setIsAnalyzing(true)

    try {
      // Analyze the user's argument
      const analysis = await analyzeArgumentAPI(messageText)
      
      if (analysis) {
        // Update user score based on analysis
        const userScore = Math.min(100, debate.userScore + analysis.score)
        
        // Send the message with analysis
        await sendMessage(messageText, {
          score: analysis.score,
          feedback: analysis.feedback,
          rebuttals: analysis.rebuttals,
          deliveryTips: analysis.deliveryTips,
          userScore
        })
      }
    } catch (err) {
      console.error("Error analyzing argument:", err)
      // Still send the message even if analysis fails
      await sendMessage(messageText)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleEndDebate = async () => {
    await endDebate()
  }

  if (state === "loading" || isAnalyzing) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={resetDebate} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!debate ? (
            <DebateControls
              onStart={handleStartDebate}
              disabled={state === "loading"}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Topic: {debate.topic}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">Your Position: {debate.position}</p>
                    {debate.userScore !== undefined && (
                      <p className="text-foreground/70 mt-2">Your Score: {debate.userScore}/100</p>
                    )}
                  </CardContent>
                </Card>

                {debate.feedback && (
                  <DebateFeedback feedback={debate.feedback} />
                )}

                <Card className="mb-6">
                  <CardContent className="p-0">
                    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                      <DebateMessages messages={debate.messages} />
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                </Card>

                {state === "active" && (
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Type your argument..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 min-h-[60px] p-2 border rounded-lg"
                      disabled={isAnalyzing}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isAnalyzing}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
                    >
                      {isAnalyzing ? "Analyzing..." : "Send"}
                    </button>
                  </div>
                )}

                {state === "active" && (
                  <button
                    onClick={handleEndDebate}
                    className="mt-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90"
                  >
                    End Debate
                  </button>
                )}
              </div>

              <div className="space-y-6">
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
                        <p className="text-sm">"Structure your arguments with clear claims, evidence, and reasoning."</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <p className="text-sm">"Be concise and focus on your strongest points."</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
