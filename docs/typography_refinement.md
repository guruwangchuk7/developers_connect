# Mobile Typography Refinement Log (March 2026)

## Overview
This document outlines the systematic refinement of mobile typography across the Bhutan Developer Network platform. The goal was to eliminate "loud," oversized text on small screens and replace it with a more refined, professional visual hierarchy without altering the existing desktop design.

## The Problem
Previous mobile typography used large, bold font sizes inherited from desktop-first design thinking (e.g., 30px headings on a 320px screen), which caused:
1.  **Awkward Wrapping**: Long headings (like "Where Identity Meets Collaboration") filled the entire screen height.
2.  **Unbalanced Hierarchy**: Heading sizes were too close to body text, or excessively larger than subtitles.
3.  **Heavy Visual Weight**: The design felt crowded and "unbranded" rather than minimalist and premium.

## Refined Mobile Scale (Breakpoints < 768px)

| Element | Old Mobile Size | New Mobile Size | Desktop Reference (lg:) |
| :--- | :--- | :--- | :--- |
| **Hero H1** | `text-4xl` (36px) | `text-3xl` (30px) | `text-8xl` (128px) |
| **Section H2** | `text-3xl` (30px) | `text-2xl` (24px) | `text-7xl` (72px) |
| **Subtitle / Lead** | `text-base` (16px) | `text-sm` (14px) | `text-lg` (18px) |
| **Body (Feature)** | `text-sm` (14px) | `text-[13px]` | `text-base` (16px) |
| **Meta / Small** | `text-xs` (12px) | `text-[10px]` | `text-sm` (14px) |

## Implementation Details

### 1. `features/marketing/components/hero-section.tsx`
*   Reduced H1 from `text-4xl` to `text-3xl`.
*   Softened the hero lead paragraph density by ensuring it stays consistent on small mobile.

### 2. `app/(marketing)/page.tsx`
*   Updated section titles to `text-2xl`.
*   Adjusted `FeatureCard` titles with better vertical spacing (`mb-2`).
*   Changed feature descriptions from `text-xs` (too small) to `text-[13px]` (optimal readability for density).

### 3. `features/marketing/components/how-it-works.tsx`
*   Reduced step titles to `text-lg` and descriptions to `text-[13px]`.
*   Adjusted margins to prevent excessive vertical drift on mobile.

### 4. `features/marketing/components/why-use-it.tsx`
*   Refined the benefit cards with smaller headings and body text.

### 5. `features/marketing/components/founder.tsx`
*   Reduced the "Meet the Founder" heading to `text-2xl`.
*   Optimized bio paragraph for mobile reading distance using `text-[13px]`.

### 6. `features/marketing/components/plans.tsx`
*   Balanced the pricing display. Lowered price font on mobile to `text-2xl` for better fit within cards.
*   Reduced feature item font sizes to `text-[13px]`.

### 7. `features/marketing/components/faq.tsx`
*   Uniformly applied the `text-2xl` heading scale.

### 8. `app/profile/[id]/page.tsx`
*   Balanced the user's name display (`text-3xl`) and bio lead (`text-lg`) to ensure identity cards look sleek in portrait mode.

## Future Recommendations
*   **Fluid Scaling**: Consider implementing a CSS clamp system if the layout becomes more complex.
*   **Leading Control**: Continue using `leading-relaxed` for long body text, but stick to `leading-tight` or `leading-none` for headings to maintain a premium, architectural look.
*   **Consistency Check**: Ensure any new sections follow the `text-2xl` (H2) and `text-sm/13px` (Body) mobile pattern.
