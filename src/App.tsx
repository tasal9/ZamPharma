import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
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
  EyeOff,
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
  Lock,
  Unlock,
  Key,
  UserPlus,
  LogOut,
  LogIn,
  Shield,
  Activity,
  Clock,
  MapPin,
  Tag,
  QrCode,
  ArrowRightLeft,
  AlertTriangle,
  FileDown,
  FileSpreadsheet,
  Stethoscope,
  Clipboard,
  DollarSign,
  Ban,
  RotateCcw,
  History,
  Menu,
  TrendingUp,
  PieChart as PieChartIcon,
  Loader2,
  User2,
  UserCog,
  Moon,
  Sun,
  Barcode,
  ClipboardCheck,
  Hash,
  Minus,
  Calculator,
  FileCheck,
  PackageCheck,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Dark Mode Hook
function useDarkMode() {
  const [isDark, setIsDark] = useKV('dark-mode', false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return { isDark, setIsDark, toggleDarkMode };
}

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
    setLanguage: changeLanguage,
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

type AuditEntry = {
  auditId: string;
  auditTime: string;
  product: any;
  operatorId?: string;
  deviceId?: string;
};

type AuditConflict = {
  productId: number;
  productName: string;
  productSku: string;
  conflictType: string;
  entries: AuditEntry[];
  recommendedResolution: {
    type: string;
    selectedEntry: AuditEntry;
    reason: string;
  };
};

type AuditResolution = {
  conflictId: string;
  productId: number;
  resolutionType: string;
  strategy: string;
  selectedAudit: string;
  resolvedAt: string;
  discardedAudits?: string[];
  operatorId?: string;
};

// Conflict resolution for overlapping audit data
function resolveAuditConflicts(audits: any[]) {
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
conflicts.forEach((conflict) => {
  resolutions.push({
    conflictId: `${conflict.productId}-${Date.now()}`,
    productId: conflict.productId,
    resolutionType: 'automatic',
    strategy: 'latest_wins',
    selectedAudit: conflict.recommendedResolution.selectedEntry.auditId,
    resolvedAt: new Date().toISOString(),
    discardedAudits: conflict.entries.slice(1).map((e) => e.auditId)
  });
});
  
  return { conflicts, resolutions };
}

// Merge audit data with conflict resolution
function mergeAuditData(audits: any[], resolutions: AuditResolution[]) {
  const mergedData: Record<number, any> = {};
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

// New demo data for remaining features
const demoUsers = [
  { id: 1, username: "admin", name: "System Admin", role: "admin", email: "admin@zampharm.af", lastLogin: "2026-02-04 09:30", status: "active", permissions: ["all"] },
  { id: 2, username: "ahmad", name: "Ahmad Khan", role: "manager", email: "ahmad@zampharm.af", lastLogin: "2026-02-04 08:15", status: "active", permissions: ["pos_access", "inventory_manage", "reports_view"] },
  { id: 3, username: "fatima", name: "Fatima Rahimi", role: "cashier", email: "fatima@zampharm.af", lastLogin: "2026-02-03 17:00", status: "active", permissions: ["pos_access"] },
  { id: 4, username: "karim", name: "Karim Ahmadi", role: "inventory", email: "karim@zampharm.af", lastLogin: "2026-02-04 07:45", status: "active", permissions: ["inventory_manage", "products_manage"] },
];

const demoAuditLogs = [
  { id: 1, userId: 1, username: "admin", action: "LOGIN", details: "Successful login", timestamp: "2026-02-04 09:30:00", ipAddress: "192.168.1.100" },
  { id: 2, userId: 2, username: "ahmad", action: "SALE", details: "Invoice INV-5502 created - AFN 1,250", timestamp: "2026-02-04 10:15:00", ipAddress: "192.168.1.101" },
  { id: 3, userId: 3, username: "fatima", action: "STOCK_ADJUSTMENT", details: "Paracetamol 500mg - Qty adjusted by -5", timestamp: "2026-02-04 11:00:00", ipAddress: "192.168.1.102" },
  { id: 4, userId: 1, username: "admin", action: "USER_CREATED", details: "New user 'karim' created", timestamp: "2026-02-04 08:00:00", ipAddress: "192.168.1.100" },
];

const demoPurchases = [
  { id: 1, grnNumber: "GRN-1021", supplier: "Kabul Med Distributors", supplierInvoice: "KMD-2026-445", invoiceDate: "2026-02-01", receivedDate: "2026-02-03", items: 12, totalAmount: 78500, paymentStatus: "partial", paidAmount: 50000 },
  { id: 2, grnNumber: "GRN-1022", supplier: "Herat Pharma Supply", supplierInvoice: "HPS-887", invoiceDate: "2026-01-28", receivedDate: "2026-01-30", items: 8, totalAmount: 45000, paymentStatus: "paid", paidAmount: 45000 },
  { id: 3, grnNumber: "GRN-1023", supplier: "Kabul Med Distributors", supplierInvoice: "KMD-2026-450", invoiceDate: "2026-02-03", receivedDate: "2026-02-04", items: 5, totalAmount: 32000, paymentStatus: "unpaid", paidAmount: 0 },
];

const demoPurchaseItems = [
  { id: 1, purchaseId: 1, productId: 1, productName: "Paracetamol 500mg", quantity: 500, unitCost: 35, totalCost: 17500, batch: "B24A", expiry: "2027-02-01" },
  { id: 2, purchaseId: 1, productId: 2, productName: "Amoxicillin 250mg", quantity: 200, unitCost: 150, totalCost: 30000, batch: "AMX95", expiry: "2026-12-15" },
];

const demoCustomers = [
  { id: 1, name: "Walk-in", phone: "-", email: "-", address: "-", balance: 0, creditLimit: 0, totalPurchases: 125000, lastPurchase: "2026-02-04" },
  { id: 2, name: "Dr. Ahmad Clinic", phone: "0700 000 001", email: "clinic@ahmad.af", address: "Karte-4, Kabul", balance: 12500, creditLimit: 50000, totalPurchases: 450000, lastPurchase: "2026-02-03" },
  { id: 3, name: "Rahimi Hospital", phone: "0700 000 002", email: "pharmacy@rahimi.af", address: "Shahr-e-Naw, Kabul", balance: 35000, creditLimit: 100000, totalPurchases: 890000, lastPurchase: "2026-02-01" },
  { id: 4, name: "Mohammad Akbar", phone: "0700 000 003", email: "akbar@email.af", address: "Taimani, Kabul", balance: 500, creditLimit: 5000, totalPurchases: 8500, lastPurchase: "2026-01-28" },
];

const demoCustomerPayments = [
  { id: 1, customerId: 2, amount: 25000, method: "cash", date: "2026-02-01", reference: "PAY-001" },
  { id: 2, customerId: 3, amount: 50000, method: "bank", date: "2026-01-30", reference: "PAY-002" },
];

const demoPrescriptions = [
  { id: 1, rxNumber: "RX-1012", doctorName: "Dr. Khan", patientName: "Zabi Ahmad", patientPhone: "0700 111 222", diagnosis: "Fever & Cold", date: "2026-02-04", status: "pending", medications: [
    { productId: 1, productName: "Paracetamol 500mg", dosage: "500mg", frequency: "3x daily", duration: "5 days", quantity: 15 },
    { productId: 2, productName: "Amoxicillin 250mg", dosage: "250mg", frequency: "2x daily", duration: "7 days", quantity: 14 }
  ]},
  { id: 2, rxNumber: "RX-1013", doctorName: "Dr. Rahimi", patientName: "Fatima Karimi", patientPhone: "0700 333 444", diagnosis: "Dehydration", date: "2026-02-03", status: "dispensed", medications: [
    { productId: 3, productName: "ORS Sachet", dosage: "1 sachet", frequency: "After each stool", duration: "As needed", quantity: 20 }
  ]},
];

const demoSalesReturns = [
  { id: 1, returnNumber: "SR-001", originalInvoice: "INV-5499", customer: "Walk-in", returnDate: "2026-02-03", reason: "damaged", items: 2, refundAmount: 320, status: "approved" },
  { id: 2, returnNumber: "SR-002", originalInvoice: "INV-5501", customer: "Dr. Ahmad Clinic", returnDate: "2026-02-04", reason: "wrongProduct", items: 1, refundAmount: 180, status: "pending" },
];

const demoPurchaseReturns = [
  { id: 1, returnNumber: "PR-001", originalGrn: "GRN-1020", supplier: "Kabul Med Distributors", returnDate: "2026-02-02", reason: "expired", items: 5, refundAmount: 2500, status: "approved" },
];

const demoBranches = [
  { id: 1, name: "Main Kabul", address: "Shahr-e-Naw, Kabul", phone: "+93 700 000 000", isMain: true, status: "active" },
  { id: 2, name: "Mazar Branch", address: "Central Market, Mazar-i-Sharif", phone: "+93 700 111 111", isMain: false, status: "active" },
  { id: 3, name: "Herat Branch", address: "New City, Herat", phone: "+93 700 222 222", isMain: false, status: "active" },
];

const demoStockTransfers = [
  { id: 1, transferNumber: "TR-001", fromBranch: "Main Kabul", toBranch: "Mazar Branch", transferDate: "2026-02-01", items: 15, status: "received" },
  { id: 2, transferNumber: "TR-002", fromBranch: "Main Kabul", toBranch: "Herat Branch", transferDate: "2026-02-03", items: 8, status: "inTransit" },
];

const demoOfflineQueue = [
  { id: 1, type: "SALE", data: { invoiceId: "INV-OFFLINE-001", total: 450 }, queuedAt: "2026-02-04 10:30:00", status: "queued" },
  { id: 2, type: "STOCK_ADJUSTMENT", data: { productId: 1, adjustment: -3 }, queuedAt: "2026-02-04 10:32:00", status: "queued" },
];

// Auth context and hooks
const AuthContext = React.createContext(null);

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    // Return default auth state if no provider
    return {
      user: demoUsers[0],
      isAuthenticated: true,
      login: () => {},
      logout: () => {},
      hasPermission: () => true,
    };
  }
  return context;
}

function AuthProvider({ children }) {
  const [user, setUser] = useKV('current-user', demoUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useKV('is-authenticated', true);
  const [auditLogs, setAuditLogs] = useKV('audit-logs', demoAuditLogs);

  const login = useCallback((username, password) => {
    const foundUser = demoUsers.find(u => u.username === username);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      // Add audit log
      const newLog = {
        id: auditLogs.length + 1,
        userId: foundUser.id,
        username: foundUser.username,
        action: "LOGIN",
        details: "Successful login",
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.100"
      };
      setAuditLogs([newLog, ...auditLogs]);
      return true;
    }
    return false;
  }, [auditLogs, setAuditLogs, setUser, setIsAuthenticated]);

  const logout = useCallback(() => {
    if (user) {
      const newLog = {
        id: auditLogs.length + 1,
        userId: user.id,
        username: user.username,
        action: "LOGOUT",
        details: "User logged out",
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.100"
      };
      setAuditLogs([newLog, ...auditLogs]);
    }
    setUser(null);
    setIsAuthenticated(false);
  }, [user, auditLogs, setAuditLogs, setUser, setIsAuthenticated]);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (user.role === 'admin' || user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  }, [user]);

  const logAction = useCallback((action, details) => {
    if (user) {
      const newLog = {
        id: auditLogs.length + 1,
        userId: user.id,
        username: user.username,
        action,
        details,
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.100"
      };
      setAuditLogs([newLog, ...auditLogs]);
    }
  }, [user, auditLogs, setAuditLogs]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission, logAction, auditLogs }}>
      {children}
    </AuthContext.Provider>
  );
}

// Offline transaction queue hook
function useOfflineQueue() {
  const [queue, setQueue] = useKV('offline-transaction-queue', []);
  const { isOnline } = useNetworkStatus();

  const addToQueue = useCallback((type, data) => {
    const newItem = {
      id: Date.now(),
      type,
      data,
      queuedAt: new Date().toISOString(),
      status: 'queued'
    };
    setQueue(prev => [...prev, newItem]);
    return newItem.id;
  }, [setQueue]);

  const processQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0) return;

    const updatedQueue = [...queue];
    for (let i = 0; i < updatedQueue.length; i++) {
      if (updatedQueue[i].status === 'queued') {
        updatedQueue[i].status = 'syncing';
        setQueue(updatedQueue);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        updatedQueue[i].status = 'synced';
        setQueue(updatedQueue);
      }
    }
    
    // Remove synced items after processing
    setQueue(queue.filter(item => item.status !== 'synced'));
  }, [isOnline, queue, setQueue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, [setQueue]);

  const retryFailed = useCallback(() => {
    setQueue(queue.map(item => 
      item.status === 'failed' ? { ...item, status: 'queued' } : item
    ));
  }, [queue, setQueue]);

  // Auto-process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.some(item => item.status === 'queued')) {
      processQueue();
    }
  }, [isOnline]);

  return { queue, addToQueue, processQueue, clearQueue, retryFailed, pendingCount: queue.filter(i => i.status === 'queued').length };
}

// Expiry check utility
function checkProductExpiry(product) {
  if (!product.expiry) return { status: 'ok', daysUntil: null };
  
  const expiryDate = new Date(product.expiry);
  const today = new Date();
  const daysUntil = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntil < 0) return { status: 'expired', daysUntil };
  if (daysUntil <= 30) return { status: 'expiringSoon', daysUntil };
  return { status: 'ok', daysUntil };
}

// Export utilities
function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

function exportToJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}


function Sidebar({ current, setCurrent, user, onLogout }: { current: string; setCurrent: (v: string) => void; user?: any; onLogout?: () => void }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const routes = [
    { key: "dashboard", icon: LayoutGrid },
    { key: "pos", icon: ShoppingCart },
    { key: "products", icon: Package },
    { key: "inventory", icon: Boxes },
    { key: "stocktake", icon: ClipboardCheck },
    { key: "purchases", icon: Truck },
    { key: "sales", icon: Receipt },
    { key: "suppliers", icon: Users },
    { key: "companies", icon: Factory },
    { key: "customers", icon: UserCircle2 },
    { key: "prescriptions", icon: ClipboardList },
    { key: "returns", icon: ArrowLeftRight },
    { key: "reports", icon: FileBarChart2 },
    { key: "accounting", icon: BadgeDollarSign },
    { key: "branches", icon: Building2 },
    { key: "users", icon: Shield },
    { key: "labels", icon: Tag },
    { key: "barcodes", icon: Barcode },
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
      <ScrollArea className="flex-1 p-2">
        {routes.map((r) => (
          <button key={r.key} onClick={() => setCurrent(r.key)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted ${current===r.key?"bg-muted font-semibold":""} ${isRTL ? 'text-right' : 'text-left'}`}>
            <r.icon className="h-4 w-4"/>
            {t(`nav.${r.key}`)}
          </button>
        ))}
      </ScrollArea>
      <div className="p-4 border-t space-y-3">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                {user.role === 'admin' && <Shield className="h-3 w-3" />}
                {user.role}
              </div>
            </div>
            {onLogout && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogout}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign Out</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        <Card className="bg-muted/50">
          <CardContent className="p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground flex items-center gap-2">
              <Store className="h-4 w-4"/> {t('common.branch')}
            </div>
            <div className="mt-1 pl-6">{t('settings.mainKabul')}</div>
            <div className="mt-2 text-[10px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {t('sidebar.lastSync', { time: '3m' })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Topbar({ user, onOpenCommand }: { user?: any; onOpenCommand?: () => void }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isDark, toggleDarkMode } = useDarkMode();
  
  return (
    <div className="h-16 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button 
          variant="outline" 
          className="w-full md:w-80 justify-start text-muted-foreground"
          onClick={onOpenCommand}
        >
          <Search className="h-4 w-4 mr-2"/>
          <span className="flex-1 text-left">{t('topbar.quickSearch')}</span>
          <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Ctrl+K
          </kbd>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDark ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5"/>
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center">2</span>
            </Button>
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
            <Button variant="outline" className="gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user?.name || 'User'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>{t('topbar.profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('topbar.switchBranch')}</DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="text-red-600">
              <LogOut className="h-4 w-4 mr-2"/>{t('topbar.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Dashboard() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Sales data for the past 7 days
  const salesData = [
    { day: 'Mon', sales: 18500, invoices: 24 },
    { day: 'Tue', sales: 22300, invoices: 31 },
    { day: 'Wed', sales: 19800, invoices: 28 },
    { day: 'Thu', sales: 25600, invoices: 35 },
    { day: 'Fri', sales: 31200, invoices: 42 },
    { day: 'Sat', sales: 28400, invoices: 38 },
    { day: 'Sun', sales: 12500, invoices: 18 },
  ];

  // Category breakdown
  const categoryData = [
    { name: 'Tablets', value: 45, fill: 'hsl(var(--chart-1))' },
    { name: 'Capsules', value: 25, fill: 'hsl(var(--chart-2))' },
    { name: 'Syrups', value: 15, fill: 'hsl(var(--chart-3))' },
    { name: 'Injections', value: 10, fill: 'hsl(var(--chart-4))' },
    { name: 'Others', value: 5, fill: 'hsl(var(--chart-5))' },
  ];

  // Stock level data
  const stockData = demoProducts.map(p => ({
    name: p.name.split(' ')[0],
    stock: p.stock,
    min: p.min,
    fill: p.stock < p.min ? 'hsl(var(--destructive))' : p.stock < p.min * 1.5 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))'
  }));

  // Recent transactions
  const recentTransactions = [
    { id: 'INV-5504', customer: 'Walk-in', amount: 450, time: '10:30 AM', type: 'sale' },
    { id: 'INV-5503', customer: 'Dr. Ahmad Clinic', amount: 1250, time: '10:15 AM', type: 'sale' },
    { id: 'GRN-1024', customer: 'Kabul Med Distributors', amount: 32000, time: '09:45 AM', type: 'purchase' },
    { id: 'INV-5502', customer: 'Walk-in', amount: 180, time: '09:30 AM', type: 'sale' },
    { id: 'SR-003', customer: 'Walk-in', amount: -120, time: '09:00 AM', type: 'return' },
  ];

  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
  const totalInvoices = salesData.reduce((sum, d) => sum + d.invoices, 0);
  const avgSale = Math.round(totalSales / totalInvoices);

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={LayoutGrid} 
        title={t('dashboard.title')} 
        extra={
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">{t('dashboard.today')} • {new Date().toDateString()}</div>
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2"/>Refresh
            </Button>
          </div>
        } 
      />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4"/>{t('dashboard.sales')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AFN {totalSales.toLocaleString()}</div>
            <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3"/>+12.5% vs last week
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4"/>{t('dashboard.invoices')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <div className="text-xs text-muted-foreground mt-1">Avg: AFN {avgSale.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4"/>{t('dashboard.lowStock')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <div className="text-xs text-orange-600 mt-1">Needs attention</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarClock className="h-4 w-4"/>{t('dashboard.expiring')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">10</div>
            <div className="text-xs text-red-600 mt-1">Within 30 days</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5"/>Weekly Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <SalesChart data={salesData} />
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5"/>Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <CategoryChart data={categoryData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stock Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5"/>Stock Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoProducts.map((p) => {
              const percentage = Math.min(100, (p.stock / (p.min * 3)) * 100);
              const isLow = p.stock < p.min;
              const isWarning = p.stock < p.min * 1.5;
              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{p.name}</span>
                    <span className={`font-medium ${isLow ? 'text-red-600' : isWarning ? 'text-orange-600' : ''}`}>
                      {p.stock} / {p.min * 3}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${isLow ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-orange-500' : ''}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5"/>Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      tx.type === 'sale' ? 'bg-green-100 text-green-600' :
                      tx.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {tx.type === 'sale' ? <Receipt className="h-4 w-4"/> :
                       tx.type === 'purchase' ? <Truck className="h-4 w-4"/> :
                       <ArrowLeftRight className="h-4 w-4"/>}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{tx.id}</div>
                      <div className="text-xs text-muted-foreground">{tx.customer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${tx.amount < 0 ? 'text-red-600' : ''}`}>
                      {tx.amount < 0 ? '-' : '+'}{Math.abs(tx.amount).toLocaleString()} AFN
                    </div>
                    <div className="text-xs text-muted-foreground">{tx.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5"/>{t('dashboard.alerts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAlerts.map((a) => (
              <div key={a.id} className={`p-3 rounded-xl border flex items-start gap-2 ${
                a.severity === 'high' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
              }`}>
                <AlertOctagon className={`h-4 w-4 mt-0.5 ${a.severity === 'high' ? 'text-red-600' : 'text-orange-600'}`}/>
                <div>
                  <div className="text-sm font-medium capitalize">{t(`alerts.${a.type}`)}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.type === 'expiry' ? t('alerts.expiringItems', { count: 10 }) : t('alerts.lowStockItems', { count: 7 })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Quick Actions */}
            <Separator className="my-3"/>
            <div className="text-sm font-medium mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <ShoppingCart className="h-4 w-4 mr-2"/>New Sale
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Truck className="h-4 w-4 mr-2"/>New GRN
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <ClipboardList className="h-4 w-4 mr-2"/>New Rx
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <FileBarChart2 className="h-4 w-4 mr-2"/>Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple chart components using divs (no external dependency)
function SalesChart({ data }) {
  const maxSales = Math.max(...data.map(d => d.sales));
  
  return (
    <div className="h-full flex items-end justify-between gap-2 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="text-xs font-medium">{(d.sales / 1000).toFixed(0)}k</div>
          <div 
            className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
            style={{ height: `${(d.sales / maxSales) * 180}px` }}
          />
          <div className="text-xs text-muted-foreground">{d.day}</div>
        </div>
      ))}
    </div>
  );
}

function CategoryChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;
  
  return (
    <div className="flex items-center gap-8">
      {/* Donut Chart */}
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {data.map((d, i) => {
            const percent = d.value / total;
            const startAngle = cumulativePercent * 360;
            cumulativePercent += percent;
            const endAngle = cumulativePercent * 360;
            
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 80 + 60 * Math.cos(startRad);
            const y1 = 80 + 60 * Math.sin(startRad);
            const x2 = 80 + 60 * Math.cos(endRad);
            const y2 = 80 + 60 * Math.sin(endRad);
            
            const largeArcFlag = percent > 0.5 ? 1 : 0;
            
            return (
              <path
                key={i}
                d={`M 80 80 L ${x1} ${y1} A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={`hsl(${i * 60}, 70%, 50%)`}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="80" cy="80" r="35" fill="white" className="dark:fill-background" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}%</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: `hsl(${i * 60}, 70%, 50%)` }}
            />
            <span>{d.name}</span>
            <span className="text-muted-foreground ml-auto">{d.value}%</span>
          </div>
        ))}
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
  const [expiryWarning, setExpiryWarning] = useState(null);
  const [pendingProduct, setPendingProduct] = useState(null);
  const { addToQueue } = useOfflineQueue();
  const { isOnline } = useNetworkStatus();

  // Barcode scanner integration
  const handleBarcodeScan = (barcode) => {
    const product = demoProducts.find(p => 
      p.barcode === barcode || 
      p.sku.toLowerCase() === barcode.toLowerCase()
    );
    
    if (product) {
      // Check expiry before adding
      const expiryStatus = checkProductExpiry(product);
      
      if (expiryStatus.status === 'expired') {
        setScanFeedback({ type: 'error', message: t('expiryWarning.expired') });
        setExpiryWarning({
          product,
          status: 'expired',
          message: t('expiryWarning.cannotSell')
        });
        return;
      }
      
      if (expiryStatus.status === 'expiringSoon') {
        setPendingProduct(product);
        setExpiryWarning({
          product,
          status: 'expiringSoon',
          daysUntil: expiryStatus.daysUntil,
          message: t('expiryWarning.expiringSoon', { date: product.expiry })
        });
        return;
      }
      
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

  const confirmExpiryProduct = () => {
    if (pendingProduct) {
      addToCart(pendingProduct);
      setScanFeedback({ type: 'success', message: t('pos.addedToCart', { product: pendingProduct.name }) });
      setScan("");
    }
    setExpiryWarning(null);
    setPendingProduct(null);
  };

  const cancelExpiryProduct = () => {
    setExpiryWarning(null);
    setPendingProduct(null);
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
    
    // If offline, add to queue
    if (!isOnline) {
      addToQueue('SALE', { 
        invoiceId, 
        cart: [...cart], 
        customer,
        total: cart.reduce((s, i) => s + i.qty * i.price, 0)
      });
    }
    
    setShowReceipt(true);
    setCart([]);
  };

  // Check for expired items in product display
  const getProductExpiryBadge = (product) => {
    const status = checkProductExpiry(product);
    if (status.status === 'expired') {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (status.status === 'expiringSoon') {
      return <Badge variant="secondary">{status.daysUntil}d left</Badge>;
    }
    return null;
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

      {/* Expiry Warning Dialog */}
      <Dialog open={!!expiryWarning} onOpenChange={() => { setExpiryWarning(null); setPendingProduct(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5"/>
              {t('expiryWarning.title')}
            </DialogTitle>
          </DialogHeader>
          {expiryWarning && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="font-medium">{expiryWarning.product?.name}</div>
                <div className="text-sm text-muted-foreground">
                  Batch: {expiryWarning.product?.batch} • Expiry: {expiryWarning.product?.expiry}
                </div>
                <div className="mt-2 text-orange-700">{expiryWarning.message}</div>
              </div>
              
              {expiryWarning.status === 'expired' ? (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={cancelExpiryProduct}>
                    {t('common.close')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{t('expiryWarning.confirmSale')}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={cancelExpiryProduct}>
                      <Ban className="h-4 w-4 mr-2"/>{t('expiryWarning.cancel')}
                    </Button>
                    <Button className="flex-1" onClick={confirmExpiryProduct}>
                      <Check className="h-4 w-4 mr-2"/>{t('expiryWarning.proceed')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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
  const resolvedOfflineAudits = offlineAudits ?? [];
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
    if (resolvedOfflineAudits.length > 1) {
      const { conflicts } = resolveAuditConflicts(resolvedOfflineAudits);
      if (conflicts.length > 0) {
        setDetectedConflicts(conflicts);
      }
    }
  }, [resolvedOfflineAudits]);

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
      if (resolvedOfflineAudits.length === 0) {
        setIsAutomaticSyncing(false);
        return;
      }

      // Detect and resolve conflicts before syncing
      const { conflicts, resolutions } = resolveAuditConflicts(resolvedOfflineAudits);
      
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
      const mergedData = mergeAuditData(resolvedOfflineAudits, resolutions);

      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, upload merged and resolved audits to server
      console.log('Syncing audits with conflict resolution:', {
        originalAudits: resolvedOfflineAudits.length,
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
        message: `Synced ${resolvedOfflineAudits.length} audit sessions${conflicts.length > 0 ? ` (${conflicts.length} conflicts resolved)` : ''} to server`,
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
      {resolvedOfflineAudits.length > 0 && (
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
              {resolvedOfflineAudits.map((audit) => (
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [purchases, setPurchases] = useState(demoPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const cols = [
    { key: "grnNumber", label: "GRN #" },
    { key: "supplier", label: "Supplier" },
    { key: "supplierInvoice", label: "Invoice #" },
    { key: "items", label: "Items" },
    { key: "totalAmount", label: "Total", render: (v) => `${v.toLocaleString()} AFN` },
    { key: "paymentStatus", label: "Status", render: (v) => (
      <Badge variant={v === 'paid' ? 'default' : v === 'partial' ? 'secondary' : 'destructive'}>
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </Badge>
    )},
    { key: "receivedDate", label: "Date" },
  ];

  const fields = [
    { name: "supplier", label: "Supplier", type: "select", options: demoSuppliers.map(s => ({ value: s.name, label: s.name })), full: true },
    { name: "supplierInvoice", label: "Supplier Invoice #" },
    { name: "invoiceDate", label: "Invoice Date", type: "date" },
    { name: "receivedDate", label: "Received Date", type: "date" },
    { name: "paymentStatus", label: "Payment Status", type: "select", options: [
      { value: "paid", label: "Paid" },
      { value: "partial", label: "Partial" },
      { value: "unpaid", label: "Unpaid" },
    ]},
    { name: "paidAmount", label: "Paid Amount", type: "number" },
  ];

  const handleSubmit = (data) => {
    if (selectedPurchase) {
      setPurchases(purchases.map(p => p.id === selectedPurchase.id ? { ...p, ...data } : p));
    } else {
      const newPurchase = {
        id: purchases.length + 1,
        grnNumber: `GRN-${1024 + purchases.length}`,
        items: 0,
        totalAmount: 0,
        ...data
      };
      setPurchases([...purchases, newPurchase]);
    }
    setOpen(false);
    setSelectedPurchase(null);
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Truck} 
        title={t('purchases.title')} 
        cta={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportToCSV(purchases, 'purchases')}>
              <FileDown className="h-4 w-4 mr-2"/>Export
            </Button>
            <Button onClick={() => { setSelectedPurchase(null); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-2"/>{t('purchases.newGrn')}
            </Button>
          </div>
        } 
      />
      <DataTable 
        columns={cols} 
        data={purchases} 
        onEdit={(row) => { setSelectedPurchase(row); setOpen(true); }}
        onDelete={(row) => setPurchases(purchases.filter(p => p.id !== row.id))}
        onView={(row) => { setSelectedPurchase(row); setViewMode(true); }}
      />
      <EntityForm 
        open={open} 
        onOpenChange={setOpen} 
        title={selectedPurchase ? "Edit GRN" : t('purchases.newGrn')} 
        fields={fields} 
        onSubmit={handleSubmit}
        defaults={selectedPurchase || {}}
      />
      
      {/* View Purchase Detail Dialog */}
      <Dialog open={viewMode} onOpenChange={setViewMode}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Details - {selectedPurchase?.grnNumber}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Supplier:</span> {selectedPurchase.supplier}</div>
                <div><span className="font-medium">Invoice:</span> {selectedPurchase.supplierInvoice}</div>
                <div><span className="font-medium">Received:</span> {selectedPurchase.receivedDate}</div>
                <div><span className="font-medium">Total:</span> {selectedPurchase.totalAmount?.toLocaleString()} AFN</div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Product</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Cost</th>
                        <th className="px-3 py-2">Batch</th>
                        <th className="px-3 py-2">Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoPurchaseItems.filter(i => i.purchaseId === selectedPurchase.id).map(item => (
                        <tr key={item.id} className="border-t">
                          <td className="px-3 py-2">{item.productName}</td>
                          <td className="px-3 py-2 text-right">{item.quantity}</td>
                          <td className="px-3 py-2 text-right">{item.unitCost} AFN</td>
                          <td className="px-3 py-2">{item.batch}</td>
                          <td className="px-3 py-2">{item.expiry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Sales() {
  const { t } = useTranslation();
  const [sales, setSales] = useState([
    { id: 1, invoiceNumber: "INV-5501", customer: "Walk-in", items: 4, total: 550, date: "2026-02-04", paymentMethod: "cash" },
    { id: 2, invoiceNumber: "INV-5502", customer: "Dr. Ahmad Clinic", items: 8, total: 1250, date: "2026-02-04", paymentMethod: "credit" },
    { id: 3, invoiceNumber: "INV-5503", customer: "Rahimi Hospital", items: 15, total: 4500, date: "2026-02-03", paymentMethod: "bank" },
  ]);
  const [selectedSale, setSelectedSale] = useState(null);

  const cols = [
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "customer", label: "Customer" },
    { key: "items", label: "Items" },
    { key: "total", label: "Total", render: (v) => `${v.toLocaleString()} AFN` },
    { key: "paymentMethod", label: "Payment", render: (v) => (
      <Badge variant="outline">{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
    )},
    { key: "date", label: "Date" },
  ];

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Receipt} 
        title="Sales Invoices" 
        cta={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportToCSV(sales, 'sales')}>
              <FileDown className="h-4 w-4 mr-2"/>Export
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Today's Sales</div>
            <div className="text-2xl font-bold">{sales.filter(s => s.date === "2026-02-04").reduce((sum, s) => sum + s.total, 0).toLocaleString()} AFN</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Invoices Today</div>
            <div className="text-2xl font-bold">{sales.filter(s => s.date === "2026-02-04").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Cash Sales</div>
            <div className="text-2xl font-bold">{sales.filter(s => s.paymentMethod === "cash").reduce((sum, s) => sum + s.total, 0).toLocaleString()} AFN</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Credit Sales</div>
            <div className="text-2xl font-bold">{sales.filter(s => s.paymentMethod === "credit").reduce((sum, s) => sum + s.total, 0).toLocaleString()} AFN</div>
          </CardContent>
        </Card>
      </div>
      <DataTable 
        columns={cols} 
        data={sales}
        onView={(row) => setSelectedSale(row)}
      />
      
      {/* View Sale Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice {selectedSale?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Customer:</span> {selectedSale.customer}</div>
                <div><span className="font-medium">Date:</span> {selectedSale.date}</div>
                <div><span className="font-medium">Items:</span> {selectedSale.items}</div>
                <div><span className="font-medium">Payment:</span> {selectedSale.paymentMethod}</div>
              </div>
              <div className="text-xl font-bold">Total: {selectedSale.total.toLocaleString()} AFN</div>
              <div className="flex gap-2">
                <Button className="flex-1"><Printer className="h-4 w-4 mr-2"/>Print</Button>
                <Button variant="outline" className="flex-1"><FileDown className="h-4 w-4 mr-2"/>Download</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Customers() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState(demoCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const cols = [
    { key: "name", label: t('customers.customerName') },
    { key: "phone", label: t('common.phone') },
    { key: "balance", label: t('customers.balance'), render: (v) => (
      <span className={v > 0 ? 'text-red-600 font-medium' : ''}>{v.toLocaleString()} AFN</span>
    )},
    { key: "creditLimit", label: t('customers.creditLimit'), render: (v) => `${v.toLocaleString()} AFN` },
    { key: "totalPurchases", label: t('customers.totalPurchases'), render: (v) => `${v.toLocaleString()} AFN` },
    { key: "lastPurchase", label: t('customers.lastPurchase') },
  ];

  const fields = [
    { name: "name", label: t('customers.customerName'), full: true },
    { name: "phone", label: t('common.phone') },
    { name: "email", label: t('common.email') },
    { name: "address", label: t('common.address'), full: true },
    { name: "creditLimit", label: t('customers.creditLimit'), type: "number" },
  ];

  const paymentFields = [
    { name: "amount", label: t('customers.paymentAmount'), type: "number", full: true },
    { name: "method", label: t('customers.paymentMethod'), type: "select", options: [
      { value: "cash", label: "Cash" },
      { value: "bank", label: "Bank Transfer" },
      { value: "mobile", label: "Mobile Money" },
    ]},
    { name: "reference", label: t('customers.reference') },
  ];

  const handleSubmit = (data) => {
    if (selectedCustomer && !paymentOpen) {
      setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, ...data } : c));
    } else if (!paymentOpen) {
      const newCustomer = {
        id: customers.length + 1,
        balance: 0,
        totalPurchases: 0,
        lastPurchase: "-",
        ...data
      };
      setCustomers([...customers, newCustomer]);
    }
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handlePayment = (data) => {
    if (selectedCustomer) {
      const paymentAmount = parseFloat(data.amount) || 0;
      setCustomers(customers.map(c => 
        c.id === selectedCustomer.id 
          ? { ...c, balance: Math.max(0, c.balance - paymentAmount) }
          : c
      ));
    }
    setPaymentOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={UserCircle2} 
        title={t('customers.title')} 
        cta={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportToCSV(customers, 'customers')}>
              <FileDown className="h-4 w-4 mr-2"/>Export
            </Button>
            <Button onClick={() => { setSelectedCustomer(null); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-2"/>{t('customers.newCustomer')}
            </Button>
          </div>
        } 
      />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Receivables</div>
            <div className="text-2xl font-bold text-red-600">{customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString()} AFN</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Customers</div>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">With Outstanding Balance</div>
            <div className="text-2xl font-bold">{customers.filter(c => c.balance > 0).length}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable 
        columns={cols} 
        data={customers} 
        onEdit={(row) => { setSelectedCustomer(row); setOpen(true); }}
        onDelete={(row) => row.name !== 'Walk-in' && setCustomers(customers.filter(c => c.id !== row.id))}
        onView={(row) => { setSelectedCustomer(row); setViewMode(true); }}
      />
      
      <EntityForm 
        open={open} 
        onOpenChange={setOpen} 
        title={selectedCustomer ? "Edit Customer" : t('customers.newCustomer')} 
        fields={fields} 
        onSubmit={handleSubmit}
        defaults={selectedCustomer || {}}
      />

      {/* View Customer Details */}
      <Dialog open={viewMode} onOpenChange={setViewMode}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Phone:</span> {selectedCustomer.phone}</div>
                <div><span className="font-medium">Email:</span> {selectedCustomer.email}</div>
                <div><span className="font-medium">Address:</span> {selectedCustomer.address}</div>
                <div><span className="font-medium">Credit Limit:</span> {selectedCustomer.creditLimit?.toLocaleString()} AFN</div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Outstanding Balance</div>
                  <div className="text-2xl font-bold text-red-600">{selectedCustomer.balance?.toLocaleString()} AFN</div>
                </div>
                {selectedCustomer.balance > 0 && (
                  <Button onClick={() => { setViewMode(false); setPaymentOpen(true); }}>
                    <DollarSign className="h-4 w-4 mr-2"/>Receive Payment
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receive Payment Dialog */}
      <EntityForm 
        open={paymentOpen} 
        onOpenChange={setPaymentOpen} 
        title={`Receive Payment - ${selectedCustomer?.name}`} 
        fields={paymentFields} 
        onSubmit={handlePayment}
        defaults={{}}
      />
    </div>
  );
}

// Drug Interaction Checker Component
function DrugInteractionChecker({ medications = [], onCheck }: { medications?: any[]; onCheck?: () => void }) {
  const [drugs, setDrugs] = useState<string[]>(medications.map(m => m.productName || m.name || ''));
  const [newDrug, setNewDrug] = useState('');
  const [interactions, setInteractions] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  
  // Common drug interactions database (simplified for demo)
  const interactionsDB = [
    { drugs: ['Warfarin', 'Aspirin'], severity: 'high', description: 'Increased risk of bleeding. Combination requires close monitoring of INR and bleeding symptoms.' },
    { drugs: ['Warfarin', 'Ibuprofen'], severity: 'high', description: 'NSAIDs increase anticoagulant effect and risk of GI bleeding.' },
    { drugs: ['Metformin', 'Alcohol'], severity: 'moderate', description: 'Alcohol increases risk of lactic acidosis with metformin.' },
    { drugs: ['Lisinopril', 'Potassium'], severity: 'moderate', description: 'ACE inhibitors can increase potassium levels. Monitor serum potassium.' },
    { drugs: ['Ciprofloxacin', 'Antacids'], severity: 'moderate', description: 'Antacids reduce ciprofloxacin absorption. Take 2 hours apart.' },
    { drugs: ['Simvastatin', 'Grapefruit'], severity: 'moderate', description: 'Grapefruit increases statin levels, increasing risk of muscle damage.' },
    { drugs: ['Fluoxetine', 'Tramadol'], severity: 'high', description: 'Risk of serotonin syndrome. Avoid combination.' },
    { drugs: ['Methotrexate', 'NSAIDs'], severity: 'high', description: 'NSAIDs can reduce methotrexate clearance, increasing toxicity.' },
    { drugs: ['Digoxin', 'Amiodarone'], severity: 'high', description: 'Amiodarone increases digoxin levels. Reduce digoxin dose by 50%.' },
    { drugs: ['Clopidogrel', 'Omeprazole'], severity: 'moderate', description: 'PPIs may reduce clopidogrel effectiveness. Consider alternative PPI.' },
    { drugs: ['Paracetamol', 'Amoxicillin'], severity: 'low', description: 'No significant interaction. Safe to use together.' },
    { drugs: ['Cetirizine', 'Paracetamol'], severity: 'low', description: 'No significant interaction. Safe to use together.' },
  ];
  
  const checkInteractions = () => {
    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundInteractions: any[] = [];
      
      for (let i = 0; i < drugs.length; i++) {
        for (let j = i + 1; j < drugs.length; j++) {
          const drug1 = drugs[i].toLowerCase();
          const drug2 = drugs[j].toLowerCase();
          
          // Check against database
          for (const interaction of interactionsDB) {
            const [d1, d2] = interaction.drugs.map(d => d.toLowerCase());
            if ((drug1.includes(d1) && drug2.includes(d2)) || 
                (drug1.includes(d2) && drug2.includes(d1)) ||
                (d1.includes(drug1) && d2.includes(drug2)) ||
                (d1.includes(drug2) && d2.includes(drug1))) {
              foundInteractions.push({
                ...interaction,
                drugPair: [drugs[i], drugs[j]]
              });
            }
          }
        }
      }
      
      setInteractions(foundInteractions);
      setIsChecking(false);
      setHasChecked(true);
      if (onCheck) onCheck();
    }, 800);
  };
  
  const addDrug = () => {
    if (newDrug.trim() && !drugs.includes(newDrug.trim())) {
      setDrugs([...drugs, newDrug.trim()]);
      setNewDrug('');
      setHasChecked(false);
    }
  };
  
  const removeDrug = (index: number) => {
    setDrugs(drugs.filter((_, i) => i !== index));
    setHasChecked(false);
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'moderate': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">High Risk</Badge>;
      case 'moderate': return <Badge variant="secondary" className="bg-orange-500 text-white">Moderate</Badge>;
      case 'low': return <Badge variant="outline" className="border-green-500 text-green-600">Low</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Drug Interaction Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drug Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter medication name..."
            value={newDrug}
            onChange={(e) => setNewDrug(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDrug()}
          />
          <Button onClick={addDrug} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Drug List */}
        {drugs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {drugs.map((drug, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                <Pill className="h-3 w-3" />
                {drug}
                <button onClick={() => removeDrug(index)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        {/* Check Button */}
        <Button 
          onClick={checkInteractions} 
          disabled={drugs.length < 2 || isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking Interactions...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Check for Interactions ({drugs.length} drugs)
            </>
          )}
        </Button>
        
        {/* Results */}
        {hasChecked && (
          <div className="space-y-3">
            <Separator />
            
            {interactions.length === 0 ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">No Interactions Found</div>
                  <div className="text-sm text-green-600">The selected medications appear safe to use together.</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-medium text-red-600">
                  {interactions.length} Potential Interaction{interactions.length > 1 ? 's' : ''} Found
                </div>
                
                {interactions.map((interaction, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg ${getSeverityColor(interaction.severity)}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="h-4 w-4" />
                        <span className="font-medium">
                          {interaction.drugPair[0]} + {interaction.drugPair[1]}
                        </span>
                      </div>
                      {getSeverityBadge(interaction.severity)}
                    </div>
                    <p className="text-sm">{interaction.description}</p>
                  </div>
                ))}
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <Stethoscope className="h-4 w-4" />
                    Clinical Note
                  </div>
                  Always consult with a healthcare professional before making medication decisions. 
                  This tool provides general guidance and may not cover all possible interactions.
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Quick Examples */}
        {drugs.length === 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="mb-2">Quick examples:</div>
            <div className="flex flex-wrap gap-1">
              {['Warfarin', 'Aspirin', 'Metformin', 'Lisinopril', 'Amoxicillin'].map((drug) => (
                <Button 
                  key={drug}
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setDrugs([...drugs, drug])}
                >
                  + {drug}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Prescriptions() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState(demoPrescriptions);
  const [selectedRx, setSelectedRx] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const cols = [
    { key: "rxNumber", label: t('prescriptions.rxNumber') },
    { key: "doctorName", label: t('prescriptions.doctorName') },
    { key: "patientName", label: t('prescriptions.patientName') },
    { key: "patientPhone", label: t('common.phone') },
    { key: "status", label: t('common.status'), render: (v) => (
      <Badge variant={v === 'dispensed' ? 'default' : v === 'pending' ? 'secondary' : 'destructive'}>
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </Badge>
    )},
    { key: "date", label: t('common.date') },
  ];

  const fields = [
    { name: "doctorName", label: t('prescriptions.doctorName') },
    { name: "patientName", label: t('prescriptions.patientName') },
    { name: "patientPhone", label: t('common.phone') },
    { name: "diagnosis", label: t('prescriptions.diagnosis'), full: true },
  ];

  const handleSubmit = (data) => {
    if (selectedRx) {
      setPrescriptions(prescriptions.map(rx => rx.id === selectedRx.id ? { ...rx, ...data } : rx));
    } else {
      const newRx = {
        id: prescriptions.length + 1,
        rxNumber: `RX-${1014 + prescriptions.length}`,
        status: "pending",
        date: new Date().toISOString().split('T')[0],
        medications: [],
        ...data
      };
      setPrescriptions([...prescriptions, newRx]);
    }
    setOpen(false);
    setSelectedRx(null);
  };

  const handleDispense = (rx) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === rx.id ? { ...p, status: 'dispensed' } : p
    ));
    setViewMode(false);
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={ClipboardList} 
        title={t('prescriptions.title')} 
        cta={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportToCSV(prescriptions, 'prescriptions')}>
              <FileDown className="h-4 w-4 mr-2"/>Export
            </Button>
            <Button onClick={() => { setSelectedRx(null); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-2"/>{t('prescriptions.newPrescription')}
            </Button>
          </div>
        } 
      />
      
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-orange-600">{prescriptions.filter(rx => rx.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Dispensed Today</div>
            <div className="text-2xl font-bold">{prescriptions.filter(rx => rx.status === 'dispensed' && rx.date === new Date().toISOString().split('T')[0]).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total This Month</div>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Drug Interaction Checker Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DataTable 
            columns={cols} 
            data={prescriptions} 
            onEdit={(row) => { setSelectedRx(row); setOpen(true); }}
            onDelete={(row) => setPrescriptions(prescriptions.filter(rx => rx.id !== row.id))}
            onView={(row) => { setSelectedRx(row); setViewMode(true); }}
          />
        </div>
        
        {/* Drug Interaction Checker */}
        <div className="lg:col-span-1">
          <DrugInteractionChecker />
        </div>
      </div>
      
      <EntityForm 
        open={open} 
        onOpenChange={setOpen} 
        title={selectedRx ? "Edit Prescription" : t('prescriptions.newPrescription')} 
        fields={fields} 
        onSubmit={handleSubmit}
        defaults={selectedRx || {}}
      />

      {/* View Prescription Dialog */}
      <Dialog open={viewMode} onOpenChange={setViewMode}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5"/>
              Prescription {selectedRx?.rxNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedRx && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Doctor:</span> {selectedRx.doctorName}</div>
                <div><span className="font-medium">Patient:</span> {selectedRx.patientName}</div>
                <div><span className="font-medium">Phone:</span> {selectedRx.patientPhone}</div>
                <div><span className="font-medium">Date:</span> {selectedRx.date}</div>
                <div className="col-span-2"><span className="font-medium">Diagnosis:</span> {selectedRx.diagnosis}</div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Medications</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Medication</th>
                        <th className="px-3 py-2">Dosage</th>
                        <th className="px-3 py-2">Frequency</th>
                        <th className="px-3 py-2">Duration</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRx.medications?.map((med, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{med.productName}</td>
                          <td className="px-3 py-2 text-center">{med.dosage}</td>
                          <td className="px-3 py-2 text-center">{med.frequency}</td>
                          <td className="px-3 py-2 text-center">{med.duration}</td>
                          <td className="px-3 py-2 text-right">{med.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedRx.status === 'pending' && (
                  <Button className="flex-1" onClick={() => handleDispense(selectedRx)}>
                    <CheckCircle className="h-4 w-4 mr-2"/>Dispense
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2"/>Print Rx
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Returns() {
  const { t } = useTranslation();
  const [salesReturns, setSalesReturns] = useState(demoSalesReturns);
  const [purchaseReturns, setPurchaseReturns] = useState(demoPurchaseReturns);
  const [open, setOpen] = useState(false);
  const [returnType, setReturnType] = useState('sales');

  const salesCols = [
    { key: "returnNumber", label: t('returns.returnNumber') },
    { key: "originalInvoice", label: t('returns.originalInvoice') },
    { key: "customer", label: t('common.customer') },
    { key: "reason", label: t('returns.reason'), render: (v) => t(`returns.reasons.${v}`) },
    { key: "items", label: t('returns.items') },
    { key: "refundAmount", label: t('returns.refundAmount'), render: (v) => `${v.toLocaleString()} AFN` },
    { key: "status", label: t('common.status'), render: (v) => (
      <Badge variant={v === 'approved' ? 'default' : v === 'pending' ? 'secondary' : 'destructive'}>
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </Badge>
    )},
    { key: "returnDate", label: t('common.date') },
  ];

  const purchaseCols = [
    { key: "returnNumber", label: t('returns.returnNumber') },
    { key: "originalGrn", label: "Original GRN" },
    { key: "supplier", label: t('common.supplier') },
    { key: "reason", label: t('returns.reason'), render: (v) => t(`returns.reasons.${v}`) },
    { key: "items", label: t('returns.items') },
    { key: "refundAmount", label: t('returns.refundAmount'), render: (v) => `${v.toLocaleString()} AFN` },
    { key: "status", label: t('common.status'), render: (v) => (
      <Badge variant={v === 'approved' ? 'default' : v === 'pending' ? 'secondary' : 'destructive'}>
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </Badge>
    )},
    { key: "returnDate", label: t('common.date') },
  ];

  const salesFields = [
    { name: "originalInvoice", label: t('returns.originalInvoice') },
    { name: "customer", label: t('common.customer') },
    { name: "reason", label: t('returns.reason'), type: "select", options: [
      { value: "expired", label: t('returns.reasons.expired') },
      { value: "damaged", label: t('returns.reasons.damaged') },
      { value: "wrongProduct", label: t('returns.reasons.wrongProduct') },
      { value: "qualityIssue", label: t('returns.reasons.qualityIssue') },
      { value: "other", label: t('returns.reasons.other') },
    ]},
    { name: "items", label: t('returns.items'), type: "number" },
    { name: "refundAmount", label: t('returns.refundAmount'), type: "number" },
  ];

  const handleSubmit = (data) => {
    if (returnType === 'sales') {
      const newReturn = {
        id: salesReturns.length + 1,
        returnNumber: `SR-${String(salesReturns.length + 3).padStart(3, '0')}`,
        status: 'pending',
        returnDate: new Date().toISOString().split('T')[0],
        ...data
      };
      setSalesReturns([...salesReturns, newReturn]);
    } else {
      const newReturn = {
        id: purchaseReturns.length + 1,
        returnNumber: `PR-${String(purchaseReturns.length + 2).padStart(3, '0')}`,
        status: 'pending',
        returnDate: new Date().toISOString().split('T')[0],
        ...data
      };
      setPurchaseReturns([...purchaseReturns, newReturn]);
    }
    setOpen(false);
  };

  const approveReturn = (type, id) => {
    if (type === 'sales') {
      setSalesReturns(salesReturns.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    } else {
      setPurchaseReturns(purchaseReturns.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={ArrowLeftRight} 
        title={t('returns.title')} 
        cta={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2"/>{t('returns.newReturn')}
          </Button>
        }
      />
      <Tabs defaultValue="sales" onValueChange={setReturnType}>
        <TabsList>
          <TabsTrigger value="sales">{t('returns.salesReturns')}</TabsTrigger>
          <TabsTrigger value="purchase">{t('returns.purchaseReturns')}</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="mt-4">
          <DataTable 
            columns={salesCols} 
            data={salesReturns}
            onView={(row) => row.status === 'pending' && approveReturn('sales', row.id)}
            onDelete={(row) => setSalesReturns(salesReturns.filter(r => r.id !== row.id))}
          />
        </TabsContent>
        <TabsContent value="purchase" className="mt-4">
          <DataTable 
            columns={purchaseCols} 
            data={purchaseReturns}
            onView={(row) => row.status === 'pending' && approveReturn('purchase', row.id)}
            onDelete={(row) => setPurchaseReturns(purchaseReturns.filter(r => r.id !== row.id))}
          />
        </TabsContent>
      </Tabs>
      
      <EntityForm 
        open={open} 
        onOpenChange={setOpen} 
        title={`New ${returnType === 'sales' ? 'Sales' : 'Purchase'} Return`} 
        fields={salesFields} 
        onSubmit={handleSubmit}
        defaults={{}}
      />
    </div>
  );
}

function Reports() {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '2026-02-01', to: '2026-02-04' });
  const [reportData, setReportData] = useState(null);

  const reports = [
    { key: "sales", icon: Receipt, title: t('reports.salesReport'), desc: t('reports.salesReportDesc') },
    { key: "profit", icon: BadgeDollarSign, title: t('reports.profitLoss'), desc: t('reports.profitLossDesc') },
    { key: "inventory", icon: Package, title: t('reports.inventoryValuation'), desc: t('reports.inventoryValuationDesc') },
    { key: "expiry", icon: CalendarClock, title: t('reports.expiryReport'), desc: t('reports.expiryReportDesc') },
    { key: "purchase", icon: Truck, title: t('reports.purchaseReport'), desc: t('reports.purchaseReportDesc') },
    { key: "tax", icon: FileText, title: t('reports.taxReport'), desc: t('reports.taxReportDesc') },
  ];

  const generateReport = (reportKey) => {
    setSelectedReport(reportKey);
    
    // Generate sample report data based on type
    switch (reportKey) {
      case 'sales':
        setReportData({
          title: 'Sales Report',
          summary: { totalSales: 124500, invoiceCount: 148, avgInvoice: 841, topProduct: 'Paracetamol 500mg' },
          data: [
            { date: '2026-02-01', invoices: 32, sales: 28500, cash: 18500, credit: 10000 },
            { date: '2026-02-02', invoices: 38, sales: 31200, cash: 22200, credit: 9000 },
            { date: '2026-02-03', invoices: 41, sales: 35800, cash: 25800, credit: 10000 },
            { date: '2026-02-04', invoices: 37, sales: 29000, cash: 19000, credit: 10000 },
          ]
        });
        break;
      case 'expiry':
        setReportData({
          title: 'Expiry Report',
          summary: { expired: 3, within30Days: 10, within90Days: 25, totalValue: 15600 },
          data: demoProducts.map(p => ({
            product: p.name,
            batch: p.batch,
            expiry: p.expiry,
            stock: p.stock,
            status: checkProductExpiry(p).status
          }))
        });
        break;
      case 'inventory':
        setReportData({
          title: 'Inventory Valuation',
          summary: { totalItems: demoProducts.length, totalValue: demoProducts.reduce((s, p) => s + p.stock * p.price, 0), lowStock: 2 },
          data: demoProducts.map(p => ({
            product: p.name,
            sku: p.sku,
            stock: p.stock,
            costPrice: Math.round(p.price * 0.7),
            salePrice: p.price,
            value: p.stock * Math.round(p.price * 0.7)
          }))
        });
        break;
      default:
        setReportData({
          title: 'Report',
          summary: {},
          data: []
        });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={FileBarChart2} title={t('reports.title')} />
      
      {!selectedReport ? (
        <div className="grid md:grid-cols-3 gap-3">
          {reports.map((r) => (
            <Card key={r.key} className="hover:shadow cursor-pointer" onClick={() => generateReport(r.key)}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <r.icon className="h-4 w-4"/>{r.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{r.desc}</div>
                <div className="flex justify-end mt-3">
                  <Button variant="outline" onClick={() => generateReport(r.key)}>Generate</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => { setSelectedReport(null); setReportData(null); }}>
              <X className="h-4 w-4 mr-2"/>Back to Reports
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => reportData && exportToCSV(reportData.data, selectedReport)}>
                <FileSpreadsheet className="h-4 w-4 mr-2"/>Export CSV
              </Button>
              <Button variant="outline" onClick={() => reportData && exportToJSON(reportData.data, selectedReport)}>
                <FileDown className="h-4 w-4 mr-2"/>Export JSON
              </Button>
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2"/>Print
              </Button>
            </div>
          </div>

          {reportData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{reportData.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="text-xl font-bold">
                          {typeof value === 'number' && key.includes('Value') || key.includes('Sales') || key.includes('Invoice')
                            ? `${value.toLocaleString()} AFN` 
                            : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {reportData.data[0] && Object.keys(reportData.data[0]).map(key => (
                            <th key={key} className="px-3 py-2 text-left capitalize">{key.replace(/([A-Z])/g, ' $1')}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.map((row, idx) => (
                          <tr key={idx} className="border-t">
                            {Object.entries(row).map(([key, value]) => (
                              <td key={key} className="px-3 py-2">
                                {key === 'status' ? (
                                  <Badge variant={value === 'expired' ? 'destructive' : value === 'expiringSoon' ? 'secondary' : 'default'}>
                                    {value}
                                  </Badge>
                                ) : typeof value === 'number' && (key.includes('sales') || key.includes('value') || key.includes('cost') || key.includes('price') || key.includes('cash') || key.includes('credit'))
                                  ? `${value.toLocaleString()} AFN`
                                  : value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
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
        <Card>
          <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <DarkModeToggle />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dark Mode Toggle for Settings
function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        <div>
          <div className="text-sm font-medium">Dark Mode</div>
          <div className="text-xs text-muted-foreground">
            {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
          </div>
        </div>
      </div>
      <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
    </div>
  );
}

function Alerts() {
  const { t } = useTranslation();
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Bell} title={t('alerts.title')} />
      <div className="grid gap-4">
        {demoAlerts.map((alert) => (
          <Card key={alert.id} className={`border-l-4 ${alert.severity === 'high' ? 'border-l-red-500' : 'border-l-orange-500'}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-500' : 'text-orange-500'}`} />
                <div>
                  <div className="font-medium capitalize">{t(`alerts.${alert.type}`)}</div>
                  <div className="text-sm text-muted-foreground">{alert.type === 'expiry' ? t('alerts.expiringItems', { count: 10 }) : t('alerts.lowStockItems', { count: 7 })}</div>
                </div>
              </div>
              <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>{alert.severity}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState(demoUsers);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { auditLogs } = useAuth();

  const cols = [
    { key: "username", label: t('users.username') },
    { key: "name", label: t('common.name') },
    { key: "role", label: t('users.role'), render: (v) => (
      <Badge variant="outline">{t(`users.roles.${v}`)}</Badge>
    )},
    { key: "email", label: t('common.email') },
    { key: "lastLogin", label: t('users.lastLogin') },
    { key: "status", label: t('common.status'), render: (v) => (
      <Badge variant={v === 'active' ? 'default' : 'secondary'}>{v}</Badge>
    )},
  ];

  const fields = [
    { name: "username", label: t('users.username') },
    { name: "name", label: t('common.name') },
    { name: "email", label: t('common.email') },
    { name: "role", label: t('users.role'), type: "select", options: [
      { value: "admin", label: t('users.roles.admin') },
      { value: "manager", label: t('users.roles.manager') },
      { value: "cashier", label: t('users.roles.cashier') },
      { value: "inventory", label: t('users.roles.inventory') },
      { value: "accountant", label: t('users.roles.accountant') },
    ]},
    { name: "password", label: t('users.password'), type: "password" },
  ];

  const handleSubmit = (data) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
    } else {
      const newUser = {
        id: users.length + 1,
        status: "active",
        lastLogin: "-",
        permissions: data.role === 'admin' ? ['all'] : ['pos_access'],
        ...data
      };
      setUsers([...users, newUser]);
    }
    setOpen(false);
    setSelectedUser(null);
  };

  const auditCols = [
    { key: "timestamp", label: t('users.timestamp') },
    { key: "username", label: t('users.username') },
    { key: "action", label: t('users.action'), render: (v) => (
      <Badge variant="outline">{v}</Badge>
    )},
    { key: "details", label: t('common.description') },
    { key: "ipAddress", label: t('users.ipAddress') },
  ];

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Shield} 
        title={t('users.title')} 
        cta={
          <Button onClick={() => { setSelectedUser(null); setOpen(true); }}>
            <UserPlus className="h-4 w-4 mr-2"/>{t('users.newUser')}
          </Button>
        }
      />
      
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">{t('users.permissions')}</TabsTrigger>
          <TabsTrigger value="audit">{t('users.auditLog')}</TabsTrigger>
          <TabsTrigger value="sessions">{t('users.sessionManagement')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <DataTable 
            columns={cols} 
            data={users}
            onEdit={(row) => { setSelectedUser(row); setOpen(true); }}
            onDelete={(row) => row.role !== 'admin' && setUsers(users.filter(u => u.id !== row.id))}
          />
        </TabsContent>
        
        <TabsContent value="roles" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {['cashier', 'manager', 'inventory', 'accountant'].map(role => (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="text-base">{t(`users.roles.${role}`)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['pos_access', 'inventory_manage', 'products_manage', 'suppliers_manage', 'reports_view', 'settings_manage'].map(perm => (
                    <div key={perm} className="flex items-center justify-between">
                      <Label className="text-sm">{t(`users.permissions_list.${perm}`)}</Label>
                      <Switch defaultChecked={
                        (role === 'cashier' && perm === 'pos_access') ||
                        (role === 'manager' && ['pos_access', 'inventory_manage', 'reports_view'].includes(perm)) ||
                        (role === 'inventory' && ['inventory_manage', 'products_manage'].includes(perm)) ||
                        (role === 'accountant' && ['reports_view'].includes(perm))
                      } />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="audit" className="mt-4">
          <DataTable columns={auditCols} data={auditLogs || demoAuditLogs} />
        </TabsContent>
        
        <TabsContent value="sessions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('users.activeSessions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.filter(u => u.status === 'active').map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">Last login: {user.lastLogin}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-1"/>{t('users.forceLogout')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EntityForm 
        open={open} 
        onOpenChange={setOpen} 
        title={selectedUser ? "Edit User" : t('users.newUser')} 
        fields={fields} 
        onSubmit={handleSubmit}
        defaults={selectedUser || {}}
      />
    </div>
  );
}

// Branch Management Component
function BranchManagement() {
  const { t } = useTranslation();
  const [branches, setBranches] = useState(demoBranches);
  const [transfers, setTransfers] = useState(demoStockTransfers);
  const [currentBranch, setCurrentBranch] = useKV('current-branch', demoBranches[0]);
  const [open, setOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const branchCols = [
    { key: "name", label: t('common.name') },
    { key: "address", label: t('common.address') },
    { key: "phone", label: t('common.phone') },
    { key: "isMain", label: "Main", render: (v) => v ? <Badge>Main</Badge> : null },
    { key: "status", label: t('common.status'), render: (v) => (
      <Badge variant={v === 'active' ? 'default' : 'secondary'}>{v}</Badge>
    )},
  ];

  const transferCols = [
    { key: "transferNumber", label: "Transfer #" },
    { key: "fromBranch", label: t('branches.fromBranch') },
    { key: "toBranch", label: t('branches.toBranch') },
    { key: "items", label: t('returns.items') },
    { key: "status", label: t('common.status'), render: (v) => (
      <Badge variant={v === 'received' ? 'default' : 'secondary'}>
        {v === 'inTransit' ? 'In Transit' : v}
      </Badge>
    )},
    { key: "transferDate", label: t('common.date') },
  ];

  const branchFields = [
    { name: "name", label: t('common.name'), full: true },
    { name: "address", label: t('common.address'), full: true },
    { name: "phone", label: t('common.phone') },
  ];

  const transferFields = [
    { name: "fromBranch", label: t('branches.fromBranch'), type: "select", options: branches.map(b => ({ value: b.name, label: b.name })) },
    { name: "toBranch", label: t('branches.toBranch'), type: "select", options: branches.map(b => ({ value: b.name, label: b.name })) },
    { name: "items", label: t('returns.items'), type: "number" },
  ];

  const handleBranchSubmit = (data) => {
    const newBranch = {
      id: branches.length + 1,
      isMain: false,
      status: 'active',
      ...data
    };
    setBranches([...branches, newBranch]);
    setOpen(false);
  };

  const handleTransferSubmit = (data) => {
    const newTransfer = {
      id: transfers.length + 1,
      transferNumber: `TR-${String(transfers.length + 3).padStart(3, '0')}`,
      status: 'inTransit',
      transferDate: new Date().toISOString().split('T')[0],
      ...data
    };
    setTransfers([...transfers, newTransfer]);
    setTransferOpen(false);
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Building2} 
        title={t('branches.title')} 
        cta={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTransferOpen(true)}>
              <ArrowRightLeft className="h-4 w-4 mr-2"/>{t('branches.newTransfer')}
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2"/>New Branch
            </Button>
          </div>
        }
      />
      
      {/* Current Branch Card */}
      <Card className="border-2 border-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">{t('branches.currentBranch')}</div>
                <div className="font-bold text-lg">{currentBranch?.name}</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{t('branches.switchBranch')}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {branches.map(branch => (
                  <DropdownMenuItem 
                    key={branch.id} 
                    onClick={() => setCurrentBranch(branch)}
                    className={currentBranch?.id === branch.id ? 'bg-muted' : ''}
                  >
                    {branch.name}
                    {currentBranch?.id === branch.id && <Check className="h-4 w-4 ml-auto"/>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="branches">
        <TabsList>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="transfers">{t('branches.stockTransfer')}</TabsTrigger>
          <TabsTrigger value="history">{t('branches.transferHistory')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branches" className="mt-4">
          <DataTable 
            columns={branchCols} 
            data={branches}
            onEdit={(row) => {}}
            onDelete={(row) => !row.isMain && setBranches(branches.filter(b => b.id !== row.id))}
          />
        </TabsContent>
        
        <TabsContent value="transfers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>New Stock Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>From Branch</Label>
                  <Select defaultValue={currentBranch?.name}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {branches.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To Branch</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select destination"/></SelectTrigger>
                    <SelectContent>
                      {branches.filter(b => b.id !== currentBranch?.id).map(b => 
                        <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <ArrowRightLeft className="h-4 w-4 mr-2"/>Start Transfer
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Label>Select Products to Transfer</Label>
                <div className="border rounded-lg mt-2 p-4">
                  <div className="text-sm text-muted-foreground text-center">Select products from inventory to add to transfer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <DataTable columns={transferCols} data={transfers} />
        </TabsContent>
      </Tabs>
      
      <EntityForm 
        open={open} 
        onOpenChange={setOpen} 
        title="New Branch" 
        fields={branchFields} 
        onSubmit={handleBranchSubmit}
        defaults={{}}
      />
    </div>
  );
}

// Thermal Receipt Component for POS Printing
function ThermalReceipt({ sale, onClose }: { sale: any; onClose: () => void }) {
  const { t } = useTranslation();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const printReceipt = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              width: 80mm; 
              margin: 0; 
              padding: 10px;
            }
            .header { text-align: center; margin-bottom: 10px; }
            .header h1 { font-size: 16px; margin: 0; }
            .header p { margin: 2px 0; font-size: 10px; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .item { display: flex; justify-content: space-between; margin: 4px 0; }
            .item-name { flex: 1; }
            .total-row { font-weight: bold; font-size: 14px; }
            .footer { text-align: center; margin-top: 15px; font-size: 10px; }
            .barcode { text-align: center; margin: 10px 0; font-family: 'Libre Barcode 39', cursive; font-size: 36px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const invoiceNumber = sale?.id || `INV-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleString();
  const items = sale?.items || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.0; // No VAT for now
  const total = subtotal + tax;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Print Receipt
          </DialogTitle>
        </DialogHeader>
        
        {/* Receipt Preview */}
        <div 
          ref={receiptRef}
          className="bg-white text-black p-4 rounded border font-mono text-xs max-h-96 overflow-y-auto"
          style={{ width: '300px', margin: '0 auto' }}
        >
          <div className="text-center mb-3">
            <h1 className="font-bold text-base">ZAM PHARMA</h1>
            <p className="text-[10px]">Main Branch, Kabul</p>
            <p className="text-[10px]">Tel: +93 70 123 4567</p>
            <p className="text-[10px]">TIN: 1234567890</p>
          </div>
          
          <div className="border-t border-dashed border-gray-400 my-2" />
          
          <div className="flex justify-between text-[10px] mb-2">
            <span>Invoice: {invoiceNumber}</span>
            <span>{date}</span>
          </div>
          
          <div className="border-t border-dashed border-gray-400 my-2" />
          
          {/* Items */}
          <div className="space-y-1">
            {items.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <span className="flex-1 truncate">{item.name}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 pl-2">
                  <span>{item.qty} x {item.price.toLocaleString()}</span>
                  <span>{(item.qty * item.price).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-dashed border-gray-400 my-2" />
          
          {/* Totals */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{subtotal.toLocaleString()} AFN</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-[10px]">
                <span>VAT (0%):</span>
                <span>{tax.toLocaleString()} AFN</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm">
              <span>TOTAL:</span>
              <span>{total.toLocaleString()} AFN</span>
            </div>
          </div>
          
          <div className="border-t border-dashed border-gray-400 my-2" />
          
          {/* Payment Info */}
          <div className="text-[10px] space-y-1">
            <div className="flex justify-between">
              <span>Payment:</span>
              <span>Cash</span>
            </div>
            <div className="flex justify-between">
              <span>Received:</span>
              <span>{total.toLocaleString()} AFN</span>
            </div>
            <div className="flex justify-between">
              <span>Change:</span>
              <span>0 AFN</span>
            </div>
          </div>
          
          <div className="border-t border-dashed border-gray-400 my-2" />
          
          {/* Barcode */}
          <div className="text-center my-3">
            <div className="flex justify-center">
              {invoiceNumber.split('').map((char, i) => (
                <div key={i} className={`${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} style={{ width: '2px', height: '30px' }} />
              ))}
            </div>
            <p className="text-[10px] mt-1">{invoiceNumber}</p>
          </div>
          
          {/* Footer */}
          <div className="text-center text-[10px] mt-3">
            <p>Thank you for your purchase!</p>
            <p>Please keep this receipt for returns</p>
            <p className="mt-2 text-gray-500">Powered by ZamPharma POS</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button onClick={printReceipt} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Barcode Generator Component
function BarcodeGenerator() {
  const { t } = useTranslation();
  const [barcodeValue, setBarcodeValue] = useState('');
  const [barcodeType, setBarcodeType] = useState('code128');
  const [generatedBarcodes, setGeneratedBarcodes] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  
  const generateBarcode = (value: string) => {
    // Simple barcode pattern generator
    const binary = value.split('').map((char, i) => {
      const code = char.charCodeAt(0);
      return ((code + i) % 2 === 0 ? '1' : '0') + ((code + i + 1) % 2 === 0 ? '1' : '0');
    }).join('');
    return binary;
  };
  
  const handleGenerate = () => {
    if (!barcodeValue.trim()) return;
    
    const newBarcode = {
      id: Date.now(),
      value: barcodeValue,
      type: barcodeType,
      pattern: generateBarcode(barcodeValue),
      product: selectedProduct,
      quantity: quantity,
      createdAt: new Date().toISOString()
    };
    
    setGeneratedBarcodes([newBarcode, ...generatedBarcodes]);
    setBarcodeValue('');
    setQuantity(1);
  };
  
  const handleGenerateForProduct = (product: any) => {
    const code = `ZP${product.id.toString().padStart(6, '0')}`;
    const newBarcode = {
      id: Date.now(),
      value: code,
      type: 'code128',
      pattern: generateBarcode(code),
      product: product,
      quantity: 1,
      createdAt: new Date().toISOString()
    };
    setGeneratedBarcodes([newBarcode, ...generatedBarcodes]);
  };
  
  const printBarcodes = (barcode: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let labelsHtml = '';
    for (let i = 0; i < barcode.quantity; i++) {
      labelsHtml += `
        <div style="display: inline-block; width: 50mm; height: 25mm; border: 1px solid #ccc; margin: 2mm; padding: 2mm; text-align: center;">
          <div style="font-size: 8px; font-weight: bold; margin-bottom: 2px;">
            ${barcode.product?.name || 'Product'}
          </div>
          <div style="display: flex; justify-content: center; margin: 3px 0;">
            ${barcode.pattern.split('').map((b: string) => 
              `<div style="width: 1px; height: 20px; background: ${b === '1' ? '#000' : '#fff'};"></div>`
            ).join('')}
          </div>
          <div style="font-size: 10px; font-family: monospace;">
            ${barcode.value}
          </div>
          ${barcode.product?.price ? `<div style="font-size: 9px; font-weight: bold;">${barcode.product.price} AFN</div>` : ''}
        </div>
      `;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode Labels</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>${labelsHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Barcode} 
        title="Barcode Generator" 
        extra={
          <Badge variant="secondary">{generatedBarcodes.length} barcodes</Badge>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Generator Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Generate New Barcode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Barcode Value</Label>
              <Input
                placeholder="Enter barcode value or product code"
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Barcode Type</Label>
              <Select value={barcodeType} onValueChange={setBarcodeType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code128">Code 128</SelectItem>
                  <SelectItem value="code39">Code 39</SelectItem>
                  <SelectItem value="ean13">EAN-13</SelectItem>
                  <SelectItem value="upc">UPC-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button onClick={handleGenerate} className="w-full" disabled={!barcodeValue.trim()}>
              <Barcode className="h-4 w-4 mr-2" />
              Generate Barcode
            </Button>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Generate from Inventory</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {demoProducts.slice(0, 5).map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded border hover:bg-muted cursor-pointer"
                    onClick={() => handleGenerateForProduct(product)}
                  >
                    <div>
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.price} AFN</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Generated Barcodes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Generated Barcodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedBarcodes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Barcode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No barcodes generated yet</p>
                <p className="text-sm">Use the form to create new barcodes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedBarcodes.map((barcode) => (
                  <div key={barcode.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{barcode.product?.name || 'Custom Barcode'}</div>
                        <div className="text-sm text-muted-foreground">
                          {barcode.type.toUpperCase()} • Qty: {barcode.quantity}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => printBarcodes(barcode)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Barcode Visual */}
                    <div className="bg-white p-3 rounded border flex flex-col items-center">
                      <div className="flex">
                        {barcode.pattern.split('').map((b: string, i: number) => (
                          <div 
                            key={i}
                            style={{ 
                              width: '2px', 
                              height: '40px', 
                              backgroundColor: b === '1' ? '#000' : '#fff' 
                            }}
                          />
                        ))}
                      </div>
                      <div className="mt-2 font-mono text-sm">{barcode.value}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => printBarcodes(barcode)}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print {barcode.quantity}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setGeneratedBarcodes(generatedBarcodes.filter(b => b.id !== barcode.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stock Take / Physical Inventory Count Module
function StockTake() {
  const { t } = useTranslation();
  const [stockTakes, setStockTakes] = useState<any[]>([]);
  const [activeCount, setActiveCount] = useState<any>(null);
  const [countItems, setCountItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  const startNewCount = (name: string, location: string) => {
    const newCount = {
      id: Date.now(),
      name: name || `Stock Take ${new Date().toLocaleDateString()}`,
      location: location || 'Main Store',
      status: 'in-progress',
      startedAt: new Date().toISOString(),
      completedAt: null,
      itemsCounted: 0,
      totalVariance: 0,
      items: demoProducts.map(p => ({
        productId: p.id,
        productName: p.name,
        systemQty: p.stock,
        countedQty: null,
        variance: null,
        notes: ''
      }))
    };
    
    setActiveCount(newCount);
    setCountItems(newCount.items);
    setShowNewDialog(false);
  };
  
  const updateCount = (productId: number, countedQty: number, notes?: string) => {
    setCountItems(items => items.map(item => {
      if (item.productId === productId) {
        const variance = countedQty - item.systemQty;
        return { 
          ...item, 
          countedQty, 
          variance,
          notes: notes !== undefined ? notes : item.notes 
        };
      }
      return item;
    }));
  };
  
  const completeCount = () => {
    if (!activeCount) return;
    
    const completedCount = {
      ...activeCount,
      status: 'completed',
      completedAt: new Date().toISOString(),
      itemsCounted: countItems.filter(i => i.countedQty !== null).length,
      totalVariance: countItems.reduce((sum, i) => sum + (i.variance || 0), 0),
      items: countItems
    };
    
    setStockTakes([completedCount, ...stockTakes]);
    setActiveCount(null);
    setCountItems([]);
  };
  
  const cancelCount = () => {
    setActiveCount(null);
    setCountItems([]);
  };
  
  const filteredItems = countItems.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const countedItems = countItems.filter(i => i.countedQty !== null).length;
  const totalItems = countItems.length;
  const totalVariance = countItems.reduce((sum, i) => sum + Math.abs(i.variance || 0), 0);
  const varianceItems = countItems.filter(i => i.variance !== null && i.variance !== 0).length;

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={ClipboardCheck} 
        title="Stock Take / Physical Count" 
        extra={
          !activeCount && (
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Stock Take
            </Button>
          )
        }
      />
      
      {/* New Stock Take Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Stock Take</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const name = (form.elements.namedItem('name') as HTMLInputElement).value;
            const location = (form.elements.namedItem('location') as HTMLInputElement).value;
            startNewCount(name, location);
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Count Name</Label>
                <Input id="name" name="name" placeholder="e.g., Monthly Stock Take - January" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select name="location" defaultValue="main">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Store</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="shelf-a">Shelf A</SelectItem>
                    <SelectItem value="shelf-b">Shelf B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Start Counting
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Active Count */}
      {activeCount ? (
        <div className="space-y-4">
          {/* Progress Header */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{activeCount.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Started: {new Date(activeCount.startedAt).toLocaleString()} • {activeCount.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelCount}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={completeCount} disabled={countedItems === 0}>
                    <FileCheck className="h-4 w-4 mr-2" />
                    Complete Count
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white dark:bg-background rounded-lg">
                  <div className="text-2xl font-bold">{countedItems}/{totalItems}</div>
                  <div className="text-xs text-muted-foreground">Items Counted</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-background rounded-lg">
                  <div className="text-2xl font-bold">{Math.round((countedItems / totalItems) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Progress</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-background rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{varianceItems}</div>
                  <div className="text-xs text-muted-foreground">Variances Found</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-background rounded-lg">
                  <div className={`text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {totalVariance > 0 ? `-${totalVariance}` : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Variance</div>
                </div>
              </div>
              
              <Progress value={(countedItems / totalItems) * 100} className="mt-3" />
            </CardContent>
          </Card>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Count Items */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">System Qty</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Counted Qty</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Variance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.productId} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.productName}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline">{item.systemQty}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            placeholder="Count"
                            value={item.countedQty ?? ''}
                            onChange={(e) => updateCount(item.productId, parseInt(e.target.value) || 0)}
                            className="w-24 mx-auto text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.variance !== null && (
                            <Badge variant={item.variance === 0 ? 'default' : item.variance > 0 ? 'secondary' : 'destructive'}>
                              {item.variance > 0 ? '+' : ''}{item.variance}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            placeholder="Add note..."
                            value={item.notes}
                            onChange={(e) => updateCount(item.productId, item.countedQty || 0, e.target.value)}
                            className="w-40"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Stock Take History */
        <div className="space-y-4">
          {stockTakes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <PackageCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-1">No Stock Takes Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start a new stock take to reconcile your physical inventory
                </p>
                <Button onClick={() => setShowNewDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start First Stock Take
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {stockTakes.map((st) => (
                <Card key={st.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{st.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {st.location} • Completed: {new Date(st.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-bold">{st.itemsCounted}</div>
                          <div className="text-xs text-muted-foreground">Items</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-bold ${st.totalVariance !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {st.totalVariance > 0 ? '+' : ''}{st.totalVariance}
                          </div>
                          <div className="text-xs text-muted-foreground">Variance</div>
                        </div>
                        <Badge variant={st.status === 'completed' ? 'default' : 'secondary'}>
                          {st.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Print Labels Component
function PrintLabels() {
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [labelSettings, setLabelSettings] = useState({
    size: 'medium',
    quantity: 1,
    includePrice: true,
    includeExpiry: true,
    includeBarcode: true
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const toggleProduct = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const selectAll = () => {
    setSelectedProducts(demoProducts);
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={Tag} 
        title={t('labels.title')} 
        cta={
          <Button onClick={() => setPreviewOpen(true)} disabled={selectedProducts.length === 0}>
            <Printer className="h-4 w-4 mr-2"/>{t('labels.printNow')} ({selectedProducts.length})
          </Button>
        }
      />
      
      <div className="grid md:grid-cols-3 gap-4">
        {/* Label Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Label Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('labels.labelSize')}</Label>
              <Select value={labelSettings.size} onValueChange={(v) => setLabelSettings({ ...labelSettings, size: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (30x20mm)</SelectItem>
                  <SelectItem value="medium">Medium (50x25mm)</SelectItem>
                  <SelectItem value="large">Large (70x35mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('labels.quantity')}</Label>
              <Input 
                type="number" 
                value={labelSettings.quantity} 
                onChange={(e) => setLabelSettings({ ...labelSettings, quantity: parseInt(e.target.value) || 1 })}
                min={1}
                max={100}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('labels.includePrice')}</Label>
                <Switch 
                  checked={labelSettings.includePrice} 
                  onCheckedChange={(v) => setLabelSettings({ ...labelSettings, includePrice: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t('labels.includeExpiry')}</Label>
                <Switch 
                  checked={labelSettings.includeExpiry} 
                  onCheckedChange={(v) => setLabelSettings({ ...labelSettings, includeExpiry: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Include Barcode</Label>
                <Switch 
                  checked={labelSettings.includeBarcode} 
                  onCheckedChange={(v) => setLabelSettings({ ...labelSettings, includeBarcode: v })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('labels.selectProducts')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>Clear</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {demoProducts.map(product => (
                <div 
                  key={product.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProducts.find(p => p.id === product.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleProduct(product)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={!!selectedProducts.find(p => p.id === product.id)} />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.sku} • {product.barcode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{product.price} AFN</div>
                      <div className="text-xs text-muted-foreground">Exp: {product.expiry}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('labels.preview')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {selectedProducts.slice(0, 6).map(product => (
                <div 
                  key={product.id} 
                  className={`border-2 border-dashed rounded p-2 text-center ${
                    labelSettings.size === 'small' ? 'text-xs' : labelSettings.size === 'large' ? 'text-sm' : 'text-xs'
                  }`}
                >
                  <div className="font-bold truncate">{product.name}</div>
                  {labelSettings.includeBarcode && (
                    <div className="my-1 bg-black h-6 flex items-center justify-center">
                      <div className="text-white text-xs font-mono">{product.barcode}</div>
                    </div>
                  )}
                  <div className="text-muted-foreground">{product.sku}</div>
                  {labelSettings.includePrice && <div className="font-bold">{product.price} AFN</div>}
                  {labelSettings.includeExpiry && <div className="text-xs">Exp: {product.expiry}</div>}
                </div>
              ))}
            </div>
            {selectedProducts.length > 6 && (
              <div className="text-center text-muted-foreground">
                +{selectedProducts.length - 6} more labels
              </div>
            )}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2"/>Print {selectedProducts.length * labelSettings.quantity} Labels
              </Button>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Offline Queue Component
function OfflineQueue() {
  const { t } = useTranslation();
  const { queue, processQueue, clearQueue, retryFailed, pendingCount } = useOfflineQueue();
  const { isOnline } = useNetworkStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5"/>
            {t('offline.transactionQueue')}
          </CardTitle>
          <Badge variant={pendingCount > 0 ? 'secondary' : 'default'}>
            {pendingCount} {t('offline.pendingTransactions')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {queue.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No pending transactions
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.type}</Badge>
                  <div>
                    <div className="text-sm font-medium">Transaction #{item.id}</div>
                    <div className="text-xs text-muted-foreground">{t('offline.queuedAt')}: {new Date(item.queuedAt).toLocaleString()}</div>
                  </div>
                </div>
                <Badge variant={
                  item.status === 'synced' ? 'default' : 
                  item.status === 'failed' ? 'destructive' : 
                  item.status === 'syncing' ? 'secondary' : 'outline'
                }>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
        {queue.length > 0 && (
          <div className="flex gap-2 mt-4">
            <Button onClick={processQueue} disabled={!isOnline || pendingCount === 0}>
              <RefreshCcw className="h-4 w-4 mr-2"/>{t('offline.syncNow')}
            </Button>
            <Button variant="outline" onClick={retryFailed}>
              <RotateCcw className="h-4 w-4 mr-2"/>{t('offline.retryFailed')}
            </Button>
            <Button variant="destructive" onClick={clearQueue}>
              <Trash2 className="h-4 w-4 mr-2"/>{t('offline.clearQueue')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
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
    case "branches":
      return <BranchManagement/>;
    case "users":
      return <UserManagement/>;
    case "labels":
      return <PrintLabels/>;
    case "barcodes":
      return <BarcodeGenerator/>;
    case "stocktake":
      return <StockTake/>;
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

// Login Screen Component
function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo credentials
    const demoUsers = [
      { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
      { username: 'cashier', password: 'cash123', role: 'cashier', name: 'Ahmad Cashier' },
      { username: 'pharmacist', password: 'pharma123', role: 'pharmacist', name: 'Dr. Fatima' },
    ];
    
    const user = demoUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-background dark:to-green-950 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Languages className="h-4 w-4 mr-2"/>{language === 'en' ? 'English' : language === 'fa' ? 'دری' : 'پښتو'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('fa')}>دری (Dari)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ps')}>پښتو (Pashto)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Zam Pharma</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Pharmacy Management System
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User2 className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                    autoComplete="username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2 h-8 w-8`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <Separator className="my-6" />
            
            <div className="space-y-3">
              <p className="text-xs text-center text-muted-foreground">Demo Credentials</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setUsername('admin'); setPassword('admin123'); }}
                  className="flex flex-col h-auto py-2"
                >
                  <Shield className="h-4 w-4 mb-1" />
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setUsername('cashier'); setPassword('cash123'); }}
                  className="flex flex-col h-auto py-2"
                >
                  <ShoppingCart className="h-4 w-4 mb-1" />
                  Cashier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setUsername('pharmacist'); setPassword('pharma123'); }}
                  className="flex flex-col h-auto py-2"
                >
                  <Stethoscope className="h-4 w-4 mb-1" />
                  Pharmacist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          © 2024 Zam Pharma • Kabul, Afghanistan
        </p>
      </motion.div>
    </div>
  );
}

// Keyboard Shortcuts Hook
function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const key = e.key.toUpperCase();
      const shortcut = e.ctrlKey ? `Ctrl+${key}` : e.altKey ? `Alt+${key}` : key;
      
      if (handlers[shortcut]) {
        e.preventDefault();
        handlers[shortcut]();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

// Global Search Command Palette
function CommandPalette({ open, onOpenChange, onNavigate }: { open: boolean; onOpenChange: (open: boolean) => void; onNavigate: (route: string) => void }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  
  const commands = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', category: 'Navigation' },
    { id: 'pos', icon: ShoppingCart, label: 'Point of Sale', category: 'Navigation' },
    { id: 'inventory', icon: Package, label: 'Inventory', category: 'Navigation' },
    { id: 'sales', icon: Receipt, label: 'Sales', category: 'Navigation' },
    { id: 'purchases', icon: Truck, label: 'Purchases', category: 'Navigation' },
    { id: 'customers', icon: Users, label: 'Customers', category: 'Navigation' },
    { id: 'prescriptions', icon: ClipboardList, label: 'Prescriptions', category: 'Navigation' },
    { id: 'returns', icon: ArrowLeftRight, label: 'Returns', category: 'Navigation' },
    { id: 'reports', icon: FileBarChart2, label: 'Reports', category: 'Navigation' },
    { id: 'settings', icon: Settings, label: 'Settings', category: 'Navigation' },
    { id: 'branches', icon: Building2, label: 'Branches', category: 'Navigation' },
    { id: 'users', icon: UserCog, label: 'Users', category: 'Navigation' },
    { id: 'labels', icon: Printer, label: 'Print Labels', category: 'Navigation' },
    { id: 'offline', icon: WifiOff, label: 'Offline Queue', category: 'Navigation' },
  ];
  
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-lg">
        <Command className="rounded-lg border-0">
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input
              placeholder="Search commands, pages, products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 h-12"
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      onNavigate(cmd.id);
                      onOpenChange(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    <cmd.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{cmd.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{cmd.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const [route, setRoute] = useState("dashboard");
  const { isOnline } = useNetworkStatus();
  const { isRTL } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+K': () => setCommandOpen(true),
    'Ctrl+P': () => setRoute('pos'),
    'Ctrl+D': () => setRoute('dashboard'),
    'Ctrl+I': () => setRoute('inventory'),
    'F1': () => setRoute('dashboard'),
    'F2': () => setRoute('pos'),
    'F3': () => setRoute('inventory'),
    'F4': () => setRoute('sales'),
    'F5': () => setRoute('reports'),
  });
  
  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  
  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  
  return (
    <div className={`h-screen w-full bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          <span className="font-semibold">Zam Pharma</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setCommandOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className={`flex h-full md:h-screen ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar current={route} setCurrent={setRoute} user={currentUser} onLogout={handleLogout} />
        </div>
        
        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side={isRTL ? 'right' : 'left'} className="p-0 w-72">
            <div className="h-full overflow-y-auto">
              <MobileSidebar 
                current={route} 
                setCurrent={(r) => { setRoute(r); setSidebarOpen(false); }}
                user={currentUser}
                onLogout={handleLogout}
              />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="hidden md:block">
            <Topbar user={currentUser} onOpenCommand={() => setCommandOpen(true)} />
          </div>
          <AnimatePresence mode="wait">
            <motion.main key={route} initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.15}} className="flex-1 overflow-y-auto">
              <RouteView route={route}/>
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onNavigate={setRoute} />
      
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
      
      {/* Keyboard shortcuts help */}
      <div className="hidden md:block fixed bottom-4 right-4 text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 bg-muted rounded mr-1">Ctrl+K</kbd> Search
      </div>
    </div>
  );
}

// Mobile Sidebar Component
function MobileSidebar({ current, setCurrent, user, onLogout }: { current: string; setCurrent: (v: string) => void; user: any; onLogout: () => void }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: t('nav.dashboard') },
    { id: 'pos', icon: ShoppingCart, label: t('nav.pos') },
    { id: 'inventory', icon: Package, label: t('nav.inventory') },
    { id: 'sales', icon: Receipt, label: t('nav.sales') },
    { id: 'purchases', icon: Truck, label: t('nav.purchases') },
    { id: 'customers', icon: Users, label: t('nav.customers') },
    { id: 'prescriptions', icon: ClipboardList, label: t('nav.prescriptions') },
    { id: 'returns', icon: ArrowLeftRight, label: t('nav.returns') },
    { id: 'reports', icon: FileBarChart2, label: t('nav.reports') },
    { id: 'branches', icon: Building2, label: t('nav.branches') || 'Branches' },
    { id: 'users', icon: UserCog, label: t('nav.users') || 'Users' },
    { id: 'labels', icon: Printer, label: t('nav.labels') || 'Print Labels' },
    { id: 'offline', icon: WifiOff, label: t('nav.offline') || 'Offline Queue' },
    { id: 'settings', icon: Settings, label: t('nav.settings') },
  ];
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Pill className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold">Zam Pharma</div>
            <div className="text-xs text-muted-foreground">Pharmacy Management</div>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrent(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                current === item.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default App