"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ModeToggle } from "@/components/mode-toggle"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mic,
  MicOff,
  Zap,
  Send,
  RotateCcw,
  Award,
  Brain,
  ArrowLeft,
  Clock,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
} from "lucide-react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { analyzeArgument } from "@/lib/services/cerebras"
import { useArgumentAnalysis } from "@/lib/api/ai"

type Debater = "A" | "B"
type Argument = {
  text: string
  score: number
  feedback: string
  rebuttals: string[]
  deliveryTips: string
  timestamp: number
  latency: number
}

type DebateState = {
  A: Argument[]
  B: Argument[]
  currentSpeaker: Debater
  totalScores: { A: number; B: number }
}

// Mock AI response function (would be replaced with actual Llama 4 API call)
const mockAnalyzeArgument = (text: string): Promise<Omit<Argument, "text" | "timestamp">> => {
  return new Promise((resolve) => {
    // Simulate processing time between 0.3 and 0.8 seconds
    const processingTime = Math.random() * 500 + 300

    setTimeout(() => {
      // Generate a random score between 50 and 95
      const score = Math.floor(Math.random() * 45) + 50

      // Different feedback based on score ranges
      let feedback, rebuttals, deliveryTips

      if (score < 60) {
        feedback = "Your argument lacks structure and evidence."
        rebuttals = [
          "Ask for specific examples to support their claims.",
          "Point out logical fallacies in their reasoning.",
          "Question the relevance of their points to the topic.",
        ]
        deliveryTips = "Slow down and organize your thoughts before speaking."
      } else if (score < 75) {
        feedback = "Decent points, but could use stronger evidence."
        rebuttals = [
          "Request data to back up their assertions.",
          "Highlight any contradictions in their argument.",
          "Offer a counterexample that challenges their position.",
        ]
        deliveryTips = "Use more confident language and emphasize key points."
      } else if (score < 85) {
        feedback = "Strong argument with good reasoning."
        rebuttals = [
          "Acknowledge their points but offer alternative interpretations.",
          "Shift the focus to aspects they didn't address.",
          "Present a more nuanced perspective on the issue.",
        ]
        deliveryTips = "Great pacing, but vary your tone for emphasis."
      } else {
        feedback = "Excellent argument with compelling evidence."
        rebuttals = [
          "Focus on minor details they overlooked.",
          "Accept their premises but challenge their conclusions.",
          "Reframe the debate around a different aspect of the issue.",
        ]
        deliveryTips = "Outstanding delivery! Maintain this level of clarity."
      }

      resolve({
        score,
        feedback,
        rebuttals,
        deliveryTips,
        latency: processingTime / 1000,
      })
    }, processingTime)
  })
}

export default function DebatePage() {
  const [debateState, setDebateState] = useState<DebateState>({
    A: [],
    B: [],
    currentSpeaker: "A",
    totalScores: { A: 0, B: 0 },
  })

  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null)
  const [autoSwitch, setAutoSwitch] = useState(true)
  const [timeLimit, setTimeLimit] = useState(60) // seconds
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isMobile = useMobile()
  const debateEndRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    let SpeechRecognition: SpeechRecognitionStatic | null = null
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("")

        setInputText(transcript)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsRecording(false)
      }

      setSpeechRecognition(recognition)
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsTimerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerActive, timeRemaining])

  // Scroll to bottom when new arguments are added
  useEffect(() => {
    if (debateEndRef.current) {
      debateEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [debateState.A.length, debateState.B.length])

  const toggleRecording = () => {
    if (!speechRecognition) return

    if (isRecording) {
      speechRecognition.stop()
      setIsRecording(false)
      setIsTimerActive(false)
    } else {
      speechRecognition.start()
      setIsRecording(true)
      setTimeRemaining(timeLimit)
      setIsTimerActive(true)
    }
  }

  const handleSubmitArgument = async () => {
    if (!inputText.trim() || isProcessing) return

    setIsProcessing(true)

    if (isRecording && speechRecognition) {
      speechRecognition.stop()
      setIsRecording(false)
      setIsTimerActive(false)
    }

    const { data: analysis } = await useArgumentAnalysis(inputText)

    if (analysis) {
      const newArgument: Argument = {
        text: inputText,
        timestamp: Date.now(),
        ...analysis,
      }

      setDebateState((prev) => {
        const speaker = prev.currentSpeaker
        const newArguments = [...prev[speaker], newArgument]
        const newTotalScore = newArguments.reduce((sum, arg) => sum + arg.score, 0)

        return {
          ...prev,
          [speaker]: newArguments,
          currentSpeaker: autoSwitch ? (speaker === "A" ? "B" : "A") : speaker,
          totalScores: {
            ...prev.totalScores,
            [speaker]: newTotalScore,
          },
        }
      })
    }

    setInputText("")
    setIsProcessing(false)
  }

  const resetDebate = () => {
    if (window.confirm("Are you sure you want to reset the debate? All progress will be lost.")) {
      setDebateState({
        A: [],
        B: [],
        currentSpeaker: "A",
        totalScores: { A: 0, B: 0 },
      })
      setInputText("")
      setIsProcessing(false)
      if (isRecording && speechRecognition) {
        speechRecognition.stop()
        setIsRecording(false)
      }
      setIsTimerActive(false)
      setTimeRemaining(timeLimit)
    }
  }

  const switchSpeaker = () => {
    setDebateState((prev) => ({
      ...prev,
      currentSpeaker: prev.currentSpeaker === "A" ? "B" : "A",
    }))
  }

  const getMoodEmoji = (score: number) => {
    if (score >= 85) return <ThumbsUp className="h-6 w-6 text-green-500" />
    if (score >= 70) return <Smile className="h-6 w-6 text-amber-500" />
    if (score >= 50) return <Meh className="h-6 w-6 text-orange-500" />
    return <Frown className="h-6 w-6 text-red-500" />
  }

  const getWinner = () => {
    const { A, B } = debateState.totalScores
    if (A > B) return "A"
    if (B > A) return "B"
    return null
  }

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
            <Button variant="outline" size="sm" onClick={resetDebate}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main debate area */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-bold">Debate Arena</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={getWinner() ? "default" : "outline"}>
                    {getWinner() ? `Debater ${getWinner()} Leading` : "Tied"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center border-b bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      Debater A
                    </Badge>
                    <div className="text-2xl font-bold">{debateState.totalScores.A}</div>
                  </div>
                  <Award
                    className={`h-6 w-6 ${debateState.totalScores.A > debateState.totalScores.B ? "text-amber-600" : "text-muted-foreground"}`}
                  />
                </div>

                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    VS
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <Award
                    className={`h-6 w-6 ${debateState.totalScores.B > debateState.totalScores.A ? "text-amber-600" : "text-muted-foreground"}`}
                  />
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      Debater B
                    </Badge>
                    <div className="text-2xl font-bold">{debateState.totalScores.B}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {debateState.A.length === 0 && debateState.B.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg mb-2">No arguments yet</p>
                    <p>Start the debate by submitting your first argument below.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Interleave arguments from both debaters in chronological order */}
                    {[
                      ...debateState.A.map((arg) => ({ ...arg, debater: "A" })),
                      ...debateState.B.map((arg) => ({ ...arg, debater: "B" })),
                    ]
                      .sort((a, b) => a.timestamp - b.timestamp)
                      .map((arg, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-4 ${arg.debater === "A" ? "bg-primary/20" : "bg-secondary/30"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">Debater {arg.debater}</Badge>
                            <div className="flex items-center gap-2">
                              {getMoodEmoji(arg.score)}
                              <Badge variant={arg.score >= 75 ? "default" : "secondary"}>Score: {arg.score}/100</Badge>
                            </div>
                          </div>
                          <p className="mb-3">{arg.text}</p>
                          <Separator className="my-3" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                <Brain className="h-4 w-4" /> Feedback
                              </h4>
                              <p className="text-sm text-muted-foreground">{arg.feedback}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                <Award className="h-4 w-4" /> Delivery Tips
                              </h4>
                              <p className="text-sm text-muted-foreground">{arg.deliveryTips}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">Potential Rebuttals:</h4>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                              {arg.rebuttals.map((rebuttal, i) => (
                                <li key={i}>{rebuttal}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Analysis in {arg.latency.toFixed(2)}s</span>
                          </div>
                        </div>
                      ))}
                    <div ref={debateEndRef} />
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Current Speaker: Debater {debateState.currentSpeaker}</h3>
                  <Button variant="outline" size="sm" onClick={switchSpeaker} disabled={isRecording || isProcessing}>
                    Switch Speaker
                  </Button>
                </div>
                {isTimerActive && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time Remaining</span>
                      <span>
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <Progress value={(timeRemaining / timeLimit) * 100} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <Textarea
                  placeholder="Enter your argument here..."
                  className="min-h-[120px] mb-4"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isRecording || isProcessing}
                />

                <div className="flex flex-wrap gap-2">
                  {speechRecognition && (
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={toggleRecording}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={handleSubmitArgument}
                    disabled={!inputText.trim() || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Argument
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Settings panel */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Debate Settings</h2>
              </div>

              <div className="p-4 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-switch" className="flex items-center gap-2">
                      Auto-switch speakers
                    </Label>
                    <Switch id="auto-switch" checked={autoSwitch} onCheckedChange={setAutoSwitch} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically switch between debaters after each argument
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-limit">Time limit: {timeLimit} seconds</Label>
                  <Slider
                    id="time-limit"
                    min={15}
                    max={120}
                    step={15}
                    value={[timeLimit]}
                    onValueChange={(value) => {
                      setTimeLimit(value[0])
                      setTimeRemaining(value[0])
                    }}
                    disabled={isTimerActive}
                  />
                  <p className="text-sm text-muted-foreground">Set the maximum time for each argument</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Debate Stats</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Arguments</span>
                      <span className="font-medium">{debateState.A.length + debateState.B.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Debater A Arguments</span>
                      <span className="font-medium">{debateState.A.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Debater B Arguments</span>
                      <span className="font-medium">{debateState.B.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Score A</span>
                      <span className="font-medium">
                        {debateState.A.length ? Math.round(debateState.totalScores.A / debateState.A.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Score B</span>
                      <span className="font-medium">
                        {debateState.B.length ? Math.round(debateState.totalScores.B / debateState.B.length) : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">About DebateBolt</h3>
                  <p className="text-sm text-muted-foreground">
                    DebateBolt uses advanced AI to provide real-time feedback and scoring for debates. Powered by Llama
                    4, it analyzes arguments in under a second.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
