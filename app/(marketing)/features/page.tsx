import { BookOpen, PenTool, FileImage, BarChart3, Search, Share2, Lock, Zap, Smartphone, Cloud, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    name: "Rich Text Editor",
    description: "Create beautiful notes with our powerful rich text editor. Format text, add links, images, tables, and more.",
    icon: BookOpen,
    details: [
      "Bold, italic, underline formatting",
      "Headers, lists, and quotes",
      "Tables and code blocks",
      "Links and media embedding",
      "Markdown support",
    ],
  },
  {
    name: "Visual Diagrams",
    description: "Draw diagrams, flowcharts, and sketches with our integrated drawing canvas powered by Excalidraw.",
    icon: PenTool,
    details: [
      "Freehand drawing tools",
      "Shapes and connectors",
      "Text annotations",
      "Layers and grouping",
      "Export to multiple formats",
    ],
  },
  {
    name: "File Management",
    description: "Upload and organize PDFs, images, videos, and documents. Keep all your learning materials in one place.",
    icon: FileImage,
    details: [
      "PDF, image, video support",
      "Document preview",
      "File organization",
      "Search within files",
      "Version control",
    ],
  },
  {
    name: "Smart Organization",
    description: "Organize your notes into notebooks with tags, categories, and powerful search capabilities.",
    icon: Search,
    details: [
      "Notebook organization",
      "Tagging system",
      "Full-text search",
      "Smart categorization",
      "Quick filters",
    ],
  },
  {
    name: "Collaboration",
    description: "Share notebooks with team members, collaborate on notes, and work together on learning projects.",
    icon: Share2,
    details: [
      "Real-time collaboration",
      "Permission controls",
      "Comment system",
      "Version history",
      "Team workspaces",
    ],
  },
  {
    name: "Privacy & Security",
    description: "Your data is secure with enterprise-grade encryption. Control who can access your notes.",
    icon: Lock,
    details: [
      "End-to-end encryption",
      "Access controls",
      "Data privacy",
      "Secure sharing",
      "Compliance ready",
    ],
  },
  {
    name: "Analytics & Insights",
    description: "Track your learning progress with detailed analytics and insights about your study habits.",
    icon: BarChart3,
    details: [
      "Learning progress tracking",
      "Study time analytics",
      "Content insights",
      "Performance metrics",
      "Goal setting",
    ],
  },
  {
    name: "AI-Powered Features",
    description: "Get smart suggestions, auto-categorization, and intelligent search powered by AI.",
    icon: Zap,
    details: [
      "Smart suggestions",
      "Auto-categorization",
      "Intelligent search",
      "Content recommendations",
      "Learning insights",
    ],
  },
  {
    name: "Mobile Access",
    description: "Access your notes anywhere with our mobile apps for iOS and Android.",
    icon: Smartphone,
    details: [
      "iOS and Android apps",
      "Offline access",
      "Sync across devices",
      "Mobile-optimized UI",
      "Push notifications",
    ],
  },
  {
    name: "Cloud Sync",
    description: "Your notes sync automatically across all your devices with our reliable cloud infrastructure.",
    icon: Cloud,
    details: [
      "Automatic sync",
      "Cross-device access",
      "Backup and recovery",
      "Conflict resolution",
      "Reliable infrastructure",
    ],
  },
  {
    name: "Export Options",
    description: "Export your notebooks to PDF, Markdown, HTML, and other formats for sharing and backup.",
    icon: Download,
    details: [
      "PDF export",
      "Markdown support",
      "HTML export",
      "Custom formatting",
      "Batch export",
    ],
  },
  {
    name: "Team Management",
    description: "Manage team members, assign roles, and control access with our comprehensive team features.",
    icon: Users,
    details: [
      "User management",
      "Role-based access",
      "Team workspaces",
      "Admin dashboard",
      "Usage analytics",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Everything you need for effective learning
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            NoteMaster combines the best of traditional note-taking with modern digital tools to help you learn more effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <div className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </div>
                <div className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/signup">Get started with NoteMaster</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
