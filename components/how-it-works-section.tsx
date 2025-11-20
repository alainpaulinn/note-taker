import { BookOpen, PenTool, FileImage, BarChart3 } from "lucide-react"

const steps = [
  {
    name: "Create Notebooks",
    description: "Start by creating organized notebooks for different subjects, projects, or topics.",
    icon: BookOpen,
  },
  {
    name: "Add Content",
    description: "Add rich text notes, upload files, create diagrams, and organize your learning materials.",
    icon: PenTool,
  },
  {
    name: "Organize & Search",
    description: "Use tags, categories, and powerful search to quickly find what you need.",
    icon: FileImage,
  },
  {
    name: "Track Progress",
    description: "Monitor your learning progress with analytics and insights about your study habits.",
    icon: BarChart3,
  },
]

export function HowItWorksSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">How it works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get started in minutes
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A-notes is designed to be intuitive and powerful. Here's how you can start organizing your learning today.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4">
            {steps.map((step, stepIdx) => (
              <div key={step.name} className="relative">
                <div className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-semibold leading-6 text-foreground">
                    Step {stepIdx + 1}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold leading-7 text-foreground">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

