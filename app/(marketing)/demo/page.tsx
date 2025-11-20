import { Button } from "@/components/ui/button"
import { Play, ArrowRight, BookOpen, PenTool, FileImage, BarChart3 } from "lucide-react"
import Link from "next/link"

const demoFeatures = [
  {
    name: "Rich Text Editor",
    description: "Create beautiful notes with formatting, tables, and media",
    icon: BookOpen,
  },
  {
    name: "Visual Diagrams",
    description: "Draw diagrams and flowcharts with our drawing tools",
    icon: PenTool,
  },
  {
    name: "File Management",
    description: "Upload and organize PDFs, images, and documents",
    icon: FileImage,
  },
  {
    name: "Analytics",
    description: "Track your learning progress and insights",
    icon: BarChart3,
  },
]

export default function DemoPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            See A-notes in action
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Watch our interactive demo to see how A-notes can transform your learning experience.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative aspect-video rounded-2xl bg-muted overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <Play className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Demo</h3>
                <p className="text-muted-foreground mb-6">
                  Click play to see A-notes's features in action
                </p>
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Play Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {demoFeatures.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to try it yourself?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start with our free plan and experience the power of A-notes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

