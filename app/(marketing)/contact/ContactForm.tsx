"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { analytics } from "@/lib/analytics";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real scenario, you'd handle form submission here
    analytics.trackContactEnquiry();
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
        <input 
          type="text" 
          placeholder="Ugyen Dorji"
          className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
        />
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
        <input 
          type="email" 
          placeholder="ugyen@example.bt"
          className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
        />
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject</label>
        <select 
          className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight appearance-none cursor-pointer"
        >
          <option>General Inquiry</option>
          <option>Partnership Request</option>
          <option>Technical Issue</option>
          <option>Other</option>
        </select>
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message</label>
        <textarea 
          rows={4}
          placeholder="How can we help you today?"
          className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight resize-none"
        ></textarea>
      </div>
      <button 
        type="submit"
        disabled
        className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-sm uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        Send Message <Send className="h-4 w-4" />
      </button>
      <p className="text-[10px] text-muted-foreground/60 text-center uppercase tracking-widest">
         Submissions are currently in preview mode.
      </p>
    </form>
  );
}
