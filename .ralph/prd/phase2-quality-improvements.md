# PRD: Phase 2 - Quality & UX Improvements

## Context
Phase 1 completed: Cart, Checkout, Quote Form, WhatsApp.
Testing revealed several UX and quality improvements needed.

## Scope
**Budget**: Continuation of existing work
**Timeline**: Immediate implementation

---

## Features Required

### 1. Image Fallback Handler
- Images load from external URLs (img.wykji.cn)
- Need fallback for broken images
- Show placeholder when image fails to load

### 2. SEO Meta Tags
- Add proper meta descriptions per page
- Add Open Graph tags for social sharing
- Structured data for products (JSON-LD)

### 3. Contact Page
- Create dedicated contact page
- Display company info, email, phone
- Include contact form
- Show physical address/map placeholder

### 4. About Page
- Company presentation
- Services offered
- Why choose SAWEI

### 5. Footer Improvements
- Add real contact information
- Social media links placeholders
- Quick links to all pages
- Newsletter signup placeholder

### 6. Product Specifications Display
- Show technical specs if available in data
- Better organized product details
- Collapsible sections for long content

### 7. 404 Error Page Styling
- Custom styled 404 page
- Helpful navigation back to catalogue
- Search suggestion

### 8. Loading States & Skeletons
- Add loading skeletons to all dynamic content
- Smooth transitions
- Better perceived performance

---

## Technical Constraints
- Max 100 lines per new component
- Use existing shadcn/ui components
- Maintain trilingual support (FR/EN/CN)
- All changes must pass `npm run build`

---

## Priority Order
1. F-007: Image Fallback Handler (critical UX)
2. F-008: 404 Page Styling
3. F-009: Contact Page
4. F-010: About Page
5. F-011: Footer Improvements
6. F-012: SEO Meta Tags
