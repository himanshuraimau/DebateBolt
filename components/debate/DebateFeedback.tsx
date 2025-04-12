import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Lightbulb, Target, MessageSquare } from "lucide-react"

interface DebateFeedbackProps {
  feedback: {
    score: number
    feedback: string
    rebuttals?: string[]
    deliveryTips: string
  }
}

export function DebateFeedback({ feedback }: DebateFeedbackProps) {
  const rebuttals = feedback.rebuttals || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Score: {feedback.score}/100
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Brain className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Analysis</h3>
                <p className="text-foreground/80">{feedback.feedback}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Potential Rebuttals</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  {rebuttals.map((rebuttal, index) => (
                    <li key={index}>{rebuttal}</li>
                  ))}
                  {rebuttals.length === 0 && (
                    <li className="text-foreground/60">No specific rebuttals identified.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Lightbulb className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Delivery Tips</h3>
                <p className="text-foreground/80">{feedback.deliveryTips}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 