# Checkout & Contact System

## Problem Statement
Users can browse the SAWEI catalogue but cannot complete purchases or contact the business. The current implementation has Stripe API routes but no user-facing checkout flow. There's also no way for B2B customers to request quotes.

## Evidence
- Stripe API route exists but no UI triggers it
- No contact form or quote request functionality
- No WhatsApp integration for quick contact
- Product pages have CTA buttons that don't work

## Proposed Solution
Implement a complete checkout flow and contact system:
1. Add-to-cart functionality with local storage persistence
2. Checkout page that connects to existing Stripe API
3. Quote request form for B2B customers
4. WhatsApp integration for quick contact
5. Success/confirmation pages

## Key Hypothesis
We believe adding a complete checkout and contact system will enable users to convert from browsers to buyers/leads. We'll know we're right when users can successfully complete a purchase or submit a quote request.

## What We're NOT Building
- User accounts/authentication (out of scope)
- Order history (out of scope)
- Admin dashboard (out of scope)
- Inventory management (out of scope)
- Email notifications (out of scope for MVP)

## Success Metrics
| Metric | Target | How Measured |
|--------|--------|--------------|
| Checkout flow complete | 100% | Can add to cart → checkout → Stripe |
| Quote form works | 100% | Form submits and shows confirmation |
| WhatsApp link works | 100% | Opens WhatsApp with pre-filled message |

## Open Questions
- [ ] What WhatsApp number to use?
- [ ] Should we collect customer email on quote form?

## Technical Scope
- 4-5 new files
- ~400-500 total new lines
- Uses existing patterns
