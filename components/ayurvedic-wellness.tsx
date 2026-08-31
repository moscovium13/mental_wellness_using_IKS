'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Leaf, Droplet, Flame, Wind } from 'lucide-react'

interface AyurvedicRemedy {
  name: string
  ingredients: string[]
  benefits: string[]
  preparation: string
  when: string
}

interface Ritual {
  name: string
  description: string
  steps: string[]
  duration: string
  frequency: string
}

const seasonalRecommendations = {
  spring: {
    dosha: 'kapha',
    recommendations: [
      'Increase physical activity to balance heaviness',
      'Eat light, warm foods',
      'Practice stimulating breathing exercises',
      'Use warming spices like ginger and black pepper',
      'Wake early and establish energizing routine',
    ],
    foods: ['asparagus', 'leafy greens', 'legumes', 'honey', 'warming spices'],
  },
  summer: {
    dosha: 'pitta',
    recommendations: [
      'Stay cool with cooling foods and practices',
      'Avoid excessive heat and sun exposure',
      'Practice cooling breathing (Sitali)',
      'Eat sweet, cooling fruits',
      'Stay hydrated with cool drinks',
    ],
    foods: ['cucumber', 'coconut', 'melons', 'cooling herbs', 'milk products'],
  },
  fall: {
    dosha: 'vata',
    recommendations: [
      'Warm body and mind regularly',
      'Eat warm, nourishing, oily foods',
      'Maintain consistent routine',
      'Practice grounding meditation',
      'Get adequate rest',
    ],
    foods: ['sesame oil', 'root vegetables', 'warm grains', 'ghee', 'nuts'],
  },
  winter: {
    dosha: 'vata',
    recommendations: [
      'Stay warm with warming foods',
      'Use oils and nourishing substances',
      'Maintain warm environment',
      'Practice calming exercises',
      'Sleep adequately',
    ],
    foods: ['warming spices', 'nuts', 'oils', 'root vegetables', 'grains'],
  },
}

const homeRemedies: AyurvedicRemedy[] = [
  {
    name: 'Golden Milk (Turmeric Latte)',
    ingredients: ['1 tsp turmeric powder', '1 cup milk', '1/4 tsp black pepper', '1 tsp honey', 'pinch of cinnamon'],
    benefits: ['Anti-inflammatory', 'Immune support', 'Better sleep', 'Joint health'],
    preparation: 'Warm milk, add turmeric and pepper, stir well, add honey and cinnamon. Drink warm.',
    when: 'Evening before bed',
  },
  {
    name: 'Ginger-Lemon Tea',
    ingredients: ['1-inch fresh ginger', '1 lemon', '1 cup hot water', '1 tsp honey', 'pinch salt'],
    benefits: ['Digestive aid', 'Energy boost', 'Cold relief', 'Metabolism support'],
    preparation: 'Grate ginger into hot water, steep 5 mins, add lemon juice and honey. Drink warm.',
    when: 'Morning on empty stomach',
  },
  {
    name: 'Digestive Churna',
    ingredients: ['1 tsp cumin seeds', '1 tsp coriander seeds', '1 tsp fennel seeds', '1/2 tsp black pepper', 'salt to taste'],
    benefits: ['Improved digestion', 'Reduces bloating', 'Better nutrient absorption', 'Gas relief'],
    preparation: 'Toast seeds, grind to powder. Add to warm water or sprinkle on food.',
    when: 'Before meals',
  },
  {
    name: 'Brahmi-Ashwagandha Drink',
    ingredients: ['1 tsp brahmi powder', '1/2 tsp ashwagandha', '1 cup warm water', '1 tsp honey'],
    benefits: ['Stress relief', 'Better memory', 'Mental clarity', 'Sleep quality'],
    preparation: 'Mix powders with warm water, stir well, add honey. Drink slowly.',
    when: 'Evening or bedtime',
  },
  {
    name: 'Neem Water',
    ingredients: ['10 neem leaves', '2 cups water'],
    benefits: ['Blood purification', 'Immune boost', 'Skin health', 'Toxin removal'],
    preparation: 'Boil water with neem leaves for 5 mins. Strain and drink warm.',
    when: 'Morning',
  },
]

const morningRituals: Ritual[] = [
  {
    name: 'Tongue Scraping (Jivha Nirlekhana)',
    description: 'Remove toxins and stimulate digestion from the first thing in the morning',
    steps: [
      'Use a copper or stainless steel tongue scraper',
      'Gently scrape from back to front 7-10 times',
      'Rinse mouth with warm water',
      'This stimulates digestion and oral health',
    ],
    duration: '2 minutes',
    frequency: 'Daily, first thing in morning',
  },
  {
    name: 'Oil Massage (Abhyanga)',
    description: 'Nourish skin and balance doshas with self-massage',
    steps: [
      'Warm sesame oil (vata), coconut oil (pitta), or mustard oil (kapha)',
      'Apply warm oil to entire body',
      'Massage in circular motions',
      'Leave on for 10-20 minutes',
      'Take warm shower',
    ],
    duration: '30 minutes',
    frequency: '2-3 times weekly',
  },
  {
    name: 'Water Drinking Practice',
    description: 'Cleanse and hydrate the body with mindful water consumption',
    steps: [
      'Boil water the previous evening and let cool',
      'Drink warm water upon waking',
      'Add lemon or ginger for added benefit',
      'This kindles digestive fire and detoxifies',
    ],
    duration: '5 minutes',
    frequency: 'Daily morning',
  },
]

const eveningRituals: Ritual[] = [
  {
    name: 'Nasya (Nasal Oil)',
    description: 'Purify and calm the mind through nasal therapy',
    steps: [
      'Warm sesame oil slightly',
      'Use dropper to apply 2-3 drops in each nostril',
      'Lie back and let oil absorb',
      'Clear nostrils gently after a minute',
    ],
    duration: '5 minutes',
    frequency: '2-3 times weekly',
  },
  {
    name: 'Warm Bath Ritual',
    description: 'Relax body and prepare for sleep',
    steps: [
      'Fill tub with warm water',
      'Add sesame oil or essential oils',
      'Soak for 15-20 minutes',
      'Visualize stress washing away',
    ],
    duration: '30 minutes',
    frequency: 'Daily or 3-4 times weekly',
  },
  {
    name: 'Evening Meditation',
    description: 'Calm the mind before sleep',
    steps: [
      'Sit quietly in dimmed light',
      'Practice deep breathing for 5 minutes',
      'Meditation or silent contemplation',
      'Set intention for restful sleep',
    ],
    duration: '15-20 minutes',
    frequency: 'Daily',
  },
]

export default function AyurvedicWellness() {
  const [selectedSeason, setSelectedSeason] = useState<keyof typeof seasonalRecommendations>('spring')
  const season = seasonalRecommendations[selectedSeason]

  return (
    <div className="space-y-8">
      {/* Seasonal Guide */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Seasonal Wellness Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          {/* Season Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(Object.keys(seasonalRecommendations) as Array<keyof typeof seasonalRecommendations>).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
                className={`p-3 rounded-lg font-semibold transition-all capitalize ${
                  selectedSeason === s
                    ? 'bg-primary text-white'
                    : 'bg-border text-foreground hover:bg-border/80'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Current Season Info */}
          <div className="space-y-4 p-6 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="w-5 h-5 text-primary" />
              <p className="font-semibold text-foreground capitalize">
                Dominant Dosha in {selectedSeason}: {season.dosha}
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Recommendations:</p>
              <ul className="space-y-2">
                {season.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-primary/20">
              <p className="font-semibold text-foreground mb-2">Recommended Foods:</p>
              <div className="flex flex-wrap gap-2">
                {season.foods.map((food, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium border border-accent/30"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Home Remedies */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-primary" />
            Ayurvedic Home Remedies
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          {homeRemedies.map((remedy, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-border/50 bg-muted/30 space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-foreground mb-2">{remedy.name}</h4>
                <p className="text-sm text-foreground/70">{remedy.when}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Ingredients:</p>
                  <ul className="space-y-1">
                    {remedy.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-foreground/70">• {ing}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-foreground text-sm mb-2">Benefits:</p>
                  <ul className="space-y-1">
                    {remedy.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-foreground/70">• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-primary/10 rounded border border-primary/30">
                <p className="font-semibold text-foreground text-sm mb-2">Preparation:</p>
                <p className="text-sm text-foreground/80">{remedy.preparation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Daily Rituals */}
      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="morning">Morning Rituals</TabsTrigger>
          <TabsTrigger value="evening">Evening Rituals</TabsTrigger>
        </TabsList>

        <TabsContent value="morning" className="space-y-6">
          <Card className="card-premium">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
              <CardTitle>Morning Ayurvedic Practices</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              {morningRituals.map((ritual, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-border/50 space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg text-foreground">{ritual.name}</h4>
                    <p className="text-sm text-foreground/70 mt-1">{ritual.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Duration:</p>
                      <p className="text-foreground/70">{ritual.duration}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Frequency:</p>
                      <p className="text-foreground/70">{ritual.frequency}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-2 text-sm">Steps:</p>
                    <ol className="space-y-2">
                      {ritual.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="font-bold text-primary min-w-fit">{i + 1}.</span>
                          <span className="text-foreground/80">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evening" className="space-y-6">
          <Card className="card-premium">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
              <CardTitle>Evening Ayurvedic Practices</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              {eveningRituals.map((ritual, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-border/50 space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg text-foreground">{ritual.name}</h4>
                    <p className="text-sm text-foreground/70 mt-1">{ritual.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Duration:</p>
                      <p className="text-foreground/70">{ritual.duration}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Frequency:</p>
                      <p className="text-foreground/70">{ritual.frequency}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-2 text-sm">Steps:</p>
                    <ol className="space-y-2">
                      {ritual.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="font-bold text-primary min-w-fit">{i + 1}.</span>
                          <span className="text-foreground/80">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
