import Link from "next/link"
import { BookOpen, Github, Twitter, Linkedin, Mail } from "lucide-react"

const navigation = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Demo", href: "/demo" },
    { name: "API", href: "/api" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Help Center", href: "/support" },
    { name: "Community", href: "/community" },
    { name: "Changelog", href: "/changelog" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Cookies", href: "/cookies" },
  ],
  social: [
    {
      name: "Twitter",
      href: "#",
      icon: Twitter,
    },
    {
      name: "GitHub",
      href: "#",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:hello@notemaster.com",
      icon: Mail,
    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.social.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-primary"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold">
              <span className="text-foreground">Note</span>
              <span className="text-blue-600 dark:text-blue-400">Master</span>
            </div>
          </div>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; 2024 NoteMaster, Inc. All rights reserved.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Product</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Company</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Resources</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Legal</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
