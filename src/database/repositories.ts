import { db } from "./db";
import { DexieRepository } from "./repository";
import { Product, Category, SaleOrder, Customer, CustomerPayment, Supplier, Expense } from "../types/pos";

/**
 * One repository per module, all built on the same DexieRepository<T, K>
 * base class. This is the single data-access pattern every module
 * (Products, Categories, Sales, Customers, Suppliers, Expenses, and any
 * future module) should use — add a Dexie table in db.ts, then instantiate
 * a repository for it here.
 */
export const productsRepository = new DexieRepository<Product, string>(db.products);
export const categoriesRepository = new DexieRepository<Category, string>(db.categories);
export const salesRepository = new DexieRepository<SaleOrder, string>(db.sales);
export const customersRepository = new DexieRepository<Customer, string>(db.customers);
export const customerPaymentsRepository = new DexieRepository<CustomerPayment, string>(db.customerPayments);
export const suppliersRepository = new DexieRepository<Supplier, string>(db.suppliers);
export const expensesRepository = new DexieRepository<Expense, string>(db.expenses);
