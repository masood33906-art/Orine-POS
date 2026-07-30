export type PaymentMethod = 'cash' | 'card' | 'upi' | 'due' | 'split';

export type OrderStatus = 'completed' | 'refunded' | 'partially_refunded' | 'cancelled' | 'on_hold';

export interface Product {
  id: string;
  name: string;
  sku: string; // Barcode or SKU
  category: string;
  sellingPrice: number;
  costPrice: number;
  currentStock: number;
  minStockLevel: number;
  unit: string; // "pcs" (by piece)
  image?: string;
  location?: string; // Shelf location e.g., "Aisle 2 - Shelf B"
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number; // In currency value or percentage
  discountType: 'percentage' | 'fixed';
  subtotal: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discount: number;
  total: number;
}

export interface SaleOrder {
  id: string;
  receiptNumber: string;
  date: string; // ISO date string
  timestamp: number;
  items: SaleItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  profit: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  dueAmount: number;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  cashierName: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalDue: number;
  creditLimit: number;
  totalPurchases: number;
  lastPurchaseDate?: string;
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  date: string;
  receiptNumber: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  balanceDue: number;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  notes?: string;
}

export interface Expense {
  id: string;
  category: string; // e.g. "Rent", "Utilities", "Salary", "Freight", "Maintenance"
  amount: number;
  date: string;
  description: string;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string; // GSTIN / VAT ID
  taxRate: number; // percentage, e.g. 18
  currencySymbol: string;
  receiptFooter: string;
  showLogoOnReceipt: boolean;
  showTaxOnReceipt: boolean;
  enableLowStockAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cashier';
  pin?: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: 'dashboard' | 'sales' | 'inventory' | 'more';
}

export type MainTab = 'dashboard' | 'sales' | 'inventory' | 'more';
export type SalesSubTab = 'billing' | 'history' | 'returns' | 'customers' | 'dues' | 'reprint';
export type InventorySubTab = 'products' | 'categories' | 'stock' | 'purchases' | 'suppliers';
export type MoreSubTab = 'reports' | 'expenses' | 'store_settings' | 'receipt_settings' | 'backup' | 'notifications';
