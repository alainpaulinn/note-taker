import { BookOpen, PenTool, FileImage, BarChart3, Search, Share2, Lock, Zap } from "lucide-react"

const features = [
  {
    name: "Rich Text Editor",
    description: "Create beautiful notes with our powerful rich text editor. Format text, add links, images, tables, and more.",
    icon: BookOpen,
  },
  {
    name: "Visual Diagrams",
    description: "Draw diagrams, flowcharts, and sketches with our integrated drawing canvas powered by Excalidraw.",
    icon: PenTool,
  },
  {
    name: "File Management",
    description: "Upload and organize PDFs, images, videos, and documents. Keep all your learning materials in one place.",
    icon: FileImage,
  },
  {
    name: "Smart Organization",
    description: "Organize your notes into notebooks with tags, categories, and powerful search capabilities.",
    icon: Search,
  },
  {
    name: "Collaboration",
    description: "Share notebooks with team members, collaborate on notes, and work together on learning projects.",
    icon: Share2,
  },
  {
    name: "Privacy & Security",
    description: "Your data is secure with enterprise-grade encryption. Control who can access your notes.",
    icon: Lock,
  },
  {
    name: "Analytics & Insights",
    description: "Track your learning progress with detailed analytics and insights about your study habits.",
    icon: BarChart3,
  },
  {
    name: "AI-Powered Features",
    description: "Get smart suggestions, auto-categorization, and intelligent search powered by AI.",
    icon: Zap,
  },
]

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powerful features for effective learning
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A-notes combines the best of traditional note-taking with modern digital tools to help you learn more effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
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
          </dl>
        </div>
      </div>
    </div>
  )
}

