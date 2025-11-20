import { Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const posts = [
  {
    id: 1,
    title: "The Science of Effective Note-Taking",
    excerpt: "Research-backed strategies for taking notes that actually help you learn and retain information.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "/placeholder.jpg",
    category: "Learning",
  },
  {
    id: 2,
    title: "Visual Learning: Why Diagrams Matter",
    excerpt: "How visual representations can enhance your understanding and help you communicate complex ideas.",
    author: "Michael Chen",
    date: "2024-01-10",
    readTime: "7 min read",
    image: "/placeholder.jpg",
    category: "Visual Learning",
  },
  {
    id: 3,
    title: "Building Better Study Habits",
    excerpt: "Practical tips for developing consistent study routines that actually work for your learning style.",
    author: "Emily Rodriguez",
    date: "2024-01-05",
    readTime: "6 min read",
    image: "/placeholder.jpg",
    category: "Study Tips",
  },
  {
    id: 4,
    title: "Collaborative Learning in the Digital Age",
    excerpt: "How technology is changing the way we learn together and share knowledge.",
    author: "David Kim",
    date: "2024-01-01",
    readTime: "8 min read",
    image: "/placeholder.jpg",
    category: "Collaboration",
  },
  {
    id: 5,
    title: "The Future of Note-Taking",
    excerpt: "Exploring emerging trends in note-taking technology and what they mean for learners.",
    author: "Sarah Johnson",
    date: "2023-12-28",
    readTime: "4 min read",
    image: "/placeholder.jpg",
    category: "Technology",
  },
  {
    id: 6,
    title: "Organizing Your Digital Learning Materials",
    excerpt: "Best practices for managing files, documents, and resources in your digital learning environment.",
    author: "Michael Chen",
    date: "2023-12-25",
    readTime: "6 min read",
    image: "/placeholder.jpg",
    category: "Organization",
  },
]

const categories = ["All", "Learning", "Visual Learning", "Study Tips", "Collaboration", "Technology", "Organization"]

export default function BlogPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Learning Insights & Tips
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Discover strategies, tips, and insights to enhance your learning experience with A-notes.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date} className="text-muted-foreground">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <span className="text-primary">{post.category}</span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-foreground group-hover:text-primary">
                  <Link href={`/blog/${post.id}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <img
                  src="/placeholder-user.jpg"
                  alt=""
                  className="h-10 w-10 rounded-full bg-muted"
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-foreground">
                    <Link href={`/blog/author/${post.author.toLowerCase().replace(' ', '-')}`}>
                      <span className="absolute inset-0" />
                      {post.author}
                    </Link>
                  </p>
                  <p className="text-muted-foreground">{post.readTime}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/signup">Start learning with A-notes</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

