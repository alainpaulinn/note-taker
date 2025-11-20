"use client"

import { useEffect, useState } from "react"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        isOnline
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-amber-500/10 text-amber-400"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          Synced
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Offline mode
        </>
      )}
    </div>
  )
}
