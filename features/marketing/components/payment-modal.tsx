"use client"

import * as React from "react"
import { X, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  price: string
}

export function PaymentModal({ isOpen, onClose, planName, price }: PaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate sending (In a real app, we would insert into Supabase here)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border shadow-2xl rounded-sm p-6 md:p-8 animate-in zoom-in-95 fade-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Send className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Request Sent!</h3>
              <p className="text-sm text-muted-foreground">Guru will contact you via email shortly with payment details.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tighter">Request To Pay</h3>
              <p className="text-sm text-muted-foreground">
                You are requesting the <span className="font-bold text-foreground">{planName}</span> plan ({price}).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Guru Wangchuk"
                  className="w-full bg-secondary/30 border border-border/50 rounded-sm px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="your@email.com"
                  className="w-full bg-secondary/30 border border-border/50 rounded-sm px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message (Optional)</label>
                <textarea 
                  placeholder="I'd like to pay via mBoB..."
                  className="w-full bg-secondary/30 border border-border/50 rounded-sm p-4 text-sm focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  buttonVariants({ size: "lg" }), 
                  "w-full h-12 rounded-sm bg-primary text-background font-bold tracking-widest uppercase text-xs mt-2 disabled:opacity-50"
                )}
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
