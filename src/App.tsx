import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

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
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const updateQty = (id, delta) => setCart((c) => c.map((it) => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it));
  const remove = (id) => setCart((c) => c.filter((it) => it.id !== id));
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="gap-2"><ShoppingCart className="h-4 w-4"/>Cart ({cart.length})</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>POS Cart</SheetTitle>
          <SheetDescription>Scan, adjust quantities, and checkout.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Batch {item.batch} • Exp {item.expiry}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{(item.price).toFixed(2)} AFN</div>
                    <div className="text-xs text-muted-foreground">VAT {item.tax}%</div>
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
          {cart.length === 0 && <div className="text-sm text-muted-foreground">Cart is empty</div>}
        </div>
        <Separator className="my-4"/>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{total.toFixed(2)} AFN</span>
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <Select defaultValue="cash">
            <SelectTrigger className="w-full"><SelectValue placeholder="Payment"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full" onClick={onCheckout}><BadgeDollarSign className="h-4 w-4 mr-2"/>Checkout</Button>
        </div>
        <Button variant="outline" className="w-full mt-2"><Printer className="h-4 w-4 mr-2"/>Print Receipt</Button>
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

const routes = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "pos", label: "POS", icon: ShoppingCart },
  { key: "products", label: "Products", icon: Package },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "purchases", label: "Purchases", icon: Truck },
  { key: "sales", label: "Sales", icon: Receipt },
  { key: "suppliers", label: "Suppliers", icon: Users },
  { key: "companies", label: "Companies", icon: Factory },
  { key: "customers", label: "Customers", icon: UserCircle2 },
  { key: "prescriptions", label: "Prescriptions", icon: ClipboardList },
  { key: "returns", label: "Returns", icon: ArrowLeftRight },
  { key: "reports", label: "Reports", icon: FileBarChart2 },
  { key: "accounting", label: "Accounting", icon: BadgeDollarSign },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "audit", label: "Audit Log", icon: ShieldCheck },
];

function Sidebar({ current, setCurrent }) {
  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-16 flex items-center gap-2 px-4 border-b">
        <Pill className="h-6 w-6"/>
        <div className="font-semibold">ZamPharm</div>
        <Badge className="ml-auto" variant="secondary">v1</Badge>
      </div>
      <div className="p-2 overflow-y-auto">
        {routes.map((r) => (
          <button key={r.key} onClick={() => setCurrent(r.key)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted ${current===r.key?"bg-muted font-semibold":""}`}>
            <r.icon className="h-4 w-4"/>
            {r.label}
          </button>
        ))}
      </div>
      <div className="mt-auto p-4">
        <Card>
          <CardContent className="p-4 text-xs text-muted-foreground">
            <div className="font-medium text-foreground">Branch</div>
            <div className="flex items-center gap-2 mt-1">
              <Store className="h-4 w-4"/> Main Kabul
            </div>
            <div className="mt-2">Last sync: 3m ago</div>
            <Button variant="outline" className="mt-3 w-full"><RefreshCcw className="h-4 w-4 mr-2"/>Sync</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <div className="h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4"/>
          <Input placeholder="Quick search: products, customers, invoices..." className="pl-8"/>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon"><Printer className="h-5 w-5"/></Button>
            </TooltipTrigger>
            <TooltipContent>Print labels</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5"/></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {demoAlerts.map((a)=> (
              <DropdownMenuItem key={a.id} className="flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 mt-1"/>
                <div>
                  <div className="text-xs font-medium capitalize">{a.type}</div>
                  <div className="text-xs text-muted-foreground">{a.message}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2"><UserCircle2 className="h-5 w-5"/> Admin</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Switch branch</DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={LayoutGrid} title="Overview" extra={<div className="text-sm text-muted-foreground">Today • {new Date().toDateString()}</div>} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{t:"Sales",v:"AFN 124,500"},{t:"Invoices",v:"148"},{t:"Low Stock",v:"7"},{t:"Expiring 30d",v:"10"}].map((k,i)=> (
          <Card key={i}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{k.t}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">{k.v}</CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
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
          <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {demoAlerts.map((a)=> (
              <div key={a.id} className="p-3 rounded-xl border flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 mt-0.5"/>
                <div>
                  <div className="text-sm font-medium capitalize">{a.type}</div>
                  <div className="text-xs text-muted-foreground">{a.message}</div>
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
  const [cart, setCart] = useState([]);
  const [scan, setScan] = useState("");
  const [scanFeedback, setScanFeedback] = useState(null);

  // Barcode scanner integration
  const handleBarcodeScan = (barcode) => {
    const product = demoProducts.find(p => 
      p.barcode === barcode || 
      p.sku.toLowerCase() === barcode.toLowerCase()
    );
    
    if (product) {
      addToCart(product);
      setScanFeedback({ type: 'success', message: `Added ${product.name}` });
      setScan(""); // Clear search after successful scan
    } else {
      setScanFeedback({ type: 'error', message: `Product not found: ${barcode}` });
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

  return (
    <div className="p-4 space-y-4">
      <SectionHeader 
        icon={ShoppingCart} 
        title="Point of Sale" 
        cta={<POSDrawer cart={cart} setCart={setCart} onCheckout={()=>alert("Checked out (demo)")}/>} 
        extra={
          <div className="flex items-center gap-3">
            <ScannerStatus isScanning={isScanning} mode="normal" />
            <div className="text-sm text-muted-foreground">Scan barcode or search</div>
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
                <ScanLine className="absolute left-2 top-2.5 h-4 w-4" />
                <Input 
                  value={scan} 
                  onChange={(e) => handleScanInputChange(e.target.value)} 
                  placeholder="Scan barcode or type product name / SKU"
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setScan("")}>Clear</Button>
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
                    <div className="text-xs text-muted-foreground mt-1">Barcode: {p.barcode}</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-lg font-semibold">{p.price} AFN</div>
                      <Button size="sm" onClick={()=>addToCart(p)}><Plus className="h-4 w-4 mr-1"/>Add</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Name (optional)"/>
            <Input placeholder="Phone"/>
            <Select>
              <SelectTrigger><SelectValue placeholder="Discount"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><CreditCard className="h-4 w-4 mr-2"/>Add Payment Method</Button>
          </CardContent>
        </Card>
      </div>
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

  // Start new audit session
  const startAuditSession = () => {
    const sessionId = `AUDIT-${Date.now()}`;
    setAuditSession({
      id: sessionId,
      startTime: new Date().toISOString(),
      scannedProducts: [],
      missedProducts: [],
      discrepancies: []
    });
    setScannedItems([]);
    setBulkScanMode(true);
    setAuditProgress({ scanned: 0, total: demoProducts.length });
  };

  // End audit session
  const endAuditSession = () => {
    if (auditSession) {
      const missedProducts = demoProducts.filter(p => 
        !scannedItems.some(s => s.id === p.id)
      );
      
      setAuditSession(prev => ({
        ...prev,
        endTime: new Date().toISOString(),
        missedProducts,
        completion: ((scannedItems.length / demoProducts.length) * 100).toFixed(1)
      }));
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
          setScannedItems(prev => prev.map(item => 
            item.id === product.id 
              ? { ...item, scannedCount: item.scannedCount + 1, lastScanned: new Date().toISOString() }
              : item
          ));
        } else {
          setScanFeedback({ 
            type: 'success', 
            message: `Added to audit: ${product.name}`, 
            product,
            sessionProgress: `${scannedItems.length + 1}/${demoProducts.length}`
          });
          
          // Add to scanned items
          setScannedItems(prev => [...prev, {
            ...product,
            scannedCount: 1,
            actualCount: null,
            discrepancy: null,
            firstScanned: new Date().toISOString(),
            lastScanned: new Date().toISOString()
          }]);
          
          setAuditProgress(prev => ({ ...prev, scanned: prev.scanned + 1 }));
        }
      } else {
        setScanFeedback({ 
          type: 'success', 
          message: `Stock check: ${product.name}`, 
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
    setScannedItems(prev => prev.map(item => {
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
          </div>
        }
        extra={
          <div className="flex items-center gap-3">
            <ScannerStatus isScanning={isScanning} mode={bulkScanMode ? 'bulk' : 'normal'} />
            {bulkScanMode && auditSession && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {auditProgress.scanned}/{auditProgress.total} scanned
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Session: {auditSession.id}
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

      {/* Bulk Audit Progress */}
      {bulkScanMode && auditSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5"/>
              Bulk Audit Session: {auditSession.id}
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
                        <div className="text-sm text-green-600">Ready to complete audit</div>
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
  return (
    <div className="p-4 space-y-4">
      <SectionHeader icon={Settings} title="Settings" />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Pharmacy Name" defaultValue="ZamPharm"/>
            <Input placeholder="TIN / Tax ID"/>
            <Input placeholder="Address"/>
            <div className="flex items-center justify-between">
              <Label>Enable VAT</Label>
              <Switch defaultChecked/>
            </div>
            <Button><Save className="h-4 w-4 mr-2"/>Save</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Users & Roles</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Cashier</div>
                <div className="text-xs text-muted-foreground">POS, view stock</div>
              </div>
              <Checkbox defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Inventory Manager</div>
                <div className="text-xs text-muted-foreground">Stock & adjustments</div>
              </div>
              <Checkbox defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">All access</div>
              </div>
              <Checkbox defaultChecked/>
            </div>
            <Button variant="outline">Manage Roles</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Branches</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input placeholder="New Branch Name"/>
              <Button><Plus className="h-4 w-4 mr-1"/>Add</Button>
            </div>
            <div className="text-sm text-muted-foreground">Main Kabul • Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">Barcode Printer</div>
              <Switch defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">Thermal Receipt Printer</div>
              <Switch defaultChecked/>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">SMS Gateway</div>
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
  return (
    <div className="h-screen w-full bg-background text-foreground">
      <div className="flex h-full">
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
    </div>
  );
}

export default App