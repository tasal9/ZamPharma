import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import './i18n';
import {
  LayoutGrid,
  ShoppingCart,
  Package,
  Boxes,
  FileBarChart2,
  Factory,
  Users,
  Building2,
  ClipboardList,
  Receipt,
  ArrowLeftRight,
  BadgeDollarSign,
  Settings,
  Bell,
  ShieldCheck,
  UserCircle2,
  Plus,
  Search,
  Download,
  Upload,
  Filter,
  Trash2,
  Edit,
  Eye,
  Save,
  X,
  Check,
  AlertOctagon,
  CalendarClock,
  FileText,
  Truck,
  Pill,
  CreditCard,
  Printer,
  Store,
  RefreshCcw,
  ScanLine,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  Zap,
  Languages,
} from "lucide-react";
import { useKV } from '@github/spark/hooks';

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Language and RTL support hook
function useLanguage() {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useKV('layout-direction', 'ltr');
  const [invoiceLanguage, setInvoiceLanguage] = useKV('invoice-language', 'en');

  const isRTL = direction === 'rtl' || ['fa', 'ps'].includes(i18n.language);

  useEffect(() => {
    // Auto-set direction based on language
    if (['fa', 'ps'].includes(i18n.language) && direction === 'ltr') {
      setDirection('rtl');
    } else if (i18n.language === 'en' && direction === 'rtl') {
      setDirection('ltr');
    }
  }, [i18n.language, direction, setDirection]);

  useEffect(() => {
    // Apply direction to document
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [direction, i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    const newDirection = ['fa', 'ps'].includes(lng) ? 'rtl' : 'ltr';
    setDirection(newDirection);
  };

  const getLanguageName = (code) => {
    const names = {
      en: 'English',
      fa: 'فارسی (Dari)',
      ps: 'پښتو (Pashto)'
    };
    return names[code] || code;
  };

  return {
    language: i18n.language,
    direction,
    isRTL,
    invoiceLanguage,
    changeLanguage,
    setDirection,
    setInvoiceLanguage,
    getLanguageName
  };
}

// Dual-language receipt component
function DualLanguageReceipt({ cart, customer, invoiceData, onClose }) {
  const { t, i18n } = useTranslation();
  const { isRTL, invoiceLanguage } = useLanguage();
  
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const subtotal = total / 1.05; // Assuming 5% VAT
  const vat = total - subtotal;
  
  const formatCurrency = (amount) => `${amount.toFixed(2)} AFN`;
  
  const shouldShowDual = invoiceLanguage === 'dual';
  const primaryLang = shouldShowDual ? 'en' : (invoiceLanguage === 'local' ? i18n.language : 'en');
  const secondaryLang = shouldShowDual ? i18n.language : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5"/>
            {t('receipt.invoice')} #{invoiceData?.id || 'INV-' + Date.now()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 font-mono text-sm">
          {/* Header */}
          <div className="text-center border-b pb-3">
            <div className="font-bold text-lg">ZamPharm</div>
            {shouldShowDual && <div className="font-bold text-lg">زام فارم</div>}
            <div className="text-xs text-muted-foreground">Main Kabul Branch</div>
            {shouldShowDual && <div className="text-xs text-muted-foreground">د کابل اصلي څانګه</div>}
          </div>
          
          {/* Invoice details */}
          <div className="flex justify-between text-xs">
            <div>
              <div>{t('common.date')}: {new Date().toLocaleDateString()}</div>
              <div>{t('common.time')}: {new Date().toLocaleTimeString()}</div>
              <div>{t('pos.customer')}: {customer?.name || 'Walk-in'}</div>
              {shouldShowDual && (
                <>
                  <div>نېټه: {new Date().toLocaleDateString('fa-AF')}</div>
                  <div>وخت: {new Date().toLocaleTimeString('fa-AF')}</div>
                  <div>پیرودونکی: {customer?.name || 'د لارې پیرودونکی'}</div>
                </>
              )}
            </div>
            <div className="text-right">
              <div>TIN: 123456789</div>
              <div>Tel: +93 700 000 000</div>
            </div>
          </div>
          
          {/* Items */}
          <div className="border-t border-b py-2">
            <div className="grid grid-cols-4 gap-2 font-bold text-xs border-b pb-1">
              <div>{t('common.product')}</div>
              <div className="text-center">{t('common.quantity')}</div>
              <div className="text-right">{t('common.price')}</div>
              <div className="text-right">{t('common.total')}</div>
            </div>
            {shouldShowDual && (
              <div className="grid grid-cols-4 gap-2 font-bold text-xs border-b pb-1">
                <div>توکي</div>
                <div className="text-center">مقدار</div>
                <div className="text-right">بیه</div>
                <div className="text-right">ټول</div>
              </div>
            )}
            
            {cart.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="grid grid-cols-4 gap-2 text-xs py-1">
                  <div className="truncate">{item.name}</div>
                  <div className="text-center">{item.qty}</div>
                  <div className="text-right">{formatCurrency(item.price)}</div>
                  <div className="text-right">{formatCurrency(item.qty * item.price)}</div>
                </div>
                {shouldShowDual && (
                  <div className="grid grid-cols-4 gap-2 text-xs py-1 text-muted-foreground">
                    <div className="truncate">{item.name}</div>
                    <div className="text-center">{item.qty}</div>
                    <div className="text-right">{formatCurrency(item.price)}</div>
                    <div className="text-right">{formatCurrency(item.qty * item.price)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Totals */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>{t('receipt.subtotal')}:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {shouldShowDual && (
              <div className="flex justify-between text-muted-foreground">
                <span>برخه ټوله:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>{t('receipt.tax')} (5%):</span>
              <span>{formatCurrency(vat)}</span>
            </div>
            {shouldShowDual && (
              <div className="flex justify-between text-muted-foreground">
                <span>مالیه (۵%):</span>
                <span>{formatCurrency(vat)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold border-t pt-1">
              <span>{t('receipt.grandTotal')}:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {shouldShowDual && (
              <div className="flex justify-between font-bold text-muted-foreground">
                <span>ټوله مجموعه:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            )}
          </div>
          
          {/* Payment method */}
          <div className="text-center text-xs border-t pt-2">
            <div>{t('receipt.paymentMethod')}: {t('pos.cash')}</div>
            {shouldShowDual && <div>د تادیې طریقه: نغدې پیسې</div>}
          </div>
          
          {/* Footer */}
          <div className="text-center text-xs space-y-1">
            <div>{t('receipt.thankYou')}</div>
            {shouldShowDual && <div>د تاسو د پیرودنې څخه مننه!</div>}
            <div>{t('receipt.visitAgain')}</div>
            {shouldShowDual && <div>لطفاً بیا راشئ</div>}
            <div className="text-muted-foreground text-xs mt-2">
              {t('receipt.regulatoryInfo')}
            </div>
            {shouldShowDual && (
              <div className="text-muted-foreground text-xs">
                د مقرراتو د تعمیل لپاره
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button onClick={() => window.print()} className="flex-1">
            <Printer className="h-4 w-4 mr-2"/>
            {t('common.print')}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Language selector component
function LanguageSelector({ className = "" }) {
  const { t } = useTranslation();
  const { language, changeLanguage, getLanguageName } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Languages className="h-5 w-5"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('settings.selectLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        {['en', 'fa', 'ps'].map((lng) => (
          <DropdownMenuItem 
            key={lng} 
            onClick={() => changeLanguage(lng)}
            className={language === lng ? 'bg-muted' : ''}
          >
            {getLanguageName(lng)}
            {language === lng && <Check className="h-4 w-4 ml-auto"/>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// Conflict resolution for overlapping audit data
  const conflicts = [];
  const resolutions = [];
  
  // Group audits by product ID to detect overlaps
  const productAudits = {};
  
  audits.forEach(audit => {
    audit.scannedProducts?.forEach(product => {
      if (!productAudits[product.id]) {
        productAudits[product.id] = [];
      }
      productAudits[product.id].push({
        auditId: audit.id,
        auditTime: audit.endTime || audit.startTime,
        product,
        operatorId: audit.operatorId,
        deviceId: audit.deviceId
      });
    });
  });
  
  // Detect conflicts (same product audited in multiple sessions)
  Object.entries(productAudits).forEach(([productId, auditEntries]) => {
    if (auditEntries.length > 1) {
      // Sort by audit time to determine priority
      auditEntries.sort((a, b) => new Date(b.auditTime) - new Date(a.auditTime));
      
      const latestEntry = auditEntries[0];
      const conflictingEntries = auditEntries.slice(1);
      
      conflicts.push({
        productId: parseInt(productId),
        productName: latestEntry.product.name,
        productSku: latestEntry.product.sku,
        conflictType: 'product_overlap',
        entries: auditEntries,
        recommendedResolution: {
          type: 'use_latest',
          selectedEntry: latestEntry,
          reason: 'Most recent audit takes precedence'
        }
      });
    }
  });
  
  // Auto-resolve conflicts using latest-wins strategy
  conflicts.forEach(conflict => {
    resolutions.push({
      conflictId: `${conflict.productId}-${Date.now()}`,
      productId: conflict.productId,
      resolutionType: 'automatic',
      strategy: 'latest_wins',
      selectedAudit: conflict.recommendedResolution.selectedEntry.auditId,
      resolvedAt: new Date().toISOString(),
      discardedAudits: conflict.entries.slice(1).map(e => e.auditId)
    });
  });
  
  return { conflicts, resolutions };
}

// Merge audit data with conflict resolution
function mergeAuditData(audits, resolutions) {
  const mergedData = {};
  const discardedEntries = new Set();
  
  // Mark entries to discard based on resolutions
  resolutions.forEach(resolution => {
    resolution.discardedAudits?.forEach(auditId => {
      discardedEntries.add(`${auditId}-${resolution.productId}`);
    });
  });
  
  // Build merged dataset
  audits.forEach(audit => {
    audit.scannedProducts?.forEach(product => {
      const entryKey = `${audit.id}-${product.id}`;
      
      if (!discardedEntries.has(entryKey)) {
        if (!mergedData[product.id] || 
            new Date(audit.endTime || audit.startTime) > 
            new Date(mergedData[product.id].auditTime)) {
          mergedData[product.id] = {
            ...product,
            auditId: audit.id,
            auditTime: audit.endTime || audit.startTime,
            operatorId: audit.operatorId,
            deviceId: audit.deviceId
          };
        }
      }
    });
  });
  
  return Object.values(mergedData);
}

// Utility: simple table
function DataTable({ columns, data, onEdit, onDelete, onView, pageSize = 8 }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(columns[0]?.key ?? "id");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    const f = data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q.toLowerCase()))
    );
    const s = [...f].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const res = av > bv ? 1 : -1;
      return sortDir === "asc" ? res : -res;
    });
    return s;
  }, [q, data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card className="w-full">
      <CardHeader className="gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
          <CardTitle className="text-lg">Records</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="pl-8" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filter</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick filters</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Low stock</DropdownMenuItem>
                <DropdownMenuItem>Expired</DropdownMenuItem>
                <DropdownMenuItem>Near expiry (30d)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline"><Upload className="mr-2 h-4 w-4"/>Import</Button>
            <Button><Download className="mr-2 h-4 w-4"/>Export</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-2 text-left font-medium cursor-pointer" onClick={() => {
                    if (sortKey === c.key) setSortDir(sortDir === "asc" ? "desc" : "asc");
                    setSortKey(c.key);
                  }}>
                    <div className="flex items-center gap-2">
                      <span>{c.label}</span>
                      {sortKey === c.key && <Badge variant="secondary">{sortDir}</Badge>}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-2 whitespace-nowrap">{c.render ? c.render(row[c.key], row) : String(row[c.key])}</td>
                  ))}
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <Button size="icon" variant="ghost" onClick={() => onView(row)}><Eye className="h-4 w-4"/></Button>
                      )}
                      {onEdit && (
                        <Button size="icon" variant="ghost" onClick={() => onEdit(row)}><Edit className="h-4 w-4"/></Button>
                      )}
                      {onDelete && (
                        <Button size="icon" variant="ghost" onClick={() => onDelete(row)}><Trash2 className="h-4 w-4"/></Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">Page {page} of {totalPages} • {filtered.length} results</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
            <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Network status hook
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState(Date.now());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(Date.now());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastOnline };
}

// Offline sync status component
function SyncStatus({ isOnline, pendingSync, lastSync, isAutomaticSyncing }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} ${!isOnline && pendingSync > 0 ? 'animate-pulse' : ''}`} />
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Cloud className="h-3 w-3 text-green-600" />
        ) : (
          <CloudOff className="h-3 w-3 text-red-600" />
        )}
        <span className={isOnline ? 'text-green-700' : 'text-red-700'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {isAutomaticSyncing && (
          <Zap className="h-3 w-3 text-blue-500 animate-pulse" />
        )}
      </div>
      {pendingSync > 0 && (
        <Badge variant="outline" className="text-xs">
          {pendingSync} pending
        </Badge>
      )}
      {lastSync && (
        <span className="text-muted-foreground">
          Synced: {new Date(lastSync).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

// Barcode Scanner Hook - listens for scanner input
function useBarcodeScanner(onScan, options = {}) {
  const [lastScan, setLastScan] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const scanTimeout = useRef(null);
  const scanBuffer = useRef("");
  const { 
    minLength = 6, 
    maxLength = 20, 
    scanDelay = 100,
    enabled = true 
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Ignore input if user is typing in a form field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Clear previous timeout
      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }

      // Start scanning indicator
      if (!isScanning) {
        setIsScanning(true);
        scanBuffer.current = "";
      }

      // Add character to buffer (ignore special keys)
      if (e.key.length === 1) {
        scanBuffer.current += e.key;
      }

      // Set timeout to process scan
      scanTimeout.current = setTimeout(() => {
        const scanned = scanBuffer.current.trim();
        
        if (scanned.length >= minLength && scanned.length <= maxLength) {
          setLastScan(scanned);
          onScan(scanned);
        }
        
        // Reset
        scanBuffer.current = "";
        setIsScanning(false);
      }, scanDelay);
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }
    };
  }, [onScan, minLength, maxLength, scanDelay, enabled, isScanning]);

  return { lastScan, isScanning };
}

// Scanner Status Indicator
function ScannerStatus({ isScanning, lastScan, mode }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
      <span className="text-xs text-muted-foreground">
        {isScanning ? (
          mode === 'bulk' ? 'Bulk scanning...' : 'Scanning...'
        ) : lastScan ? (
          `Last: ${lastScan}`
        ) : (
          mode === 'bulk' ? 'Bulk ready' : 'Ready'
        )}
      </span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, cta, extra }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-2">{extra}{cta}</div>
    </div>
  );
}

// POS Drawer
function POSDrawer({ cart, setCart, onCheckout }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const updateQty = (id, delta) => setCart((c) => c.map((it) => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it));
  const remove = (id) => setCart((c) => c.filter((it) => it.id !== id));
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="gap-2"><ShoppingCart className="h-4 w-4"/>{t('pos.cart')} ({cart.length})</Button>
      </SheetTrigger>
      <SheetContent className={`w-full sm:max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
        <SheetHeader>
          <SheetTitle>{t('pos.cart')}</SheetTitle>
          <SheetDescription>{t('pos.scanInstruction')}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{t('common.batch')} {item.batch} • {t('common.expiry')} {item.expiry}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{(item.price).toFixed(2)} AFN</div>
                    <div className="text-xs text-muted-foreground">{t('pos.vat', { rate: item.tax })}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => updateQty(item.id, -1)}>-</Button>
                    <div className="w-10 text-center">{item.qty}</div>
                    <Button variant="outline" size="icon" onClick={() => updateQty(item.id, +1)}>+</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {cart.length === 0 && <div className="text-sm text-muted-foreground">{t('pos.cart')} is empty</div>}
        </div>
        <Separator className="my-4"/>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>{t('common.total')}</span>
          <span>{total.toFixed(2)} AFN</span>
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <Select defaultValue="cash">
            <SelectTrigger className="w-full"><SelectValue placeholder={t('pos.paymentMethod')}/></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">{t('pos.cash')}</SelectItem>
              <SelectItem value="card">{t('pos.card')}</SelectItem>
              <SelectItem value="wallet">{t('pos.wallet')}</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full" onClick={onCheckout}><BadgeDollarSign className="h-4 w-4 mr-2"/>{t('pos.checkout')}</Button>
        </div>
        <Button variant="outline" className="w-full mt-2"><Printer className="h-4 w-4 mr-2"/>{t('pos.printReceipt')}</Button>
      </SheetContent>
    </Sheet>
  );
}

// Generic entity form modal
function EntityForm({ open, onOpenChange, title, fields, onSubmit, defaults = {} }) {
  const [state, setState] = useState(defaults);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
              <Label className="text-xs" htmlFor={f.name}>{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea id={f.name} value={state[f.name] || ""} onChange={(e)=>setState({...state,[f.name]:e.target.value})} placeholder={f.placeholder} />
              ) : f.type === "select" ? (
                <Select value={state[f.name] || ""} onValueChange={(v)=>setState({...state,[f.name]:v})}>
                  <SelectTrigger id={f.name}><SelectValue placeholder={f.placeholder}/></SelectTrigger>
                  <SelectContent>
                    {f.options?.map((o)=> <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input id={f.name} type={f.type || "text"} value={state[f.name] || ""} onChange={(e)=>setState({...state,[f.name]:e.target.value})} placeholder={f.placeholder} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="outline" onClick={()=>onOpenChange(false)}><X className="h-4 w-4 mr-2"/>Cancel</Button>
          <Button onClick={()=>onSubmit(state)}><Save className="h-4 w-4 mr-2"/>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const demoProducts = [
  { id: 1, sku: "PCM-001", name: "Paracetamol 500mg", form: "Tablet", company: "ACME Pharma", unit: "Strip", price: 40, stock: 220, min: 50, tax: 5, batch: "B23A", expiry: "2026-02-01", barcode: "123456789012" },
  { id: 2, sku: "AMX-250", name: "Amoxicillin 250mg", form: "Capsule", company: "HealthCo", unit: "Bottle", price: 180, stock: 36, min: 20, tax: 5, batch: "AMX92", expiry: "2025-12-15", barcode: "234567890123" },
  { id: 3, sku: "ORS-001", name: "ORS Sachet", form: "Sachet", company: "Zed Labs", unit: "Box", price: 20, stock: 500, min: 100, tax: 0, batch: "ORS77", expiry: "2027-05-01", barcode: "345678901234" },
];

const demoSuppliers = [
  { id: 1, name: "Kabul Med Distributors", phone: "+93 700 111 222", email: "sales@kmd.af", address: "District 4, Kabul", balance: 125000 },
  { id: 2, name: "Herat Pharma Supply", phone: "+93 700 333 444", email: "ops@heratpharma.af", address: "Makroryan, Kabul", balance: 78000 },
];

const demoCompanies = [
  { id: 1, name: "ACME Pharma", country: "IN", phone: "+91 22 5555 5555" },
  { id: 2, name: "HealthCo", country: "AE", phone: "+971 4 222 3333" },
];

const demoBatches = [
  { id: 1, product: "Paracetamol 500mg", batch: "B23A", qty: 120, mrp: 55, cost: 38, expiry: "2026-02-01" },
  { id: 2, product: "Amoxicillin 250mg", batch: "AMX92", qty: 36, mrp: 220, cost: 160, expiry: "2025-12-15" },
];

const demoAlerts = [
  { id: 1, type: "expiry", message: "10 items expiring within 30 days", severity: "high" },
  { id: 2, type: "stock", message: "7 products below minimum stock", severity: "medium" },
];


function Sidebar({ current, setCurrent }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const routes = [
    { key: "dashboard", icon: LayoutGrid },
    { key: "pos", icon: ShoppingCart },
    { key: "products", icon: Package },
    { key: "inventory", icon: Boxes },
    { key: "purchases", icon: Truck },
    { key: "sales", icon: Receipt },
    { key: "suppliers", icon: Users },
    { key: "companies", icon: Factory },
    { key: "customers", icon: UserCircle2 },
    { key: "prescriptions", icon: ClipboardList },
    { key: "returns", icon: ArrowLeftRight },
    { key: "reports", icon: FileBarChart2 },
    { key: "accounting", icon: BadgeDollarSign },
    { key: "settings", icon: Settings },
    { key: "alerts", icon: Bell },
    { key: "audit", icon: ShieldCheck },
  ];

  return (
    <div className={`hidden md:flex flex-col w-64 border-r bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isRTL ? 'border-l' : 'border-r'}`}>
      <div className="h-16 flex items-center gap-2 px-4 border-b">
        <Pill className="h-6 w-6"/>
        <div className="font-semibold">ZamPharm</div>
        <Badge className="ml-auto" variant="secondary">v1</Badge>
      </div>
      <div className="p-2 overflow-y-auto">
        {routes.map((r) => (
          <button key={r.key} onClick={() => setCurrent(r.key)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted ${current===r.key?"bg-muted font-semibold":""} ${isRTL ? 'text-right' : 'text-left'}`}>
            <r.icon className="h-4 w-4"/>
            {t(`nav.${r.key}`)}
          </button>
        ))}
      </div>
      <div className="mt-auto p-4">
        <Card>
          <CardContent className="p-4 text-xs text-muted-foreground">
            <div className="font-medium text-foreground">{t('common.branch')}</div>
            <div className="flex items-center gap-2 mt-1">
              <Store className="h-4 w-4"/> {t('settings.mainKabul')}
            </div>
            <div className="mt-2">{t('sidebar.lastSync', { time: '3m' })}</div>
            <Button variant="outline" className="mt-3 w-full"><RefreshCcw className="h-4 w-4 mr-2"/>{t('sidebar.sync')}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Topbar() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  return (
    <div className="h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-96">
          <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4`}/>
          <Input placeholder={t('topbar.quickSearch')} className={`${isRTL ? 'pr-8' : 'pl-8'}`}/>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon"><Printer className="h-5 w-5"/></Button>
            </TooltipTrigger>
            <TooltipContent>{t('topbar.printLabels')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5"/></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>{t('topbar.notifications')}</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {demoAlerts.map((a)=> (
              <DropdownMenuItem key={a.id} className="flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 mt-1"/>
                <div>
                  <div className="text-xs font-medium capitalize">{t(`alerts.${a.type}`)}</div>
                  <div className="text-xs text-muted-foreground">{a.type === 'expiry' ? t('alerts.expiringItems', { count: 10 }) : t('alerts.lowStockItems', { count: 7 })}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <LanguageSelector />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2"><UserCircle2 className="h-5 w-5"/> Admin</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t('topbar.profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('topbar.switchBranch')}</DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>{t('topbar.signOut')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={LayoutGrid} title={t('dashboard.title')} extra={<div className="text-sm text-muted-foreground">{t('dashboard.today')} • {new Date().toDateString()}</div>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {t: t('dashboard.sales'), v:"AFN 124,500"},
          {t: t('dashboard.invoices'), v:"148"},
          {t: t('dashboard.lowStock'), v:"7"},
          {t: t('dashboard.expiring'), v:"10"}
        ].map((k,i)=> (
          <Card key={i}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{k.t}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">{k.v}</CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.topProducts')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoProducts.map((p)=> (
              <div key={p.id} className="flex items-center justify-between">
                <div className="text-sm">{p.name}</div>
                <Progress value={Math.min(100, (p.stock / 500) * 100)} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('dashboard.alerts')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {demoAlerts.map((a)=> (
              <div key={a.id} className="p-3 rounded-xl border flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 mt-0.5"/>
                <div>
                  <div className="text-sm font-medium capitalize">{t(`alerts.${a.type}`)}</div>
                  <div className="text-xs text-muted-foreground">{a.type === 'expiry' ? t('alerts.expiringItems', { count: 10 }) : t('alerts.lowStockItems', { count: 7 })}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function POS() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [cart, setCart] = useState([]);
  const [scan, setScan] = useState("");
  const [scanFeedback, setScanFeedback] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  // Barcode scanner integration
  const handleBarcodeScan = (barcode) => {
    const product = demoProducts.find(p => 
      p.barcode === barcode || 
      p.sku.toLowerCase() === barcode.toLowerCase()
    );
    
    if (product) {
      addToCart(product);
      setScanFeedback({ type: 'success', message: t('pos.addedToCart', { product: product.name }) });
      setScan(""); // Clear search after successful scan
    } else {
      setScanFeedback({ type: 'error', message: t('pos.productNotFound', { barcode }) });
    }
    
    // Clear feedback after 3 seconds
    setTimeout(() => setScanFeedback(null), 3000);
  };

  const { isScanning } = useBarcodeScanner(handleBarcodeScan, { enabled: true });

  const addToCart = (p) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === p.id);
      if (ex) return c.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { id: p.id, name: p.name, qty: 1, price: p.price, tax: p.tax, batch: p.batch, expiry: p.expiry }];
    });
  };

  // Handle manual search/scan input
  const handleScanInputChange = (value) => {
    setScan(value);
    
    // Auto-search if barcode format detected (12+ digits)
    if (value.length >= 12 && /^\d+$/.test(value)) {
      handleBarcodeScan(value);
    }
  };

  const handleCheckout = () => {
    const invoiceId = `INV-${Date.now()}`;
    setCurrentInvoice({ id: invoiceId, date: new Date() });
    setShowReceipt(true);
    setCart([]);
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={ShoppingCart} 
        title={t('pos.title')} 
        cta={<POSDrawer cart={cart} setCart={setCart} onCheckout={handleCheckout}/>} 
        extra={
          <div className="flex items-center gap-3">
            <ScannerStatus isScanning={isScanning} mode="normal" />
            <div className="text-sm text-muted-foreground">{t('pos.scanPrompt')}</div>
          </div>
        } 
      />
      
      {/* Scan Feedback */}
      {scanFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-3 rounded-lg border flex items-center gap-2 ${
            scanFeedback.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {scanFeedback.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{scanFeedback.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <ScanLine className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4`} />
                <Input 
                  value={scan} 
                  onChange={(e) => handleScanInputChange(e.target.value)} 
                  placeholder={t('pos.scanPrompt')}
                  className={`${isRTL ? 'pr-8' : 'pl-8'}`}
                />
              </div>
              <Button onClick={() => setScan("")}>{t('common.clear')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {demoProducts.filter(p=> 
                p.name.toLowerCase().includes(scan.toLowerCase()) || 
                p.sku.toLowerCase().includes(scan.toLowerCase()) ||
                p.barcode.includes(scan)
              ).map((p)=> (
                <Card key={p.id} className="hover:shadow">
                  <CardContent className="p-4">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sku} • {p.form} • {p.company}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('common.barcode')}: {p.barcode}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-lg font-semibold">{p.price} AFN</div>
                      <Button size="sm" onClick={()=>addToCart(p)}><Plus className="h-4 w-4 mr-1"/>{t('common.add')}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('pos.customer')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input 
              placeholder={t('pos.customerName')}
              value={customer.name}
              onChange={(e) => setCustomer(prev => ({...prev, name: e.target.value}))}
            />
            <Input 
              placeholder={t('pos.customerPhone')}
              value={customer.phone}
              onChange={(e) => setCustomer(prev => ({...prev, phone: e.target.value}))}
            />
            <Select>
              <SelectTrigger><SelectValue placeholder={t('pos.discount')}/></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('common.no')}</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><CreditCard className="h-4 w-4 mr-2"/>{t('pos.paymentMethod')}</Button>
          </CardContent>
        </Card>
      </div>

      {/* Dual Language Receipt Dialog */}
      {showReceipt && (
        <DualLanguageReceipt 
          cart={cart} 
          customer={customer}
          invoiceData={currentInvoice}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}

function Products() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(demoProducts);
  const [scanFeedback, setScanFeedback] = useState(null);
  
  const cols = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product" },
    { key: "company", label: "Company" },
    { key: "unit", label: "Unit" },
    { key: "price", label: "MRP", render: (v)=> `${v} AFN` },
    { key: "stock", label: "Stock" },
    { key: "barcode", label: "Barcode" },
    { key: "expiry", label: "Expiry" },
  ];
  
  const fields = [
    { name: "sku", label: "SKU" },
    { name: "name", label: "Name", full: true },
    { name: "barcode", label: "Barcode", full: true },
    { name: "form", label: "Form" },
    { name: "company", label: "Company" },
    { name: "unit", label: "Unit" },
    { name: "price", label: "MRP", type: "number" },
    { name: "tax", label: "Tax %", type: "number" },
    { name: "min", label: "Min Stock", type: "number" },
    { name: "batch", label: "Batch" },
    { name: "expiry", label: "Expiry", type: "date" },
    { name: "desc", label: "Description", type: "textarea", full: true },
  ];

  // Barcode scanner for quick product lookup
  const handleBarcodeScan = (barcode) => {
    const product = rows.find(p => 
      p.barcode === barcode || 
      p.sku.toLowerCase() === barcode.toLowerCase()
    );
    
    if (product) {
      setScanFeedback({ type: 'success', message: `Found: ${product.name}`, product });
    } else {
      setScanFeedback({ type: 'error', message: `Product not found: ${barcode}` });
    }
    
    // Clear feedback after 5 seconds
    setTimeout(() => setScanFeedback(null), 5000);
  };

  const { isScanning } = useBarcodeScanner(handleBarcodeScan, { enabled: true });

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Package} 
        title="Products" 
        cta={<Button onClick={()=>setOpen(true)}><Plus className="h-4 w-4 mr-2"/>New Product</Button>} 
        extra={
          <div className="flex items-center gap-3">
            <ScannerStatus isScanning={isScanning} mode="normal" />
            <Badge variant="secondary">Catalog: {rows.length}</Badge>
          </div>
        } 
      />

      {/* Scan Feedback */}
      {scanFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            scanFeedback.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex-shrink-0">
            {scanFeedback.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${scanFeedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {scanFeedback.message}
            </div>
            {scanFeedback.product && (
              <div className="mt-2 p-3 bg-white rounded border">
                <div className="font-medium">{scanFeedback.product.name}</div>
                <div className="text-sm text-muted-foreground">{scanFeedback.product.sku} • Stock: {scanFeedback.product.stock}</div>
                <div className="text-sm text-muted-foreground">Barcode: {scanFeedback.product.barcode}</div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <DataTable columns={cols} data={rows} onEdit={(r)=>setOpen(true)} onDelete={(r)=>setRows(rows.filter(x=>x.id!==r.id))} onView={(r)=>alert(JSON.stringify(r,null,2))}/>
        </TabsContent>
        <TabsContent value="batches" className="mt-4">
          <DataTable columns={[{key:"product",label:"Product"},{key:"batch",label:"Batch"},{key:"qty",label:"Qty"},{key:"mrp",label:"MRP"},{key:"cost",label:"Cost"},{key:"expiry",label:"Expiry"}]} data={demoBatches} />
        </TabsContent>
        <TabsContent value="adjustments" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Stock Adjustment</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <Select>
                <SelectTrigger><SelectValue placeholder="Product"/></SelectTrigger>
                <SelectContent>
                  {demoProducts.map((p)=> <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Quantity (+/-)"/>
              <Textarea className="sm:col-span-2" placeholder="Reason (damage, expiry, recount, etc.)"/>
              <div className="sm:col-span-2 flex justify-end">
                <Button><Save className="h-4 w-4 mr-2"/>Apply</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <EntityForm open={open} onOpenChange={setOpen} title="Create / Edit Product" fields={fields} onSubmit={()=>setOpen(false)} />
    </div>
  );
}

function Suppliers() {
  const [open, setOpen] = useState(false);
  const cols = [
    { key: "name", label: "Supplier" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "balance", label: "Balance", render: (v)=> `${v} AFN` },
  ];
  const fields = [
    { name: "name", label: "Name", full: true },
    { name: "phone", label: "Phone" },
    { name: "email", label: "Email" },
    { name: "address", label: "Address", full: true },
  ];
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Users} title="Suppliers" cta={<Button onClick={()=>setOpen(true)}><Plus className="h-4 w-4 mr-2"/>New Supplier</Button>} />
      <DataTable columns={cols} data={demoSuppliers} onEdit={()=>setOpen(true)} onDelete={()=>{}} onView={(r)=>alert(JSON.stringify(r,null,2))}/>
      <EntityForm open={open} onOpenChange={setOpen} title="Create / Edit Supplier" fields={fields} onSubmit={()=>setOpen(false)} />
    </div>
  );
}

function Companies() {
  const [open, setOpen] = useState(false);
  const cols = [
    { key: "name", label: "Company" },
    { key: "country", label: "Country" },
    { key: "phone", label: "Phone" },
  ];
  const fields = [
    { name: "name", label: "Name", full: true },
    { name: "country", label: "Country" },
    { name: "phone", label: "Phone" },
  ];
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Factory} title="Companies / Manufacturers" cta={<Button onClick={()=>setOpen(true)}><Plus className="h-4 w-4 mr-2"/>New Company</Button>} />
      <DataTable columns={cols} data={demoCompanies} onEdit={()=>setOpen(true)} onDelete={()=>{}} />
      <EntityForm open={open} onOpenChange={setOpen} title="Create / Edit Company" fields={fields} onSubmit={()=>setOpen(false)} />
    </div>
  );
}

function Inventory() {
  const [scanFeedback, setScanFeedback] = useState(null);
  const [quickStockMode, setQuickStockMode] = useState(false);
  const [bulkScanMode, setBulkScanMode] = useState(false);
  const [auditSession, setAuditSession] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [auditProgress, setAuditProgress] = useState({ scanned: 0, total: demoProducts.length });
  const [isAutomaticSyncing, setIsAutomaticSyncing] = useState(false);

  // Persistent storage for offline audit data
  const [offlineAudits, setOfflineAudits] = useKV("offline-audits", []);
  const [pendingSyncCount, setPendingSyncCount] = useKV("pending-sync-count", 0);
  const [lastSyncTime, setLastSyncTime] = useKV("last-sync-time", null);
  const [currentAuditId, setCurrentAuditId] = useKV("current-audit-session", null);
  const [auditSessionData, setAuditSessionData] = useKV("audit-session-data", null);
  const [conflictResolutions, setConflictResolutions] = useKV("conflict-resolutions", []);
  const [detectedConflicts, setDetectedConflicts] = useState([]);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [activeAuditSessions, setActiveAuditSessions] = useKV("active-audit-sessions", []);
  const [conflictPrevention, setConflictPrevention] = useState(null);

  // Network status
  const { isOnline, lastOnline } = useNetworkStatus();

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingSyncCount > 0) {
      setIsAutomaticSyncing(true);
      syncOfflineData();
    }
  }, [isOnline, pendingSyncCount]);

  // Detect conflicts when audits are loaded
  useEffect(() => {
    if (offlineAudits.length > 1) {
      const { conflicts } = resolveAuditConflicts(offlineAudits);
      if (conflicts.length > 0) {
        setDetectedConflicts(conflicts);
      }
    }
  }, [offlineAudits]);

  // Load audit session from storage if exists
  useEffect(() => {
    if (currentAuditId && auditSessionData) {
      setAuditSession(auditSessionData);
      setScannedItems(auditSessionData.scannedProducts || []);
      setBulkScanMode(true);
      setAuditProgress({ 
        scanned: auditSessionData.scannedProducts?.length || 0, 
        total: demoProducts.length 
      });
      
      // Re-register active session if it exists
      const activeSessions = checkActiveAuditSessions();
      const existingSession = activeSessions.find(s => s.id === currentAuditId);
      if (!existingSession) {
        registerAuditSession(auditSessionData);
      }
    }
  }, [currentAuditId, auditSessionData]);

  // Clean up active sessions on component unmount or page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (auditSession && auditSession.id) {
        // Mark session as abandoned if not completed
        unregisterAuditSession(auditSession.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (auditSession && auditSession.id && !auditSession.endTime) {
        unregisterAuditSession(auditSession.id);
      }
    };
  }, [auditSession]);

  // Sync offline audit data to server
  const syncOfflineData = async () => {
    try {
      if (offlineAudits.length === 0) {
        setIsAutomaticSyncing(false);
        return;
      }

      // Detect and resolve conflicts before syncing
      const { conflicts, resolutions } = resolveAuditConflicts(offlineAudits);
      
      if (conflicts.length > 0) {
        // Store conflict resolutions
        setConflictResolutions(currentResolutions => [...currentResolutions, ...resolutions]);
        
        setScanFeedback({
          type: 'warning',
          message: `Resolved ${conflicts.length} data conflicts using latest-wins strategy`,
          autoSync: true
        });
      }

      // Merge audit data with conflict resolution
      const mergedData = mergeAuditData(offlineAudits, resolutions);

      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, upload merged and resolved audits to server
      console.log('Syncing audits with conflict resolution:', {
        originalAudits: offlineAudits.length,
        conflicts: conflicts.length,
        resolutions: resolutions.length,
        mergedData: mergedData.length
      });
      
      // Clear offline data after successful sync
      setOfflineAudits([]);
      setPendingSyncCount(0);
      setLastSyncTime(Date.now());
      setDetectedConflicts([]);
      setIsAutomaticSyncing(false);
      
      setScanFeedback({
        type: 'success',
        message: `Synced ${offlineAudits.length} audit sessions${conflicts.length > 0 ? ` (${conflicts.length} conflicts resolved)` : ''} to server`,
        autoSync: true
      });
      
      setTimeout(() => setScanFeedback(null), 3000);
    } catch (error) {
      setIsAutomaticSyncing(false);
      setScanFeedback({
        type: 'error',
        message: 'Sync failed - will retry when online',
        autoSync: true
      });
      setTimeout(() => setScanFeedback(null), 5000);
    }
  };

  // Manual conflict resolution
  const resolveConflictManually = (conflictId, selectedAuditId, strategy = 'manual') => {
    const resolution = {
      conflictId,
      resolutionType: 'manual',
      strategy,
      selectedAudit: selectedAuditId,
      resolvedAt: new Date().toISOString(),
      operatorId: 'admin' // In real app, get from auth context
    };
    
    setConflictResolutions(current => [...current, resolution]);
    setDetectedConflicts(current => current.filter(c => c.productId !== parseInt(conflictId.split('-')[0])));
    
    setScanFeedback({
      type: 'success',
      message: 'Conflict resolved successfully',
      autoSync: false
    });
    
    setTimeout(() => setScanFeedback(null), 3000);
  };

  // Check for active audit sessions to prevent conflicts
  const checkActiveAuditSessions = () => {
    const now = Date.now();
    const activeThreshold = 24 * 60 * 60 * 1000; // 24 hours
    
    // Filter out old sessions
    const currentActiveSessions = activeAuditSessions.filter(session => {
      const sessionAge = now - new Date(session.startTime).getTime();
      return sessionAge < activeThreshold && !session.endTime;
    });
    
    // Update active sessions list
    if (currentActiveSessions.length !== activeAuditSessions.length) {
      setActiveAuditSessions(currentActiveSessions);
    }
    
    return currentActiveSessions;
  };

  // Register audit session as active
  const registerAuditSession = (sessionData) => {
    const activeSessions = checkActiveAuditSessions();
    const newSession = {
      id: sessionData.id,
      operatorId: sessionData.operatorId,
      deviceId: sessionData.deviceId,
      startTime: sessionData.startTime,
      branch: 'Main Kabul', // In real app, get from context
      status: 'active'
    };
    
    setActiveAuditSessions([...activeSessions, newSession]);
  };

  // Unregister audit session
  const unregisterAuditSession = (sessionId) => {
    setActiveAuditSessions(currentSessions => 
      currentSessions.map(session => 
        session.id === sessionId 
          ? { ...session, endTime: new Date().toISOString(), status: 'completed' }
          : session
      ).filter(session => session.status === 'active') // Remove completed sessions
    );
  };

  // Check for conflicts before starting new audit
  const checkForAuditConflicts = () => {
    const activeSessions = checkActiveAuditSessions();
    
    if (activeSessions.length > 0) {
      const conflicts = {
        hasConflicts: true,
        activeSessions,
        message: `${activeSessions.length} active audit session${activeSessions.length > 1 ? 's' : ''} detected`,
        recommendations: []
      };
      
      // Add specific recommendations based on conflict type
      const sameBranch = activeSessions.filter(s => s.branch === 'Main Kabul');
      const sameOperator = activeSessions.filter(s => s.operatorId === 'admin');
      const sameDevice = activeSessions.filter(s => s.deviceId === 'DEVICE-001');
      
      if (sameBranch.length > 0) {
        conflicts.recommendations.push({
          type: 'branch_conflict',
          message: 'Another audit is already running in this branch',
          severity: 'high',
          action: 'Wait for current audit to complete or coordinate with other operator'
        });
      }
      
      if (sameOperator.length > 0) {
        conflicts.recommendations.push({
          type: 'operator_conflict',
          message: 'You have another active audit session',
          severity: 'medium',
          action: 'Complete your previous audit session first'
        });
      }
      
      if (sameDevice.length > 0) {
        conflicts.recommendations.push({
          type: 'device_conflict',
          message: 'This device has an active audit session',
          severity: 'medium',
          action: 'Use a different device or complete the active session'
        });
      }
      
      return conflicts;
    }
    
    return { hasConflicts: false };
  };
  const getAuditPriorityScore = (audit) => {
    let score = 0;
    
    // More recent audits get higher priority
    const ageHours = (Date.now() - new Date(audit.auditTime)) / (1000 * 60 * 60);
    score += Math.max(0, 100 - ageHours);
    
    // Complete audits get higher priority
    if (audit.actualCount !== null) score += 50;
    
    // Multiple scans indicate thoroughness
    score += Math.min(20, (audit.scannedCount || 1) * 5);
    
    return score;
  };

  // Manual sync trigger
  const manualSync = () => {
    if (!isOnline) {
      setScanFeedback({
        type: 'error',
        message: 'Cannot sync while offline',
        autoSync: false
      });
      setTimeout(() => setScanFeedback(null), 3000);
      return;
    }
    
    setIsAutomaticSyncing(true);
    syncOfflineData();
  };

  // Start new audit session with conflict prevention
  const startAuditSession = () => {
    // Check for active audit conflicts first
    const conflictCheck = checkForAuditConflicts();
    
    if (conflictCheck.hasConflicts) {
      setConflictPrevention(conflictCheck);
      setScanFeedback({
        type: 'error',
        message: conflictCheck.message,
        autoSync: false
      });
      setTimeout(() => setScanFeedback(null), 5000);
      return;
    }
    
    const sessionId = `AUDIT-${Date.now()}`;
    const newSession = {
      id: sessionId,
      startTime: new Date().toISOString(),
      scannedProducts: [],
      missedProducts: [],
      discrepancies: [],
      deviceId: 'DEVICE-001', // In real app, get from device
      operatorId: 'admin',
      isOffline: !isOnline
    };
    
    setAuditSession(newSession);
    setScannedItems([]);
    setBulkScanMode(true);
    setAuditProgress({ scanned: 0, total: demoProducts.length });
    
    // Register as active audit session for conflict prevention
    registerAuditSession(newSession);
    
    // Persist session for offline recovery
    setCurrentAuditId(sessionId);
    setAuditSessionData(newSession);
    
    setScanFeedback({
      type: 'success',
      message: `Audit session started: ${sessionId}`,
      autoSync: false
    });
    setTimeout(() => setScanFeedback(null), 3000);
  };

  // End audit session
  const endAuditSession = () => {
    if (auditSession) {
      const missedProducts = demoProducts.filter(p => 
        !scannedItems.some(s => s.id === p.id)
      );
      
      const completedSession = {
        ...auditSession,
        endTime: new Date().toISOString(),
        scannedProducts: scannedItems,
        missedProducts,
        completion: ((scannedItems.length / demoProducts.length) * 100).toFixed(1),
        finalCounts: scannedItems.filter(item => item.actualCount !== null).length,
        discrepancies: scannedItems.filter(item => item.discrepancy !== null && item.discrepancy !== 0),
        syncStatus: isOnline ? 'synced' : 'pending'
      };
      
      setAuditSession(completedSession);
      
      // Unregister from active sessions
      unregisterAuditSession(auditSession.id);
      
      // Save offline audit
      if (!isOnline) {
        setOfflineAudits(currentAudits => [...currentAudits, completedSession]);
        setPendingSyncCount(count => count + 1);
      } else {
        // In real app, immediately sync to server
        console.log('Immediate sync:', completedSession);
        setLastSyncTime(Date.now());
      }
      
      // Clear session storage
      setCurrentAuditId(null);
      setAuditSessionData(null);
      
      setScanFeedback({
        type: 'success',
        message: `Audit completed: ${completedSession.completion}% coverage`,
        autoSync: false
      });
      setTimeout(() => setScanFeedback(null), 5000);
    }
    setBulkScanMode(false);
  };

  // Barcode scanner for inventory management
  const handleBarcodeScan = (barcode) => {
    const product = demoProducts.find(p => 
      p.barcode === barcode || 
      p.sku.toLowerCase() === barcode.toLowerCase()
    );
    
    if (product) {
      if (bulkScanMode && auditSession) {
        // Check if already scanned in this session
        const alreadyScanned = scannedItems.find(item => item.id === product.id);
        
        if (alreadyScanned) {
          setScanFeedback({ 
            type: 'warning', 
            message: `Already scanned: ${product.name}`, 
            product,
            count: alreadyScanned.scannedCount + 1
          });
          
          // Update scan count
          const updatedItems = scannedItems.map(item => 
            item.id === product.id 
              ? { ...item, scannedCount: item.scannedCount + 1, lastScanned: new Date().toISOString() }
              : item
          );
          setScannedItems(updatedItems);
          
          // Update persistent session
          setAuditSessionData(prev => ({
            ...prev,
            scannedProducts: updatedItems
          }));
        } else {
          setScanFeedback({ 
            type: 'success', 
            message: `Added to audit: ${product.name}${!isOnline ? ' (offline)' : ''}`, 
            product,
            sessionProgress: `${scannedItems.length + 1}/${demoProducts.length}`
          });
          
          // Add to scanned items
          const newItem = {
            ...product,
            scannedCount: 1,
            actualCount: null,
            discrepancy: null,
            firstScanned: new Date().toISOString(),
            lastScanned: new Date().toISOString()
          };
          
          const updatedItems = [...scannedItems, newItem];
          setScannedItems(updatedItems);
          setAuditProgress(prev => ({ ...prev, scanned: prev.scanned + 1 }));
          
          // Update persistent session
          setAuditSessionData(prev => ({
            ...prev,
            scannedProducts: updatedItems
          }));
        }
      } else {
        setScanFeedback({ 
          type: 'success', 
          message: `Stock check: ${product.name}${!isOnline ? ' (offline)' : ''}`, 
          product,
          action: quickStockMode ? 'Quick count mode active' : 'View details'
        });
      }
    } else {
      setScanFeedback({ type: 'error', message: `Product not found: ${barcode}` });
    }
    
    // Clear feedback after 3 seconds in bulk mode, 5 seconds otherwise
    setTimeout(() => setScanFeedback(null), bulkScanMode ? 2000 : 5000);
  };

  const { isScanning } = useBarcodeScanner(handleBarcodeScan, { 
    enabled: true,
    scanDelay: bulkScanMode ? 50 : 100 // Faster scanning in bulk mode
  });

  // Update actual count for scanned item
  const updateActualCount = (productId, count) => {
    const updatedItems = scannedItems.map(item => {
      if (item.id === productId) {
        const actualCount = parseInt(count) || 0;
        const discrepancy = actualCount - item.stock;
        return { 
          ...item, 
          actualCount,
          discrepancy: discrepancy !== 0 ? discrepancy : null
        };
      }
      return item;
    });
    
    setScannedItems(updatedItems);
    
    // Update persistent session
    setAuditSessionData(prev => ({
      ...prev,
      scannedProducts: updatedItems
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Boxes} 
        title="Inventory" 
        cta={
          <div className="flex gap-2">
            {!bulkScanMode ? (
              <Button onClick={startAuditSession}>
                <ScanLine className="h-4 w-4 mr-2"/>Start Bulk Audit
              </Button>
            ) : (
              <Button variant="outline" onClick={endAuditSession}>
                <Check className="h-4 w-4 mr-2"/>Complete Audit
              </Button>
            )}
            {detectedConflicts.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={() => setShowConflictDialog(detectedConflicts[0])}
              >
                <AlertOctagon className="h-4 w-4 mr-2"/>
                Resolve Conflicts ({detectedConflicts.length})
              </Button>
            )}
            {pendingSyncCount > 0 && detectedConflicts.length === 0 && (
              <Button 
                variant="outline" 
                onClick={manualSync}
                disabled={!isOnline || isAutomaticSyncing}
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isAutomaticSyncing ? 'animate-spin' : ''}`}/>
                Sync Data
              </Button>
            )}
          </div>
        }
        extra={
          <div className="flex items-center gap-3">
            <SyncStatus 
              isOnline={isOnline} 
              pendingSync={pendingSyncCount} 
              lastSync={lastSyncTime}
              isAutomaticSyncing={isAutomaticSyncing}
            />
            <ScannerStatus isScanning={isScanning} mode={bulkScanMode ? 'bulk' : 'normal'} />
            {activeAuditSessions.length > 0 && !bulkScanMode && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                {activeAuditSessions.length} active audit{activeAuditSessions.length > 1 ? 's' : ''}
              </Badge>
            )}
            {detectedConflicts.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {detectedConflicts.length} conflicts
              </Badge>
            )}
            {bulkScanMode && auditSession && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {auditProgress.scanned}/{auditProgress.total} scanned
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Session: {auditSession.id}
                  {!isOnline && <span className="text-orange-600 ml-1">(offline)</span>}
                </div>
              </div>
            )}
            {!bulkScanMode && (
              <div className="flex items-center gap-2">
                <Switch 
                  checked={quickStockMode} 
                  onCheckedChange={setQuickStockMode}
                  id="quick-stock"
                />
                <Label htmlFor="quick-stock" className="text-sm">Quick count</Label>
              </div>
            )}
          </div>
        }
      />

      {/* Conflict Prevention Warning */}
      {conflictPrevention && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertOctagon className="h-5 w-5"/>
              Active Audit Session Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-orange-700">
                {conflictPrevention.message}. Starting another audit may cause data conflicts.
              </p>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-orange-800">Active Sessions:</div>
                {conflictPrevention.activeSessions.map((session) => (
                  <Card key={session.id} className="border-orange-200">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{session.id}</div>
                          <div className="text-sm text-muted-foreground">
                            Started: {new Date(session.startTime).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Operator: {session.operatorId} • Device: {session.deviceId}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600">
                          {session.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {conflictPrevention.recommendations && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-orange-800">Recommendations:</div>
                  {conflictPrevention.recommendations.map((rec, idx) => (
                    <div key={idx} className={`p-2 rounded border text-sm ${
                      rec.severity === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                      rec.severity === 'medium' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                      'bg-yellow-50 border-yellow-200 text-yellow-700'
                    }`}>
                      <div className="font-medium">{rec.message}</div>
                      <div className="text-xs mt-1">{rec.action}</div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => setConflictPrevention(null)}
                >
                  <X className="h-4 w-4 mr-2"/>
                  Dismiss
                </Button>
                <Button 
                  onClick={() => {
                    // Force start audit anyway (with warning)
                    setConflictPrevention(null);
                    const sessionId = `AUDIT-${Date.now()}`;
                    const newSession = {
                      id: sessionId,
                      startTime: new Date().toISOString(),
                      scannedProducts: [],
                      missedProducts: [],
                      discrepancies: [],
                      deviceId: 'DEVICE-001',
                      operatorId: 'admin',
                      isOffline: !isOnline,
                      forceStarted: true // Flag to indicate this was force-started
                    };
                    
                    setAuditSession(newSession);
                    setScannedItems([]);
                    setBulkScanMode(true);
                    setAuditProgress({ scanned: 0, total: demoProducts.length });
                    registerAuditSession(newSession);
                    setCurrentAuditId(sessionId);
                    setAuditSessionData(newSession);
                    
                    setScanFeedback({
                      type: 'warning',
                      message: 'Audit started despite active sessions - resolve conflicts during sync',
                      autoSync: false
                    });
                    setTimeout(() => setScanFeedback(null), 5000);
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <AlertOctagon className="h-4 w-4 mr-2"/>
                  Force Start Anyway
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Check again in case sessions ended
                    const updated = checkForAuditConflicts();
                    if (!updated.hasConflicts) {
                      setConflictPrevention(null);
                      setScanFeedback({
                        type: 'success',
                        message: 'No active sessions detected - ready to start audit',
                        autoSync: false
                      });
                      setTimeout(() => setScanFeedback(null), 3000);
                    }
                  }}
                >
                  <RefreshCcw className="h-4 w-4 mr-2"/>
                  Check Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Feedback */}
      {scanFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            scanFeedback.type === 'success' 
              ? 'bg-blue-50 border-blue-200' 
              : scanFeedback.type === 'warning'
              ? 'bg-orange-50 border-orange-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex-shrink-0">
            {scanFeedback.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-blue-600" />
            ) : scanFeedback.type === 'warning' ? (
              <AlertCircle className="h-5 w-5 text-orange-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${
              scanFeedback.type === 'success' ? 'text-blue-800' : 
              scanFeedback.type === 'warning' ? 'text-orange-800' : 'text-red-800'
            }`}>
              {scanFeedback.message}
              {scanFeedback.sessionProgress && (
                <span className="ml-2">({scanFeedback.sessionProgress})</span>
              )}
            </div>
            {scanFeedback.product && (
              <div className="mt-2 p-3 bg-white rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{scanFeedback.product.name}</div>
                    <div className="text-sm text-muted-foreground">{scanFeedback.product.sku}</div>
                    <div className="text-sm text-muted-foreground">Barcode: {scanFeedback.product.barcode}</div>
                    {scanFeedback.count && (
                      <div className="text-sm text-orange-600 font-medium">
                        Scan count: {scanFeedback.count}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{scanFeedback.product.stock}</div>
                    <div className="text-xs text-muted-foreground">System stock</div>
                  </div>
                </div>
                {quickStockMode && !bulkScanMode && (
                  <div className="mt-3 flex gap-2">
                    <Input type="number" placeholder="Actual count" className="w-32" />
                    <Button size="sm">Update</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Conflict Resolution Dialog */}
      {detectedConflicts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertOctagon className="h-5 w-5"/>
              Data Conflicts Detected ({detectedConflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-red-700">
                Multiple audit sessions contain overlapping data. Review and resolve conflicts before syncing.
              </p>
              
              {detectedConflicts.map((conflict) => (
                <Card key={conflict.productId} className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{conflict.productName}</div>
                        <div className="text-sm text-muted-foreground">SKU: {conflict.productSku}</div>
                        <div className="text-sm text-red-700 mt-1">
                          Found in {conflict.entries.length} audit sessions
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setShowConflictDialog(conflict)}
                      >
                        Resolve
                      </Button>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Conflicting Entries:</div>
                      {conflict.entries.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                          <div>
                            <span className="font-medium">{entry.auditId}</span>
                            <span className="text-muted-foreground ml-2">
                              {new Date(entry.auditTime).toLocaleString()}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              by {entry.operatorId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {entry.product.actualCount !== null && (
                              <Badge variant="secondary" className="text-xs">
                                Count: {entry.product.actualCount}
                              </Badge>
                            )}
                            {idx === 0 && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                Latest
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                      <div className="font-medium text-blue-800">Recommended: Use Latest</div>
                      <div className="text-blue-700">
                        {conflict.recommendedResolution.reason}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => {
                    // Auto-resolve all conflicts using latest-wins
                    detectedConflicts.forEach(conflict => {
                      resolveConflictManually(
                        `${conflict.productId}-${Date.now()}`,
                        conflict.recommendedResolution.selectedEntry.auditId,
                        'auto_latest'
                      );
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4 mr-2"/>
                  Auto-Resolve All (Use Latest)
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowConflictDialog(detectedConflicts[0])}
                >
                  Review Manually
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Conflict Resolution Dialog */}
      {showConflictDialog && (
        <Dialog open={!!showConflictDialog} onOpenChange={() => setShowConflictDialog(false)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Resolve Data Conflict</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="font-medium">{showConflictDialog.productName}</div>
                <div className="text-sm text-muted-foreground">SKU: {showConflictDialog.productSku}</div>
                <div className="text-sm text-red-700 mt-1">
                  This product appears in {showConflictDialog.entries.length} different audit sessions
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium">Select which data to keep:</div>
                {showConflictDialog.entries.map((entry, idx) => (
                  <div key={idx} className="border rounded-lg p-3 hover:bg-muted/30 cursor-pointer"
                       onClick={() => {
                         resolveConflictManually(
                           `${showConflictDialog.productId}-${Date.now()}`,
                           entry.auditId,
                           'manual_select'
                         );
                         setShowConflictDialog(false);
                       }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{entry.auditId}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.auditTime).toLocaleString()} • by {entry.operatorId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Device: {entry.deviceId} • Scanned: {entry.product.scannedCount}x
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {entry.product.actualCount !== null 
                            ? entry.product.actualCount 
                            : '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">Actual Count</div>
                        <div className="flex gap-1 mt-1">
                          {entry.product.actualCount !== null && (
                            <Badge variant="secondary" className="text-xs">Complete</Badge>
                          )}
                          {idx === 0 && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                              Latest
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {entry.product.discrepancy !== null && entry.product.discrepancy !== 0 && (
                      <div className="mt-2 text-sm">
                        <Badge variant={entry.product.discrepancy > 0 ? "default" : "destructive"}>
                          {entry.product.discrepancy > 0 ? '+' : ''}{entry.product.discrepancy} vs system
                        </Badge>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs bg-muted/50 p-2 rounded">
                      Priority Score: {getAuditPriorityScore(entry).toFixed(0)} 
                      {idx === 0 && <span className="text-green-600 ml-2">(Recommended)</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowConflictDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  resolveConflictManually(
                    `${showConflictDialog.productId}-${Date.now()}`,
                    showConflictDialog.recommendedResolution.selectedEntry.auditId,
                    'auto_recommended'
                  );
                  setShowConflictDialog(false);
                }}>
                  Use Recommended
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Offline Audits Pending Sync */}
      {offlineAudits.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <CloudOff className="h-5 w-5"/>
              Offline Audits Pending Sync
              {detectedConflicts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {detectedConflicts.length} conflicts
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {offlineAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <div className="font-medium">{audit.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {audit.scannedProducts?.length || 0} items • {audit.completion}% complete
                    </div>
                    {/* Show if this audit has conflicts */}
                    {detectedConflicts.some(conflict => 
                      conflict.entries.some(entry => entry.auditId === audit.id)
                    ) && (
                      <div className="text-xs text-red-600 font-medium mt-1">
                        Contains conflicting data
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {new Date(audit.endTime).toLocaleDateString()}
                    </Badge>
                    {detectedConflicts.some(conflict => 
                      conflict.entries.some(entry => entry.auditId === audit.id)
                    ) && (
                      <AlertOctagon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {conflictResolutions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-2">
                  Conflict Resolutions ({conflictResolutions.length})
                </div>
                {conflictResolutions.slice(-3).map((resolution, idx) => (
                  <div key={idx} className="text-xs text-blue-700">
                    Product {resolution.productId}: {resolution.strategy} • {new Date(resolution.resolvedAt).toLocaleTimeString()}
                  </div>
                ))}
                {conflictResolutions.length > 3 && (
                  <div className="text-xs text-blue-600 mt-1">
                    +{conflictResolutions.length - 3} more...
                  </div>
                )}
              </div>
            )}
            
            {isOnline && (
              <div className="mt-3 flex gap-2">
                {detectedConflicts.length > 0 ? (
                  <Button 
                    variant="destructive"
                    onClick={() => setShowConflictDialog(detectedConflicts[0])}
                  >
                    <AlertOctagon className="h-4 w-4 mr-2"/>
                    Resolve Conflicts First
                  </Button>
                ) : (
                  <Button onClick={manualSync} disabled={isAutomaticSyncing}>
                    <Cloud className={`h-4 w-4 mr-2 ${isAutomaticSyncing ? 'animate-pulse' : ''}`}/>
                    {isAutomaticSyncing ? 'Syncing...' : 'Sync Now'}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk Audit Progress */}
      {bulkScanMode && auditSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5"/>
              Bulk Audit Session: {auditSession.id}
              {!isOnline && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <WifiOff className="h-3 w-3 mr-1"/>
                  Offline Mode
                </Badge>
              )}
              {auditSession.forceStarted && (
                <Badge variant="destructive" className="text-white">
                  <AlertOctagon className="h-3 w-3 mr-1"/>
                  Force Started
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {auditProgress.scanned}/{auditProgress.total} items
                  </span>
                </div>
                <Progress value={(auditProgress.scanned / auditProgress.total) * 100} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{scannedItems.length}</div>
                  <div className="text-sm text-blue-600">Items Scanned</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">
                    {scannedItems.filter(item => item.scannedCount > 1).length}
                  </div>
                  <div className="text-sm text-orange-600">Duplicate Scans</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">
                    {scannedItems.filter(item => item.discrepancy !== null).length}
                  </div>
                  <div className="text-sm text-red-600">Discrepancies</div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Scan products quickly or use the scanner gun. 
                  {!isOnline && (
                    <span className="block mt-1 text-orange-600 font-medium">
                      Operating in offline mode - data will sync when online
                    </span>
                  )}
                  {scannedItems.length < demoProducts.length && (
                    <span className="block mt-1 font-medium">
                      {demoProducts.length - scannedItems.length} items remaining
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={bulkScanMode ? "audit" : "stock"}>
        <TabsList>
          {bulkScanMode && <TabsTrigger value="audit">Audit Session</TabsTrigger>}
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="expiry">Expiry</TabsTrigger>
        </TabsList>
        
        {bulkScanMode && (
          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Scanned Items ({scannedItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {scannedItems.length > 0 ? (
                  <div className="space-y-3">
                    {scannedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.sku} • System: {item.stock}
                            {item.scannedCount > 1 && (
                              <span className="text-orange-600 ml-2">
                                (Scanned {item.scannedCount}x)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Input
                              type="number"
                              placeholder="Actual"
                              value={item.actualCount || ""}
                              onChange={(e) => updateActualCount(item.id, e.target.value)}
                              className="w-20 text-center"
                            />
                          </div>
                          {item.discrepancy !== null && (
                            <Badge variant={item.discrepancy === 0 ? "secondary" : "destructive"}>
                              {item.discrepancy === 0 ? "✓" : `${item.discrepancy > 0 ? '+' : ''}${item.discrepancy}`}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {scannedItems.length === demoProducts.length && (
                      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="font-medium text-green-800">All items scanned!</div>
                        <div className="text-sm text-green-600">
                          Ready to complete audit {!isOnline && '(will sync when online)'}
                          {auditSession.forceStarted && (
                            <div className="text-xs text-orange-600 mt-1">
                              ⚠️ Force-started session - check for conflicts before finalizing
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <ScanLine className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <div>Start scanning items to begin audit</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="stock" className="mt-4">
          <DataTable columns={[{key:"sku",label:"SKU"},{key:"name",label:"Product"},{key:"stock",label:"Qty"},{key:"min",label:"Reorder"},{key:"batch",label:"Batch"},{key:"barcode",label:"Barcode"},{key:"expiry",label:"Expiry"}]} data={demoProducts} />
        </TabsContent>
        <TabsContent value="movements" className="mt-4">
          <DataTable columns={[{key:"id",label:"#"},{key:"product",label:"Product"},{key:"qty",label:"Qty"},{key:"type",label:"Type"},{key:"at",label:"Date"}]} data={[
            {id:1,product:"Paracetamol 500mg",qty:+50,type:"Purchase",at:"2025-08-01"},
            {id:2,product:"Paracetamol 500mg",qty:-5,type:"Sale",at:"2025-08-02"},
          ]} />
        </TabsContent>
        <TabsContent value="expiry" className="mt-4">
          <DataTable columns={[{key:"product",label:"Product"},{key:"batch",label:"Batch"},{key:"expiry",label:"Expiry"},{key:"days",label:"Days Left"}]} data={[
            {id:1,product:"Amoxicillin 250mg",batch:"AMX92",expiry:"2025-12-15",days:116},
          ]} />
        </TabsContent>
      </Tabs>

      {/* Audit Completion Summary */}
      {auditSession && auditSession.endTime && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600"/>
              Audit Summary: {auditSession.id}
              {auditSession.syncStatus === 'pending' && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <CloudOff className="h-3 w-3 mr-1"/>
                  Pending Sync
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{auditSession.completion}%</div>
                <div className="text-sm text-blue-600">Completion</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{scannedItems.length}</div>
                <div className="text-sm text-green-600">Items Counted</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">{auditSession.missedProducts?.length || 0}</div>
                <div className="text-sm text-orange-600">Items Missed</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {scannedItems.filter(item => item.discrepancy !== null && item.discrepancy !== 0).length}
                </div>
                <div className="text-sm text-red-600">Discrepancies</div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button onClick={() => alert("Audit report generated (demo)")}>
                <Download className="h-4 w-4 mr-2"/>
                Export Report
              </Button>
              <Button variant="outline" onClick={() => setAuditSession(null)}>
                <X className="h-4 w-4 mr-2"/>
                Close Summary
              </Button>
              {auditSession.syncStatus === 'pending' && isOnline && (
                <Button variant="outline" onClick={manualSync} disabled={isAutomaticSyncing}>
                  <Cloud className={`h-4 w-4 mr-2 ${isAutomaticSyncing ? 'animate-pulse' : ''}`}/>
                  Sync to Server
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Purchases() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Truck} title="Purchases" cta={<Button><Plus className="h-4 w-4 mr-2"/>New GRN</Button>} />
      <DataTable columns={[{key:"id",label:"GRN #"},{key:"supplier",label:"Supplier"},{key:"items",label:"Items"},{key:"total",label:"Total"},{key:"date",label:"Date"}]} data={[
        {id:"GRN-1021",supplier:"Kabul Med Distributors",items:12,total:"78,500 AFN",date:"2025-08-15"},
      ]} />
    </div>
  );
}

function Sales() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Receipt} title="Sales Invoices" />
      <DataTable columns={[{key:"id",label:"Invoice #"},{key:"customer",label:"Customer"},{key:"items",label:"Items"},{key:"total",label:"Total"},{key:"date",label:"Date"}]} data={[
        {id:"INV-5501",customer:"Walk-in",items:4,total:"550 AFN",date:"2025-08-21"},
      ]} />
    </div>
  );
}

function Customers() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={UserCircle2} title="Customers" cta={<Button><Plus className="h-4 w-4 mr-2"/>New Customer</Button>} />
      <DataTable columns={[{key:"name",label:"Name"},{key:"phone",label:"Phone"},{key:"balance",label:"Balance"}]} data={[
        {id:1,name:"Walk-in",phone:"-",balance:0},
        {id:2,name:"Dr. Ahmad Clinic",phone:"0700 000 000",balance:1200},
      ]} />
    </div>
  );
}

function Prescriptions() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={ClipboardList} title="Prescriptions" cta={<Button><Plus className="h-4 w-4 mr-2"/>New Rx</Button>} />
      <DataTable columns={[{key:"id",label:"Rx #"},{key:"doctor",label:"Doctor"},{key:"patient",label:"Patient"},{key:"date",label:"Date"}]} data={[
        {id:"RX-1012",doctor:"Dr. Khan",patient:"Zabi",date:"2025-08-19"},
      ]} />
    </div>
  );
}

function Returns() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={ArrowLeftRight} title="Returns" />
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Returns</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="mt-4">
          <DataTable columns={[{key:"id",label:"Return #"},{key:"ref",label:"Invoice #"},{key:"items",label:"Items"},{key:"amount",label:"Amount"},{key:"date",label:"Date"}]} data={[]} />
        </TabsContent>
        <TabsContent value="purchase" className="mt-4">
          <DataTable columns={[{key:"id",label:"Return #"},{key:"ref",label:"GRN #"},{key:"items",label:"Items"},{key:"amount",label:"Amount"},{key:"date",label:"Date"}]} data={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Reports() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={FileBarChart2} title="Reports" />
      <div className="grid md:grid-cols-3 gap-3">
        {[
          {icon:FileText,title:"Sales Report",desc:"By day, product, customer"},
          {icon:FileText,title:"Profit & Loss",desc:"Margins, discounts, tax"},
          {icon:FileText,title:"Inventory Valuation",desc:"FIFO/Avg cost"},
          {icon:CalendarClock,title:"Expiry Report",desc:"Expiring & expired"},
          {icon:FileText,title:"Purchase Report",desc:"Supplier-wise"},
          {icon:FileText,title:"Tax Report",desc:"VAT summary"},
        ].map((r,i)=> (
          <Card key={i} className="hover:shadow">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><r.icon className="h-4 w-4"/>{r.title}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{r.desc}</div>
              <div className="flex justify-end mt-3"><Button variant="outline">View</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Accounting() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={BadgeDollarSign} title="Accounting" />
      <Tabs defaultValue="cash">
        <TabsList>
          <TabsTrigger value="cash">Cashbook</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="dues">Dues</TabsTrigger>
        </TabsList>
        <TabsContent value="cash" className="mt-4">
          <DataTable columns={[{key:"id",label:"Txn #"},{key:"type",label:"Type"},{key:"amount",label:"Amount"},{key:"ref",label:"Ref"},{key:"date",label:"Date"}]} data={[
            {id:1,type:"Sale",amount:"550 AFN",ref:"INV-5501",date:"2025-08-21"}
          ]} />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <DataTable columns={[{key:"id",label:"Payment #"},{key:"party",label:"Party"},{key:"amount",label:"Amount"},{key:"mode",label:"Mode"},{key:"date",label:"Date"}]} data={[]} />
        </TabsContent>
        <TabsContent value="dues" className="mt-4">
          <DataTable columns={[{key:"party",label:"Party"},{key:"type",label:"Type"},{key:"balance",label:"Balance"}]} data={[
            {id:1,party:"Herat Pharma Supply",type:"Supplier",balance:"78,000 AFN"}
          ]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsPage() {
  const { t } = useTranslation();
  const { language, direction, isRTL, invoiceLanguage, changeLanguage, setDirection, setInvoiceLanguage, getLanguageName } = useLanguage();
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleLanguageChange = (lng) => {
    changeLanguage(lng);
    setFeedbackMessage(t('settings.languageChanged', { language: getLanguageName(lng) }));
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleDirectionChange = (dir) => {
    setDirection(dir);
    setFeedbackMessage(t('settings.directionChanged', { direction: dir === 'rtl' ? t('settings.rightToLeft') : t('settings.leftToRight') }));
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Settings} title={t('settings.title')} />
      
      {/* Feedback Message */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-3 rounded-lg border bg-green-50 border-green-200 text-green-800 flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{feedbackMessage}</span>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>{t('settings.organization')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder={t('settings.pharmacyName')} defaultValue="ZamPharm"/>
            <Input placeholder={t('settings.tinTaxId')}/>
            <Input placeholder={t('common.address')}/>
            <div className="flex items-center justify-between">
              <Label>{t('settings.enableVat')}</Label>
              <Switch defaultChecked/>
            </div>
            <Button><Save className="h-4 w-4 mr-2"/>{t('common.save')}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('settings.language')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.selectLanguage')}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fa">فارسی (Dari)</SelectItem>
                  <SelectItem value="ps">پښتو (Pashto)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('settings.layoutDirection')}</Label>
              <Select value={direction} onValueChange={handleDirectionChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ltr">{t('settings.leftToRight')}</SelectItem>
                  <SelectItem value="rtl">{t('settings.rightToLeft')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('settings.invoiceLanguage')}</Label>
              <Select value={invoiceLanguage} onValueChange={setInvoiceLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('settings.englishOnly')}</SelectItem>
                  <SelectItem value="local">{t('settings.localOnly', { language: getLanguageName(language) })}</SelectItem>
                  <SelectItem value="dual">{t('settings.dualLanguage', { language: getLanguageName(language) })}</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                {t('receipt.regulatoryInfo')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('settings.usersRoles')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{t('settings.cashier')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.cashierDesc')}</div>
              </div>
              <Checkbox defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{t('settings.inventoryManager')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.inventoryManagerDesc')}</div>
              </div>
              <Checkbox defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{t('settings.admin')}</div>
                <div className="text-xs text-muted-foreground">{t('settings.adminDesc')}</div>
              </div>
              <Checkbox defaultChecked/>
            </div>
            <Button variant="outline">{t('settings.manageRoles')}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('settings.branches')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input placeholder={t('settings.newBranchName')}/>
              <Button><Plus className="h-4 w-4 mr-1"/>{t('common.add')}</Button>
            </div>
            <div className="text-sm text-muted-foreground">{t('settings.mainKabul')} • {t('common.active')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('settings.integrations')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">{t('settings.barcodePrinter')}</div>
              <Switch defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">{t('settings.thermalReceiptPrinter')}</div>
              <Switch defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">{t('settings.smsGateway')}</div>
              <Switch/>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Alerts() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Bell} title="System Alerts" />
      <DataTable columns={[{key:"type",label:"Type"},{key:"message",label:"Message"},{key:"severity",label:"Severity"}]} data={demoAlerts} />
    </div>
  );
}

function Audit() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={ShieldCheck} title="Audit Log" />
      <DataTable columns={[{key:"id",label:"#"},{key:"who",label:"User"},{key:"action",label:"Action"},{key:"at",label:"At"}]} data={[
        {id:1,who:"admin",action:"Updated product Paracetamol 500mg",at:"2025-08-21 14:21"},
      ]} />
    </div>
  );
}

const RouteView = ({ route }) => {
  switch (route) {
    case "dashboard":
      return <Dashboard/>;
    case "pos":
      return <POS/>;
    case "products":
      return <Products/>;
    case "inventory":
      return <Inventory/>;
    case "purchases":
      return <Purchases/>;
    case "sales":
      return <Sales/>;
    case "suppliers":
      return <Suppliers/>;
    case "companies":
      return <Companies/>;
    case "customers":
      return <Customers/>;
    case "prescriptions":
      return <Prescriptions/>;
    case "returns":
      return <Returns/>;
    case "reports":
      return <Reports/>;
    case "accounting":
      return <Accounting/>;
    case "settings":
      return <SettingsPage/>;
    case "alerts":
      return <Alerts/>;
    case "audit":
      return <Audit/>;
    default:
      return <Dashboard/>;
  }
};

function App() {
  const [route, setRoute] = useState("dashboard");
  const { isOnline } = useNetworkStatus();
  const { isRTL } = useLanguage();
  
  return (
    <div className={`h-screen w-full bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex h-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <Sidebar current={route} setCurrent={setRoute}/>
        <div className="flex-1 flex flex-col">
          <Topbar/>
          <AnimatePresence mode="wait">
            <motion.main key={route} initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.15}} className="flex-1 overflow-y-auto">
              <RouteView route={route}/>
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Offline indicator overlay */}
      {!isOnline && (
        <div className={`fixed bottom-4 ${isRTL ? 'right-4 left-4 md:right-72 md:left-auto' : 'left-4 right-4 md:left-72 md:right-auto'} md:max-w-sm z-50`}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-orange-100 ${isRTL ? 'border-r-4' : 'border-l-4'} border-orange-500 p-3 rounded-lg shadow-lg`}
          >
            <div className="flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium text-orange-800">Working Offline</div>
                <div className="text-sm text-orange-700">Data will sync when connection returns</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App