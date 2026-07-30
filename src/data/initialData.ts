import { Product, Category, Customer, Supplier, StoreSettings, User, Expense, SaleOrder } from '../types/pos';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Power Tools', description: 'Drills, grinders, saws, sanders', color: 'bg-red-500' },
  { id: 'cat-2', name: 'Hand Tools', description: 'Hammers, wrenches, screwdrivers, pliers', color: 'bg-amber-500' },
  { id: 'cat-3', name: 'Fasteners & Hardware', description: 'Screws, bolts, nails, anchors, hinges', color: 'bg-emerald-500' },
  { id: 'cat-4', name: 'Plumbing', description: 'Pipes, fittings, valves, faucets, sealant', color: 'bg-cyan-500' },
  { id: 'cat-5', name: 'Paints & Supplies', description: 'Wall paint, brushes, rollers, primers', color: 'bg-purple-500' },
  { id: 'cat-6', name: 'Electrical', description: 'Wires, switches, sockets, breakers, tape', color: 'bg-indigo-500' },
  { id: 'cat-7', name: 'Safety & Equipment', description: 'Helmets, gloves, goggles, masks', color: 'bg-rose-500' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'DeWalt 20V Max Cordless Drill',
    sku: 'DW-889001',
    category: 'Power Tools',
    sellingPrice: 129.99,
    costPrice: 85.00,
    currentStock: 14,
    minStockLevel: 5,
    unit: 'pcs',
    location: 'Aisle 1 - Bay A',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-102',
    name: 'Claw Hammer 20oz Heavy Duty',
    sku: 'HM-102002',
    category: 'Hand Tools',
    sellingPrice: 16.50,
    costPrice: 9.20,
    currentStock: 32,
    minStockLevel: 10,
    unit: 'pcs',
    location: 'Aisle 2 - Shelf B',
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-103',
    name: 'Stainless Steel Wood Screws (100pk)',
    sku: 'SC-330101',
    category: 'Fasteners & Hardware',
    sellingPrice: 8.99,
    costPrice: 4.10,
    currentStock: 4, // Low stock!
    minStockLevel: 15,
    unit: 'pcs',
    location: 'Aisle 3 - Drawer 12',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-104',
    name: 'PVC Pressure Pipe 1/2" (10ft)',
    sku: 'PV-401020',
    category: 'Plumbing',
    sellingPrice: 7.25,
    costPrice: 3.80,
    currentStock: 45,
    minStockLevel: 20,
    unit: 'pcs',
    location: 'Outdoor Rack C',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-105',
    name: 'Asian Paint Exterior White 5L',
    sku: 'PT-901005',
    category: 'Paints & Supplies',
    sellingPrice: 42.00,
    costPrice: 28.50,
    currentStock: 3, // Low stock!
    minStockLevel: 8,
    unit: 'pcs',
    location: 'Aisle 5 - Shelf C',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-106',
    name: 'Brass Ball Valve 3/4"',
    sku: 'PL-552010',
    category: 'Plumbing',
    sellingPrice: 11.80,
    costPrice: 6.50,
    currentStock: 22,
    minStockLevel: 10,
    unit: 'pcs',
    location: 'Aisle 4 - Shelf A',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-107',
    name: 'Heavy Duty Measuring Tape 8m / 26ft',
    sku: 'MT-881020',
    category: 'Hand Tools',
    sellingPrice: 12.50,
    costPrice: 6.00,
    currentStock: 18,
    minStockLevel: 6,
    unit: 'pcs',
    location: 'Aisle 2 - Pegboard 4',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-108',
    name: 'Electrical Insulation Tape Roll (Black)',
    sku: 'EL-110022',
    category: 'Electrical',
    sellingPrice: 2.50,
    costPrice: 0.90,
    currentStock: 2, // Low stock!
    minStockLevel: 25,
    unit: 'pcs',
    location: 'Aisle 6 - Drawer 2',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-109',
    name: 'Safety Glasses UV-Protective',
    sku: 'SF-778811',
    category: 'Safety & Equipment',
    sellingPrice: 6.99,
    costPrice: 3.20,
    currentStock: 28,
    minStockLevel: 10,
    unit: 'pcs',
    location: 'Aisle 7 - Rack A',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-110',
    name: 'WD-40 Multi-Use Lubricant Spray 400ml',
    sku: 'WD-400100',
    category: 'Paints & Supplies',
    sellingPrice: 9.50,
    costPrice: 5.40,
    currentStock: 19,
    minStockLevel: 8,
    unit: 'pcs',
    location: 'Aisle 5 - Counter Display',
    image: 'https://images.unsplash.com/photo-1618090584126-129cd1f3fbae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-111',
    name: 'Adjustable Pipe Wrench 12"',
    sku: 'WR-120011',
    category: 'Hand Tools',
    sellingPrice: 24.00,
    costPrice: 14.00,
    currentStock: 11,
    minStockLevel: 4,
    unit: 'pcs',
    location: 'Aisle 2 - Shelf D',
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-112',
    name: 'MCB Circuit Breaker 16A Single Pole',
    sku: 'EL-663016',
    category: 'Electrical',
    sellingPrice: 5.75,
    costPrice: 3.10,
    currentStock: 35,
    minStockLevel: 15,
    unit: 'pcs',
    location: 'Aisle 6 - Shelf B',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Apex Construction Co.',
    phone: '+1 555-0192',
    email: 'accounts@apexbuild.com',
    address: '402 Industrial Pkwy, Sector 4',
    totalDue: 245.50,
    creditLimit: 1000.00,
    totalPurchases: 2840.00,
    lastPurchaseDate: '2026-07-25'
  },
  {
    id: 'cust-2',
    name: 'Robert Jenkins (Plumber)',
    phone: '+1 555-0143',
    email: 'r.jenkins@gmail.com',
    address: '18 Oak Street, Westside',
    totalDue: 84.00,
    creditLimit: 300.00,
    totalPurchases: 620.00,
    lastPurchaseDate: '2026-07-24'
  },
  {
    id: 'cust-3',
    name: 'Metro Electric Services',
    phone: '+1 555-0188',
    email: 'info@metroelectric.com',
    address: '89 Commercial Road',
    totalDue: 0.00,
    creditLimit: 1500.00,
    totalPurchases: 1450.00,
    lastPurchaseDate: '2026-07-26'
  },
  {
    id: 'cust-4',
    name: 'David Miller (Contractor)',
    phone: '+1 555-0112',
    email: 'david.m.builds@yahoo.com',
    address: '102 Maple Ave',
    totalDue: 310.00,
    creditLimit: 500.00,
    totalPurchases: 980.00,
    lastPurchaseDate: '2026-07-23'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'BuildTech Tools & Fasteners Ltd',
    contactPerson: 'Sarah Connor',
    phone: '+1 800-555-0120',
    email: 'orders@buildtech.com',
    address: '88 Logistics Hub, Metro West',
    balanceDue: 450.00
  },
  {
    id: 'sup-2',
    name: 'National Pipe & Plumbing Wholesalers',
    contactPerson: 'Mark Peterson',
    phone: '+1 800-555-0199',
    email: 'sales@natpipe.com',
    address: '23 Warehouse Row',
    balanceDue: 0.00
  },
  {
    id: 'sup-3',
    name: 'Titan Power & Safety Gear',
    contactPerson: 'Alex Rivera',
    phone: '+1 800-555-0144',
    email: 'arivera@titangear.com',
    address: '500 Supply Way',
    balanceDue: 1200.00
  }
];

const today = new Date().toISOString().split('T')[0];

export const INITIAL_SALES: SaleOrder[] = [
  {
    id: 'ord-1001',
    receiptNumber: 'INV-20260726-001',
    date: today,
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    items: [
      {
        productId: 'prod-101',
        productName: 'DeWalt 20V Max Cordless Drill',
        sku: 'DW-889001',
        quantity: 1,
        unitPrice: 129.99,
        costPrice: 85.00,
        discount: 0,
        total: 129.99
      },
      {
        productId: 'prod-107',
        productName: 'Heavy Duty Measuring Tape 8m / 26ft',
        sku: 'MT-881020',
        quantity: 2,
        unitPrice: 12.50,
        costPrice: 6.00,
        discount: 0,
        total: 25.00
      }
    ],
    subtotal: 154.99,
    discountTotal: 0,
    taxTotal: 0,
    grandTotal: 154.99,
    profit: 57.99,
    paymentMethod: 'cash',
    amountPaid: 160.00,
    dueAmount: 0,
    customerId: 'cust-3',
    customerName: 'Metro Electric Services',
    customerPhone: '+1 555-0188',
    status: 'completed',
    cashierName: 'John (Cashier)'
  },
  {
    id: 'ord-1002',
    receiptNumber: 'INV-20260726-002',
    date: today,
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    items: [
      {
        productId: 'prod-102',
        productName: 'Claw Hammer 20oz Heavy Duty',
        sku: 'HM-102002',
        quantity: 3,
        unitPrice: 16.50,
        costPrice: 9.20,
        discount: 0,
        total: 49.50
      },
      {
        productId: 'prod-110',
        productName: 'WD-40 Multi-Use Lubricant Spray 400ml',
        sku: 'WD-400100',
        quantity: 2,
        unitPrice: 9.50,
        costPrice: 5.40,
        discount: 1.00,
        total: 18.00
      }
    ],
    subtotal: 68.50,
    discountTotal: 1.00,
    taxTotal: 0,
    grandTotal: 67.50,
    profit: 29.10,
    paymentMethod: 'upi',
    amountPaid: 67.50,
    dueAmount: 0,
    status: 'completed',
    cashierName: 'John (Cashier)'
  },
  {
    id: 'ord-1003',
    receiptNumber: 'INV-20260726-003',
    date: today,
    timestamp: Date.now() - 1000 * 60 * 210, // 3.5 hrs ago
    items: [
      {
        productId: 'prod-104',
        productName: 'PVC Pressure Pipe 1/2" (10ft)',
        sku: 'PV-401020',
        quantity: 10,
        unitPrice: 7.25,
        costPrice: 3.80,
        discount: 0,
        total: 72.50
      },
      {
        productId: 'prod-106',
        productName: 'Brass Ball Valve 3/4"',
        sku: 'PL-552010',
        quantity: 4,
        unitPrice: 11.80,
        costPrice: 6.50,
        discount: 0,
        total: 47.20
      }
    ],
    subtotal: 119.70,
    discountTotal: 0,
    taxTotal: 0,
    grandTotal: 119.70,
    profit: 55.70,
    paymentMethod: 'due',
    amountPaid: 0.00,
    dueAmount: 119.70,
    customerId: 'cust-1',
    customerName: 'Apex Construction Co.',
    customerPhone: '+1 555-0192',
    status: 'completed',
    cashierName: 'John (Cashier)',
    notes: 'Approved 15-day credit terms.'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'Electricity & Utilities',
    amount: 85.00,
    date: today,
    description: 'Monthly store shop electricity bill',
    paymentMethod: 'upi'
  },
  {
    id: 'exp-2',
    category: 'Freight & Transport',
    amount: 35.00,
    date: today,
    description: 'Local tempo delivery charge for pipe shipment',
    paymentMethod: 'cash'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Orine Hardware & Tools',
  tagline: 'Your Trusted Neighborhood Hardware Partner',
  address: 'Shop #12, Hardware Market, Main Boulevard, Karachi',
  phone: '+92 300 1234567',
  email: 'sales@orinehardware.com',
  taxNumber: 'NTN: 1234567-8',
  taxRate: 0, // Simplified tax or toggleable
  currencySymbol: 'PKR',
  receiptFooter: 'Thank you for shopping at Orine Hardware! Returns accepted within 7 days with valid receipt.',
  showLogoOnReceipt: true,
  showTaxOnReceipt: true,
  enableLowStockAlerts: true
};

export const INITIAL_USERS: User[] = [
  { id: 'usr-1', name: 'John Cashier', role: 'cashier', pin: '1234' },
  { id: 'usr-2', name: 'Store Owner (Admin)', role: 'admin', pin: '0000' }
];
