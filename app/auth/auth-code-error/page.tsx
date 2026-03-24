"use client"

import * as React from "react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
             <AlertCircle className="h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tighter">Authentication Error</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            We couldn&apos;t complete your sign-in. This usually happens if the link expired 
            or if Google authentication is not correctly configured.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/join" 
            className="inline-flex items-center gap-2 px-6 h-11 bg-primary text-background rounded-sm font-bold tracking-tight text-xs hover:opacity-90 transition shadow-lg shadow-black/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Try again
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] font-bold">
          Bhutan Developer Network Support
        </p>
      </div>
    </div>
  )
}
