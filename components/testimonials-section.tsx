import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    body: "A-notes has completely transformed how I organize my studies. The rich text editor and drawing tools make it easy to create comprehensive notes.",
    author: {
      name: "Sarah Chen",
      handle: "sarahchen",
      role: "Medical Student",
      image: "/placeholder-user.jpg",
    },
  },
  {
    body: "As a software engineer, I love how I can create technical diagrams alongside my code documentation. The collaboration features are fantastic.",
    author: {
      name: "Michael Rodriguez",
      handle: "mrodriguez",
      role: "Software Engineer",
      image: "/placeholder-user.jpg",
    },
  },
  {
    body: "The file organization system is incredible. I can keep all my research papers, notes, and diagrams in one place. It's like having a personal research assistant.",
    author: {
      name: "Dr. Emily Watson",
      handle: "emilywatson",
      role: "Research Scientist",
      image: "/placeholder-user.jpg",
    },
  },
]

export function TestimonialsSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by learners worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div key={testimonialIdx} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-card p-8 text-sm leading-6 ring-1 ring-border">
                  <div className="flex gap-x-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 flex-none" fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-6 text-foreground">
                    <p>"{testimonial.body}"</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <Image
                      className="h-10 w-10 rounded-full bg-muted"
                      src={testimonial.author.image}
                      alt={testimonial.author.name}
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author.name}</div>
                      <div className="text-muted-foreground">@{testimonial.author.handle}</div>
                      <div className="text-muted-foreground">{testimonial.author.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

