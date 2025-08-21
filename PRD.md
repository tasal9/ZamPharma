# ZamPharm - Pharmacy Management System

A comprehensive pharmacy management system designed for healthcare businesses in Afghanistan, providing complete inventory, sales, and customer management capabilities.

**Experience Qualities**: 
1. Professional - Clean, medical-grade interface that instills confidence and trust
2. Efficient - Streamlined workflows that minimize clicks and maximize productivity
3. Reliable - Stable, consistent interface that works under pressure during busy periods

**Complexity Level**: Complex Application (advanced functionality, accounts)
This is a full-featured business management system with multiple user roles, comprehensive inventory tracking, POS functionality, reporting, and multi-branch support.

## Essential Features

### Dashboard Overview
- Functionality: Real-time KPI display, sales metrics, stock alerts, and system notifications
- Purpose: Provides instant business health visibility and actionable insights
- Trigger: System startup and periodic refresh
- Progression: Login → Dashboard → View metrics → Click alerts → Navigate to relevant sections
- Success criteria: All KPIs load within 2 seconds, alerts are actionable and current

### Point of Sale (POS)
- Functionality: Barcode scanning, product search, cart management, payment processing, receipt printing
- Purpose: Fast, accurate transaction processing with proper inventory deduction
- Trigger: Customer purchase or prescription fulfillment
- Progression: Scan/search product → Add to cart → Review items → Process payment → Print receipt
- Success criteria: Complete transaction in under 60 seconds, accurate inventory updates

### Inventory Management
- Functionality: Stock tracking, batch management, expiry monitoring, automated reorder alerts
- Purpose: Prevent stockouts, minimize waste from expired products, maintain optimal inventory levels
- Trigger: Stock movements, scheduled checks, manual adjustments
- Progression: View stock levels → Identify issues → Take corrective action → Update records
- Success criteria: Zero stockouts of critical items, <2% expired inventory waste

### Product Catalog
- Functionality: Product creation, editing, categorization, pricing, supplier linking
- Purpose: Maintain accurate product database with all necessary regulatory and business information
- Trigger: New product arrival, price changes, supplier updates
- Progression: Add product → Enter details → Set pricing → Link suppliers → Save
- Success criteria: Complete product information, accurate pricing, proper categorization

### Supplier Management
- Functionality: Supplier profiles, contact management, payment tracking, performance monitoring
- Purpose: Maintain strong supplier relationships and ensure reliable product supply
- Trigger: New supplier onboarding, relationship updates, payment processing
- Progression: Add supplier → Enter details → Set terms → Track performance → Manage payments
- Success criteria: Complete supplier database, timely payments, performance tracking

### Sales & Reporting
- Functionality: Sales analysis, profit tracking, tax reporting, inventory valuation
- Purpose: Provide business insights for decision making and regulatory compliance
- Trigger: Scheduled reports, ad-hoc analysis, tax filing requirements
- Progression: Select report → Set parameters → Generate → Review → Export/print
- Success criteria: Accurate financial data, compliance with local tax requirements

### User Management & Security
- Functionality: Role-based access control, audit logging, session management
- Purpose: Ensure data security and operational accountability
- Trigger: User login, sensitive operations, system access
- Progression: Login → Verify permissions → Access features → Log actions → Secure logout
- Success criteria: No unauthorized access, complete audit trail, role-appropriate access

## Edge Case Handling
- **Network outages**: Offline mode for POS with sync when connection restored
- **Power failures**: Auto-save functionality and transaction recovery
- **Invalid barcodes**: Manual product search and error handling
- **Expired products**: Prevention of sale with clear warnings
- **Insufficient stock**: Real-time availability checks and substitution suggestions
- **Payment failures**: Multiple payment method support and retry mechanisms
- **User errors**: Undo functionality and confirmation dialogs for destructive actions

## Design Direction
The design should feel professional and medical-grade, evoking trust and competence similar to established healthcare software. Clean, minimal interface that prioritizes functionality over decoration, with careful attention to data density and readability.

## Color Selection
Triadic color scheme using medical/healthcare appropriate colors that convey trust, cleanliness, and professionalism.

- **Primary Color**: Medical Blue (oklch(0.55 0.15 240)) - Conveys trust, professionalism, and medical expertise
- **Secondary Colors**: Clean White (oklch(1 0 0)) for backgrounds, Soft Gray (oklch(0.95 0 0)) for cards and panels
- **Accent Color**: Success Green (oklch(0.65 0.15 140)) for positive actions, confirmations, and healthy metrics
- **Foreground/Background Pairings**: 
  - Background White (oklch(1 0 0)): Dark Gray text (oklch(0.2 0 0)) - Ratio 16.75:1 ✓
  - Card Gray (oklch(0.95 0 0)): Dark Gray text (oklch(0.2 0 0)) - Ratio 15.8:1 ✓
  - Primary Blue (oklch(0.55 0.15 240)): White text (oklch(1 0 0)) - Ratio 7.2:1 ✓
  - Accent Green (oklch(0.65 0.15 140)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓

## Font Selection
Typography should convey clarity and precision, essential for medical environments where accuracy is critical. Use Inter or system fonts that ensure excellent readability at all sizes.

- **Typographic Hierarchy**: 
  - H1 (Section Titles): Inter Semibold/24px/tight letter spacing
  - H2 (Card Titles): Inter Medium/18px/normal letter spacing  
  - H3 (Subsections): Inter Medium/16px/normal letter spacing
  - Body (Content): Inter Regular/14px/relaxed line height
  - Small (Labels): Inter Medium/12px/tight letter spacing
  - Micro (Metadata): Inter Regular/11px/normal letter spacing

## Animations
Subtle, purposeful animations that enhance workflow efficiency without creating distraction in a professional medical environment.

- **Purposeful Meaning**: Smooth transitions communicate system responsiveness and guide user attention to important changes or confirmations
- **Hierarchy of Movement**: Page transitions and critical alerts receive priority animation treatment, while secondary actions use minimal motion

## Component Selection
- **Components**: Heavy use of shadcn Table, Card, Dialog, Sheet for data management; Button variants for different action priorities; Badge for status indicators; Progress for stock levels; Tabs for organized data views
- **Customizations**: Medical-themed icons from Phosphor, custom data table with sorting and filtering, specialized POS cart component
- **States**: Clear hover, active, and disabled states for all interactive elements; loading states for data operations; error states with constructive messaging
- **Icon Selection**: Medical and business-appropriate icons that are immediately recognizable (Pills, Stethoscope, Receipt, Package, etc.)
- **Spacing**: Consistent 4px grid system using Tailwind's spacing scale, generous padding for touch targets
- **Mobile**: Responsive breakpoints with drawer navigation for mobile, simplified views for smaller screens, touch-optimized POS interface