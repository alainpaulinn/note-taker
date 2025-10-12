"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface UserGreetingProps {
  user: {
    name: string
    email: string
    image: string
    initials: string
    lastLogin: string
    notebookCount: number
  }
}

export function UserGreeting({ user }: UserGreetingProps) {
  return (
    <div className="pt-20 pb-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Last active {user.lastLogin} • {user.notebookCount} notebooks
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href="/app">
                  Continue Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
