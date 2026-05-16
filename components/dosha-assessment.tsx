'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Radio } from '@/components/ui/radio'
import { Flame, Wind, Droplet, RefreshCw } from 'lucide-react'

interface DoshaResult {
  dosha: 'vata' | 'pitta' | 'kapha'
  score: number
  characteristics: string[]
  recommendations: string[]
  foods: string[]
  practices: string[]
}

const doshaQuestions = [
  {
    category: 'Body Frame',
    question: 'How would you describe your body frame?',
    options: [
      { text: 'Thin, lean, prominent bones', dosha: 'vata' },
      { text: 'Medium, athletic, well-proportioned', dosha: 'pitta' },
      { text: 'Sturdy, strong, tends to gain weight easily', dosha: 'kapha' },
    ],
  },
  {
    category: 'Appetite',
    question: 'How is your appetite?',
    options: [
      { text: 'Variable, eat irregularly', dosha: 'vata' },
      { text: 'Strong, feel hungry quickly', dosha: 'pitta' },
      { text: 'Mild and steady, don\'t feel hungry often', dosha: 'kapha' },
    ],
  },
  {
    category: 'Skin',
    question: 'What is your skin type?',
    options: [
      { text: 'Dry, thin, tends to crack', dosha: 'vata' },
      { text: 'Warm, oily, prone to acne', dosha: 'pitta' },
      { text: 'Thick, cool, smooth and pale', dosha: 'kapha' },
    ],
  },
  {
    category: 'Sleep',
    question: 'How is your sleep pattern?',
    options: [
      { text: 'Light, easily disturbed, variable', dosha: 'vata' },
      { text: 'Moderate, need 6-7 hours', dosha: 'pitta' },
      { text: 'Deep, need 8+ hours, wake slowly', dosha: 'kapha' },
    ],
  },
  {
    category: 'Digestion',
    question: 'How is your digestion?',
    options: [
      { text: 'Irregular, prone to bloating', dosha: 'vata' },
      { text: 'Strong, regular, sometimes loose', dosha: 'pitta' },
      { text: 'Slow, heavy, may have congestion', dosha: 'kapha' },
    ],
  },
  {
    category: 'Temperature',
    question: 'How do you respond to temperature?',
    options: [
      { text: 'Get cold easily, prefer warm', dosha: 'vata' },
      { text: 'Get hot easily, prefer cool', dosha: 'pitta' },
      { text: 'Comfortable in most temperatures', dosha: 'kapha' },
    ],
  },
  {
    category: 'Emotions',
    question: 'What emotion dominates you?',
    options: [
      { text: 'Anxiety, fear, nervousness', dosha: 'vata' },
      { text: 'Anger, intensity, determination', dosha: 'pitta' },
      { text: 'Calm, attachment, lethargy', dosha: 'kapha' },
    ],
  },
  {
    category: 'Energy',
    question: 'What is your energy pattern?',
    options: [
      { text: 'Quick, creative, changeable', dosha: 'vata' },
      { text: 'Focused, driven, competitive', dosha: 'pitta' },
      { text: 'Steady, enduring, grounded', dosha: 'kapha' },
    ],
  },
]

const doshaInfo: Record<string, DoshaResult> = {
  vata: {
    dosha: 'vata',
    score: 0,
    characteristics: [
      'Dry, thin body with pronounced joints',
      'Cold to touch, naturally thin',
      'Quick, creative, imaginative mind',
      'Variable appetite and digestion',
      'Prone to anxiety and restlessness',
      'Light, easily interrupted sleep',
    ],
    recommendations: [
      'Maintain warm body temperature',
      'Eat warm, nourishing foods regularly',
      'Establish consistent daily routine',
      'Practice calming meditation and yoga',
      'Get adequate rest and sleep',
      'Practice grounding exercises',
    ],
    foods: [
      'Warm cooked grains (rice, wheat)',
      'Warm soups and stews',
      'Sesame oil, ghee',
      'Root vegetables (carrot, beet)',
      'Warming spices (ginger, cinnamon)',
      'Warm milk with spices',
    ],
    practices: [
      'Vinyasa yoga with grounding poses',
      'Nadi Shodhana (alternate nostril breathing)',
      'Abhyanga (self-oil massage)',
      'Meditation with focus on breath',
      'Regular eating schedule',
      'Early bedtime routine',
    ],
  },
  pitta: {
    dosha: 'pitta',
    score: 0,
    characteristics: [
      'Medium, muscular, athletic build',
      'Warm body, early greying or baldness',
      'Sharp intellect, good focus',
      'Strong appetite and metabolism',
      'Prone to irritability and anger',
      'Moderate sleep needs',
    ],
    recommendations: [
      'Keep body cool with cooling practices',
      'Eat cooling foods and drinks',
      'Manage competitiveness and perfectionism',
      'Practice cooling breathing exercises',
      'Balance activity with relaxation',
      'Cultivate patience and compassion',
    ],
    foods: [
      'Cooling grains (barley, rice)',
      'Cool vegetables (cucumber, zucchini)',
      'Coconut oil',
      'Fresh fruits and berries',
      'Cooling spices (coriander, fennel)',
      'Cool herbal teas',
    ],
    practices: [
      'Yin yoga with cooling poses',
      'Sitali pranayama (cooling breath)',
      'Meditation on compassion',
      'Swimming and water activities',
      'Evening walks in nature',
      'Mindfulness of reactions',
    ],
  },
  kapha: {
    dosha: 'kapha',
    score: 0,
    characteristics: [
      'Strong, sturdy, well-built frame',
      'Cool, smooth, oily skin',
      'Calm, stable, nurturing personality',
      'Mild appetite, slow digestion',
      'Prone to heaviness and sluggishness',
      'Deep, long sleep',
    ],
    recommendations: [
      'Stimulate digestion with warm spices',
      'Increase physical activity and movement',
      'Eat lighter, warm foods',
      'Practice energizing breathing',
      'Create new routines and experiences',
      'Stimulate mind and senses',
    ],
    foods: [
      'Light grains (millet, quinoa)',
      'Warming vegetables (onion, garlic)',
      'Minimal oils, light preparations',
      'Legumes and beans',
      'Stimulating spices (black pepper, ginger)',
      'Herbal teas',
    ],
    practices: [
      'Active vinyasa and flow yoga',
      'Bhastrika pranayama (energizing breath)',
      'Dynamic meditation',
      'Running and high-intensity activities',
      'Dry massage (garshana)',
      'Morning routines and early rising',
    ],
  },
}

export default function DoshaAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<('vata' | 'pitta' | 'kapha')[]>([])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<DoshaResult | null>(null)

  const handleAnswer = (dosha: 'vata' | 'pitta' | 'kapha') => {
    const newAnswers = [...answers, dosha]
    setAnswers(newAnswers)

    if (newAnswers.length === doshaQuestions.length) {
      calculateDosha(newAnswers)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const calculateDosha = (answers: ('vata' | 'pitta' | 'kapha')[]) => {
    const counts = { vata: 0, pitta: 0, kapha: 0 }
    answers.forEach((dosha) => {
      counts[dosha]++
    })

    const dominantDosha = Object.keys(counts).reduce((a, b) =>
      counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b
    ) as 'vata' | 'pitta' | 'kapha'

    const doshaResult = {
      ...doshaInfo[dominantDosha],
      dosha: dominantDosha,
      score: Math.round((counts[dominantDosha] / answers.length) * 100),
    }

    setResult(doshaResult)
    setShowResult(true)
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setResult(null)
  }

  if (showResult && result) {
    const doshaIcons = {
      vata: <Wind className="w-12 h-12 text-blue-500" />,
      pitta: <Flame className="w-12 h-12 text-red-500" />,
      kapha: <Droplet className="w-12 h-12 text-green-500" />,
    }

    const doshaColors = {
      vata: 'from-blue-100 to-cyan-100',
      pitta: 'from-red-100 to-orange-100',
      kapha: 'from-green-100 to-emerald-100',
    }

    return (
      <div className="space-y-8 animate-fadeInUp">
        {/* Result Card */}
        <Card className={`card-premium bg-gradient-to-br ${doshaColors[result.dosha]} border-2`}>
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">{doshaIcons[result.dosha]}</div>
            <div>
              <h2 className="text-4xl font-bold capitalize text-gradient mb-2">{result.dosha}</h2>
              <p className="text-lg font-semibold text-foreground/80">Your Predominant Dosha</p>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold text-gradient">{result.score}%</div>
            <p className="text-foreground/70 mt-2">of your constitution</p>
          </CardContent>
        </Card>

        {/* Characteristics */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Your Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.characteristics.map((char, idx) => (
                <div key={idx} className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm text-foreground">{char}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Wellness Recommendations for Your Dosha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-semibold text-sm">
                  {idx + 1}
                </div>
                <p className="text-foreground">{rec}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Foods */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Recommended Foods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.foods.map((food, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium border border-accent/30"
                >
                  {food}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Practices */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Daily Practices</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.practices.map((practice, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-foreground font-medium">{practice}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleReset} className="w-full btn-primary h-12 rounded-lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-foreground">
            Question {currentQuestion + 1} of {doshaQuestions.length}
          </h3>
          <span className="text-sm text-foreground/60">{Math.round(((currentQuestion + 1) / doshaQuestions.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / doshaQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <span className="text-sm font-semibold text-primary">{doshaQuestions[currentQuestion].category}</span>
          <CardTitle className="text-2xl mt-2">{doshaQuestions[currentQuestion].question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-4">
          {doshaQuestions[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.dosha)}
              className="w-full p-4 text-left rounded-lg border-2 border-border transition-all hover:border-primary hover:bg-primary/5"
            >
              <p className="font-medium text-foreground">{option.text}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Info Text */}
      <p className="text-sm text-foreground/60 text-center">
        Answer honestly to get your accurate dosha constitution. This will help personalize your wellness journey.
      </p>
    </div>
  )
}
