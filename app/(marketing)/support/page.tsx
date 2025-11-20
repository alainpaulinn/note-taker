import { HelpCircle, MessageCircle, BookOpen, Mail, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const supportOptions = [
  {
    name: "Help Center",
    description: "Browse our comprehensive knowledge base for answers to common questions.",
    icon: BookOpen,
    href: "/help",
    action: "Browse Articles",
  },
  {
    name: "Live Chat",
    description: "Get instant help from our support team via live chat.",
    icon: MessageCircle,
    href: "/chat",
    action: "Start Chat",
  },
  {
    name: "Email Support",
    description: "Send us an email and we'll get back to you within 24 hours.",
    icon: Mail,
    href: "mailto:support@A-notes.com",
    action: "Send Email",
  },
  {
    name: "Phone Support",
    description: "Call us for urgent issues or complex technical problems.",
    icon: Phone,
    href: "tel:+1-555-0123",
    action: "Call Now",
  },
]

const faqs = [
  {
    question: "How do I get started with A-notes?",
    answer: "Simply sign up for a free account and start creating your first notebook. You can upload files, create notes, and draw diagrams right away.",
  },
  {
    question: "Can I import my existing notes?",
    answer: "Yes! You can import notes from various formats including Markdown, PDF, and plain text files.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade encryption and follow strict security protocols to protect your data.",
  },
  {
    question: "Do you offer training or onboarding?",
    answer: "Yes! We provide free onboarding sessions for Pro and Team users, plus comprehensive documentation and video tutorials.",
  },
  {
    question: "What if I need a feature that doesn't exist?",
    answer: "We love feedback! You can submit feature requests through our support portal, and we regularly implement user suggestions.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your account settings. Your data will remain accessible for 30 days after cancellation.",
  },
]

export default function SupportPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            We're here to help
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Get the support you need to make the most of A-notes. Our team is ready to help you succeed.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {supportOptions.map((option) => (
              <div key={option.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <option.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {option.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{option.description}</p>
                  <p className="mt-6">
                    <Button asChild variant="outline">
                      <Link href={option.href}>{option.action}</Link>
                    </Button>
                  </p>
                </dd>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:mt-24 lg:max-w-none">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question} className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still need help?
            </h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="mailto:support@A-notes.com">Contact Support</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

