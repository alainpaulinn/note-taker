import { BookOpen, Users, Target, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const values = [
  {
    name: "Learning First",
    description: "Everything we build is designed to enhance your learning experience and help you achieve your goals.",
    icon: BookOpen,
  },
  {
    name: "Community Driven",
    description: "We listen to our users and build features based on real feedback from learners around the world.",
    icon: Users,
  },
  {
    name: "Innovation",
    description: "We're constantly exploring new ways to make note-taking and learning more effective and enjoyable.",
    icon: Target,
  },
  {
    name: "Accessibility",
    description: "Learning should be accessible to everyone. We're committed to making NoteMaster inclusive and easy to use.",
    icon: Heart,
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/placeholder-user.jpg",
    bio: "Former education researcher with 10+ years experience in learning technology.",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/placeholder-user.jpg",
    bio: "Full-stack engineer passionate about building tools that enhance human learning.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "/placeholder-user.jpg",
    bio: "UX designer focused on creating intuitive and beautiful learning experiences.",
  },
  {
    name: "David Kim",
    role: "Head of Product",
    image: "/placeholder-user.jpg",
    bio: "Product manager with expertise in educational technology and user research.",
  },
]

export default function AboutPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            About NoteMaster
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We're on a mission to revolutionize how people learn, organize knowledge, and share ideas.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name} className="flex flex-col">
                <div className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <value.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {value.name}
                </div>
                <div className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:mt-24 lg:max-w-none">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Our Story
          </h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p>
              NoteMaster was born out of frustration with existing note-taking tools. As students and professionals, 
              we found ourselves juggling multiple apps to capture different types of content - text notes, diagrams, 
              files, and more. We knew there had to be a better way.
            </p>
            <p>
              Our team came together with a shared vision: create a unified platform that combines the best of 
              traditional note-taking with modern digital tools. We wanted something that could handle everything 
              from quick text notes to complex visual diagrams, all while keeping your data secure and accessible.
            </p>
            <p>
              Today, NoteMaster serves thousands of learners worldwide, from students preparing for exams to 
              professionals managing complex projects. We're constantly evolving based on user feedback, 
              always striving to make learning more effective and enjoyable.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:mt-24 lg:max-w-none">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col">
                <div className="flex items-center gap-x-4">
                  <img
                    className="h-16 w-16 rounded-full bg-muted"
                    src={member.image}
                    alt={member.name}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/signup">Join our community</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
