import Dexie, { Table } from "dexie";
import { Product, Category, SaleOrder, Customer, CustomerPayment, Supplier, Expense } from "../types/pos";

export class BizMateDB extends Dexie {
  // Each module below is persisted in IndexedDB via Dexie, all accessed
  // through the shared DexieRepository pattern (see repositories.ts).
  products!: Table<Product, string>;
  categories!: Table<Category, string>;
  sales!: Table<SaleOrder, string>;
  customers!: Table<Customer, string>;
  customerPayments!: Table<CustomerPayment, string>;
  suppliers!: Table<Supplier, string>;
  expenses!: Table<Expense, string>;

  constructor() {
    super("BizMateDatabase");

    // v1: Products module
    this.version(1).stores({
      // 'id' is the primary key (string, e.g. "prod-1699999999999")
      // name, category, sku are indexed since ProductsList searches/filters by them
      products: "id, name, category, sku"
    });

    // v2: Categories & Sales modules added, using the same shared layer
    this.version(2).stores({
      products: "id, name, category, sku",
      // 'id' primary key (e.g. "cat-1699999999999"), name indexed for lookups
      categories: "id, name",
      // 'id' primary key (e.g. "sale-1699999999999"); date/timestamp/status/customerId
      // indexed since SalesHistoryView & ReportsView filter/sort by them
      sales: "id, date, timestamp, status, customerId"
    });

    // v3: Customers, CustomerPayments, Suppliers & Expenses added
    this.version(3).stores({
      products: "id, name, category, sku",
      categories: "id, name",
      sales: "id, date, timestamp, status, customerId",
      // 'id' primary key (e.g. "cust-..."), name/phone indexed for lookups & search
      customers: "id, name, phone",
      // 'id' primary key; customerId indexed so payments-by-customer is a fast query
      customerPayments: "id, customerId, date",
      // 'id' primary key, name indexed for lookups
      suppliers: "id, name",
      // 'id' primary key; category/date indexed since ReportsView filters/sorts by them
      expenses: "id, category, date"
    });
  }
}

export const db = new BizMateDB();
