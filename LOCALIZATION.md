# Localization Implementation for ZamPharm

## Features Added

### 1. Multi-language Support
- **English** - Default language for international compatibility
- **Dari (Persian)** - فارسی - Primary local language  
- **Pashto** - پښتو - Secondary local language

### 2. RTL Layout Support
- Automatic direction switching for Pashto/Dari
- Manual direction override in settings
- CSS rules for proper RTL text alignment
- Icon and layout adjustments for RTL

### 3. Dual-Language Receipts
Three invoice language modes:
- **English Only** - For international compliance
- **Local Language Only** - Dari or Pashto only
- **Dual Language** - English + local language side by side

Perfect for regulatory compliance where authorities may require English receipts while customers prefer local languages.

### 4. Translation Coverage
All user-facing text has been translated including:
- Navigation menu
- Dashboard metrics
- POS interface
- Product management
- Inventory audit system
- Settings panels
- Alerts and notifications
- Receipt templates

### 5. Technical Implementation

#### i18n Configuration
```javascript
// Supports language detection from:
// - localStorage (user preference)
// - Browser language
// - HTML lang attribute

// Fallback chain: Selected → Browser → English
```

#### RTL CSS Support
```css
/* Automatic text alignment */
[dir="rtl"] { text-align: right; }

/* Icon positioning adjustments */
[dir="rtl"] .pl-8 { padding-right: 2rem; padding-left: 0.5rem; }

/* Border direction swapping */
[dir="rtl"] .border-l-4 { border-right-width: 4px; border-left-width: 0; }
```

#### Font Support
- Vazirmatn for better Dari/Pashto rendering
- Noto Sans Arabic fallback
- Print-optimized fonts for receipts

### 6. User Experience

#### Language Switching
- Language selector in top navigation
- Immediate UI language change
- Automatic direction switching
- Persistent language preference

#### Receipt Printing
- Dual-language receipts show both English and local language
- Proper RTL formatting for Pashto/Dari content
- Regulatory compliance text in both languages
- Print-optimized layout

#### Settings Integration
- Language preference in settings
- Layout direction manual override
- Invoice language mode selection
- Live preview of changes

### 7. Pharmacy-Specific Features

#### Barcode Scanner
- Product names displayed in selected language
- Scan feedback messages translated
- Inventory audit instructions localized

#### Compliance
- Dual-language invoices for regulatory requirements
- Tax information in both languages
- Audit trail maintains language context

### 8. Development Benefits

#### Maintainable Structure
```
src/locales/
├── en.json     # English translations
├── fa.json     # Dari translations
└── ps.json     # Pashto translations
```

#### Easy Extension
- Add new languages by creating translation files
- Use translation keys: `t('nav.dashboard')`
- Automatic fallback to English for missing translations

### 9. Regional Considerations

#### Afghanistan Context
- Both Dari and Pashto are official languages
- Many users prefer local language interfaces
- Government forms often require English
- Business transactions may need dual-language documentation

#### Future Extensions
- Regional date/time formatting
- Local currency display preferences
- Cultural-specific number formatting
- Holiday and calendar localization

## Usage Examples

### Basic Translation
```javascript
const { t } = useTranslation();
return <h1>{t('dashboard.title')}</h1>; // "Dashboard" or "داشبورد"
```

### RTL Detection
```javascript
const { isRTL } = useLanguage();
return <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
```

### Dual-Language Receipt
```javascript
<DualLanguageReceipt 
  cart={cart} 
  customer={customer}
  invoiceData={invoice}
  onClose={() => setShowReceipt(false)}
/>
```

This implementation provides a complete localization solution that respects local language preferences while maintaining international compliance requirements.