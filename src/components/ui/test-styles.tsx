'use client'

import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'

export default function TestStyles() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          <span className="text-gradient">TAM</span> Style Test
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="card-hover border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Primary Button Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="btn-primary w-full">
                Primary Button
              </Button>
              <Button variant="outline" className="btn-secondary w-full">
                Secondary Button
              </Button>
            </CardContent>
          </Card>
          
          <Card className="card-hover border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Animation Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="animate-fade-in p-4 bg-primary/10 rounded-lg">
                Fade In Animation
              </div>
              <div className="animate-bounce-gentle p-4 bg-secondary/10 rounded-lg">
                Bounce Animation
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            If you can see styled buttons, cards, and animations, then Tailwind CSS is working correctly!
          </p>
        </div>
      </div>
    </div>
  )
} 