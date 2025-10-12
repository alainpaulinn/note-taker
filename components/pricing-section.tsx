import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Free",
    id: "free",
    href: "/signup",
    priceMonthly: "$0",
    description: "Perfect for getting started with note-taking",
    features: [
      "Up to 5 notebooks",
      "Unlimited pages per notebook",
      "Basic rich text editor",
      "File uploads (up to 100MB)",
      "Basic drawing tools",
      "Mobile app access",
    ],
    notIncluded: [
      "Advanced collaboration",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "pro",
    href: "/signup?plan=pro",
    priceMonthly: "$9",
    description: "For serious learners and professionals",
    features: [
      "Unlimited notebooks",
      "Unlimited pages",
      "Advanced rich text editor",
      "File uploads (up to 1GB)",
      "Advanced drawing tools",
      "Collaboration features",
      "Priority support",
      "Advanced analytics",
      "Export to multiple formats",
    ],
    notIncluded: [
      "Custom integrations",
      "White-label options",
    ],
    mostPopular: true,
  },
  {
    name: "Team",
    id: "team",
    href: "/signup?plan=team",
    priceMonthly: "$19",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Admin dashboard",
      "Custom integrations",
      "Advanced security",
      "Dedicated support",
      "Custom branding",
      "API access",
    ],
    notIncluded: [],
    mostPopular: false,
  },
]

export function PricingSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
          Start free and upgrade as you grow. All plans include our core note-taking features.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 ${
                tier.mostPopular
                  ? "ring-2 ring-primary bg-primary/5"
                  : "ring-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={`text-lg font-semibold leading-8 ${
                    tier.mostPopular ? "text-primary" : "text-foreground"
                  }`}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold leading-5 text-primary-foreground">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {tier.priceMonthly}
                </span>
                <span className="text-sm font-semibold leading-6 text-muted-foreground">
                  /month
                </span>
              </p>
              <Button
                asChild
                className={`mt-6 w-full ${
                  tier.mostPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }`}
                variant={tier.mostPopular ? "default" : "outline"}
              >
                <Link href={tier.href} aria-describedby={tier.id}>
                  Get started
                </Link>
              </Button>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
                {tier.notIncluded.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <X className="h-6 w-5 flex-none text-muted-foreground" aria-hidden="true" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
