"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock, Heart, Users, Activity, TrendingUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"

interface ClassificationQuestion {
  id: string
  question: string
  options: { value: string; label: string; description?: string }[]
  icon: React.ReactNode
}

const classificationQuestions: ClassificationQuestion[] = [
  {
    id: "duration",
    question: "How long have you been experiencing these feelings or concerns?",
    icon: <Clock className="w-6 h-6" />,
    options: [
      { value: "recent", label: "Recently (within the last few days)", description: "New or sudden onset" },
      { value: "weeks", label: "A few weeks", description: "Ongoing for 2-4 weeks" },
      { value: "months", label: "Several months", description: "Persistent for months" },
      { value: "ongoing", label: "This has been ongoing for a long time", description: "Chronic or recurring" },
    ],
  },
  {
    id: "impact",
    question: "How much are these feelings affecting your daily activities?",
    icon: <Activity className="w-6 h-6" />,
    options: [
      { value: "minimal", label: "Minimal impact", description: "I can manage my usual activities" },
      { value: "some", label: "Some difficulty", description: "Some activities are harder than usual" },
      { value: "significant", label: "Significant impact", description: "Many activities are affected" },
      { value: "severe", label: "Severe impact", description: "Unable to do most daily activities" },
    ],
  },
  {
    id: "episodes",
    question: "Have you experienced similar feelings before?",
    icon: <TrendingUp className="w-6 h-6" />,
    options: [
      { value: "never", label: "Never", description: "This is completely new for me" },
      { value: "rarely", label: "Rarely", description: "Maybe once or twice before" },
      { value: "sometimes", label: "Sometimes", description: "I've had episodes like this before" },
      { value: "frequently", label: "Frequently", description: "This happens regularly" },
    ],
  },
  {
    id: "severity",
    question: "On a scale of concern, how would you rate what you're experiencing?",
    icon: <Heart className="w-6 h-6" />,
    options: [
      { value: "mild", label: "Mild concern", description: "Manageable but noticeable" },
      { value: "moderate", label: "Moderate concern", description: "Definitely affecting my wellbeing" },
      { value: "high", label: "High concern", description: "Very distressing and difficult" },
      { value: "crisis", label: "Crisis level", description: "I need immediate support" },
    ],
  },
  {
    id: "support",
    question: "Do you have people you can talk to about how you're feeling?",
    icon: <Users className="w-6 h-6" />,
    options: [
      { value: "strong", label: "Yes, strong support", description: "Family/friends I can rely on" },
      { value: "some", label: "Some support", description: "A few people I can talk to" },
      { value: "limited", label: "Limited support", description: "Not many people to turn to" },
      { value: "none", label: "No support", description: "I feel quite alone" },
    ],
  },
]

const unsureQuestions = [
  {
    id: "duration",
    question: "Has this been happening for more than a few weeks?",
    options: [
      { value: "yes", label: "Yes, it's been going on for weeks or months" },
      { value: "no", label: "No, it's been just a few days or less than a week" },
    ],
  },
  {
    id: "pattern",
    question: "Do these feelings come and go, or do they feel constant?",
    options: [
      { value: "constant", label: "They feel pretty constant or persistent" },
      { value: "comeandgo", label: "They come and go, sometimes I feel better" },
    ],
  },
  {
    id: "first_time",
    question: "Is this the first time you've been experiencing something like this?",
    options: [
      { value: "no", label: "No, I've experienced similar feelings before" },
      { value: "yes", label: "Yes, this is new for me" },
    ],
  },
]

export default function ClassificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showInitialQuestion, setShowInitialQuestion] = useState(true)
  const [showUnsureQuestionnaire, setShowUnsureQuestionnaire] = useState(false)
  const [unsureAnswers, setUnsureAnswers] = useState<Record<string, string[]>>({})
  const [currentUnsureStep, setCurrentUnsureStep] = useState(0)
  const [recommendedOption, setRecommendedOption] = useState<"short-term" | "long-term" | null>(null)
  const [recommendationReason, setRecommendationReason] = useState<string>("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  useEffect(() => {
    const recommended = searchParams.get("recommended") as "short-term" | "long-term" | null
    const reason = searchParams.get("reason")
    if (recommended && reason) {
      setRecommendedOption(recommended)
      setRecommendationReason(decodeURIComponent(reason))
    }
  }, [searchParams])

  const handleInitialAnswer = (answer: "short-term" | "long-term" | "unsure") => {
    if (selectedOptions.length === 0) {
      if (answer === "short-term") {
        router.push("/short-term")
      } else if (answer === "long-term") {
        router.push("/long-term")
      } else {
        setShowInitialQuestion(false)
        setShowUnsureQuestionnaire(true)
      }
    } else {
      handleMultipleSelections()
    }
  }

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((o) => o !== option)
      } else {
        return [...prev, option]
      }
    })
  }

  const handleMultipleSelections = () => {
    if (selectedOptions.includes("short-term") && selectedOptions.includes("long-term")) {
      router.push("/long-term?multiple=true&includes=short-term")
    } else if (selectedOptions.includes("short-term")) {
      router.push("/short-term")
    } else if (selectedOptions.includes("long-term")) {
      router.push("/long-term")
    } else if (selectedOptions.includes("unsure")) {
      setShowInitialQuestion(false)
      setShowUnsureQuestionnaire(true)
    }
  }

  const handleContinueWithSelections = () => {
    if (selectedOptions.length > 0) {
      handleMultipleSelections()
    }
  }

  const handleUnsureAnswer = (questionId: string, value: string, checked: boolean) => {
    setUnsureAnswers((prev) => {
      const currentAnswers = prev[questionId] || []
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, value] }
      } else {
        return { ...prev, [questionId]: currentAnswers.filter((answer) => answer !== value) }
      }
    })
  }

  const handleUnsureNext = () => {
    if (currentUnsureStep < unsureQuestions.length - 1) {
      setCurrentUnsureStep(currentUnsureStep + 1)
    } else {
      const result = analyzeUnsureAnswers(unsureAnswers)
      const reason =
        result === "long-term"
          ? "because this has been affecting you for a while"
          : "because this seems to have started recently"

      setRecommendedOption(result)
      setRecommendationReason(reason)
      setShowUnsureQuestionnaire(false)
      setShowInitialQuestion(true)

      setUnsureAnswers({})
      setCurrentUnsureStep(0)
    }
  }

  const handleUnsureBack = () => {
    if (currentUnsureStep > 0) {
      setCurrentUnsureStep(currentUnsureStep - 1)
    } else {
      setShowUnsureQuestionnaire(false)
      setShowInitialQuestion(true)
    }
  }

  const analyzeUnsureAnswers = (answers: Record<string, string[]>): "short-term" | "long-term" => {
    let longTermScore = 0

    const durationAnswers = answers.duration || []
    if (durationAnswers.includes("yes")) longTermScore += 1

    const patternAnswers = answers.pattern || []
    if (patternAnswers.includes("constant")) longTermScore += 1

    const firstTimeAnswers = answers.first_time || []
    if (firstTimeAnswers.includes("no")) longTermScore += 1

    return longTermScore >= 2 ? "long-term" : "short-term"
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleNext = () => {
    if (currentStep < classificationQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const classification = analyzeAnswers(answers)
      router.push(classification === "short-term" ? "/short-term" : "/long-term")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setShowInitialQuestion(true)
    }
  }

  const analyzeAnswers = (answers: Record<string, string>): "short-term" | "long-term" => {
    let shortTermScore = 0
    let longTermScore = 0

    if (answers.duration === "recent") shortTermScore += 2
    else if (answers.duration === "weeks") shortTermScore += 1
    else longTermScore += 2

    if (answers.impact === "minimal" || answers.impact === "some") shortTermScore += 1
    else longTermScore += 2

    if (answers.episodes === "never" || answers.episodes === "rarely") shortTermScore += 1
    else longTermScore += 2

    if (answers.severity === "crisis") longTermScore += 3
    else if (answers.severity === "mild") shortTermScore += 1

    if (answers.support === "none" || answers.support === "limited") longTermScore += 1

    return shortTermScore > longTermScore ? "short-term" : "long-term"
  }

  const currentQuestion = classificationQuestions[currentStep]
  const progress = ((currentStep + 1) / classificationQuestions.length) * 100
  const canProceed = currentQuestion && answers[currentQuestion.id]

  const unsureProgress = ((currentUnsureStep + 1) / unsureQuestions.length) * 100
  const currentUnsureQuestion = unsureQuestions[currentUnsureStep]
  const canProceedUnsure = currentUnsureQuestion && unsureAnswers[currentUnsureQuestion.id]?.length > 0

  if (showUnsureQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">
                    Question {currentUnsureStep + 1} of {unsureQuestions.length}
                  </div>
                  <div className="font-semibold text-slate-800">Let's figure this out together</div>
                </div>
              </div>
            </div>
            <Progress value={unsureProgress} className="h-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{currentUnsureQuestion.question}</h3>
              <p className="text-sm text-slate-500 mb-6">You can select multiple options if they apply to you</p>

              <div className="space-y-3">
                {currentUnsureQuestion.options.map((option) => {
                  const isChecked = (unsureAnswers[currentUnsureQuestion.id] || []).includes(option.value)
                  return (
                    <div key={option.value} className="flex items-start space-x-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleUnsureAnswer(currentUnsureQuestion.id, option.value, checked as boolean)
                        }
                        id={option.value}
                        className="mt-1 border-emerald-300 text-emerald-600"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer p-3 rounded-lg border border-transparent hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                      >
                        <div className="font-medium text-slate-800">{option.label}</div>
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                onClick={handleUnsureBack}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                onClick={handleUnsureNext}
                disabled={!canProceedUnsure}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <span>{currentUnsureStep === unsureQuestions.length - 1 ? "Get Recommendation" : "Next"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showInitialQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800">
              Let's understand what you're going through
            </CardTitle>
            <p className="text-slate-600 mt-2">This helps us provide the most appropriate support for your situation</p>
            <p className="text-sm text-slate-500 mt-1">You can select multiple options if they apply to you</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {recommendedOption && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">We recommend</span>
                </div>
                <p className="text-emerald-700">
                  <strong>{recommendedOption === "short-term" ? "Recent/New feelings" : "Ongoing/Recurring"}</strong> –{" "}
                  {recommendationReason}
                </p>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-8">
                Is this something you've been dealing with for a while, or is it more recent?
              </h3>

              <div className="space-y-4">
                <div
                  className={`w-full p-6 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedOptions.includes("short-term")
                      ? "border-emerald-500 bg-emerald-50 shadow-md"
                      : recommendedOption === "short-term"
                        ? "border-emerald-300 bg-emerald-25"
                        : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-25"
                  }`}
                  onClick={() => handleOptionToggle("short-term")}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox checked={selectedOptions.includes("short-term")} className="mt-1" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-slate-800 text-lg">Recent or new feelings</div>
                      <div className="text-slate-600 mt-2">Something that started recently or feels temporary</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-full p-6 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedOptions.includes("long-term")
                      ? "border-emerald-500 bg-emerald-50 shadow-md"
                      : recommendedOption === "long-term"
                        ? "border-emerald-300 bg-emerald-25"
                        : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-25"
                  }`}
                  onClick={() => handleOptionToggle("long-term")}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox checked={selectedOptions.includes("long-term")} className="mt-1" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-slate-800 text-lg">Ongoing or recurring</div>
                      <div className="text-slate-600 mt-2">Something I've been dealing with for a while</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOptions.length > 0 && (
                <div className="mt-6">
                  <Button onClick={handleContinueWithSelections} className="bg-emerald-600 hover:bg-emerald-700 px-8">
                    Continue with selected options
                  </Button>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-slate-200">
                <div
                  className={`inline-flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedOptions.includes("unsure")
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => handleOptionToggle("unsure")}
                >
                  <Checkbox checked={selectedOptions.includes("unsure")} className="text-sm" />
                  <span className="text-sm">I'm not sure - help me figure it out</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => router.push("/home")}
                variant="ghost"
                className="text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                {currentQuestion.icon}
              </div>
              <div>
                <div className="text-sm text-slate-500">
                  Question {currentStep + 1} of {classificationQuestions.length}
                </div>
                <div className="font-semibold text-slate-800">Understanding your situation</div>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-6">{currentQuestion.question}</h3>

            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="mt-1 border-emerald-300 text-emerald-600"
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer p-3 rounded-lg border border-transparent hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="font-medium text-slate-800">{option.label}</div>
                    {option.description && <div className="text-sm text-slate-600 mt-1">{option.description}</div>}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6">
            <Button onClick={handleBack} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <span>{currentStep === classificationQuestions.length - 1 ? "Get Support" : "Next"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
