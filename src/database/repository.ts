import { Table } from "dexie";

/**
 * Generic repository wrapping a single Dexie table.
 *
 * Every module (Products, Categories, Sales, ...) gets the same
 * data-access surface: getAll, getById, add, put, bulkAdd, bulkPut,
 * delete, clear, count. Domain-specific repositories can extend this
 * class if they need extra queries (see repositories.ts).
 */
export class DexieRepository<T, K> {
  constructor(protected table: Table<T, K>) {}

  getAll(): Promise<T[]> {
    return this.table.toArray();
  }

  getById(id: K): Promise<T | undefined> {
    return this.table.get(id);
  }

  count(): Promise<number> {
    return this.table.count();
  }

  async add(item: T): Promise<T> {
    await this.table.add(item);
    return item;
  }

  async put(item: T): Promise<T> {
    await this.table.put(item);
    return item;
  }

  async bulkAdd(items: T[]): Promise<T[]> {
    if (items.length === 0) return items;
    await this.table.bulkAdd(items);
    return items;
  }

  async bulkPut(items: T[]): Promise<T[]> {
    if (items.length === 0) return items;
    await this.table.bulkPut(items);
    return items;
  }

  delete(id: K): Promise<void> {
    return this.table.delete(id);
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }

  /**
   * Loads every record from the table. If the table is empty and
   * `shouldSeed` is true (default), it's populated with `initialData`
   * first (used for first-run sample data, same pattern every module uses).
   */
  async loadOrSeed(initialData: T[], shouldSeed: boolean = true): Promise<T[]> {
    const existing = await this.getAll();
    if (existing.length === 0 && shouldSeed) {
      return this.bulkAdd(initialData);
    }
    return existing;
  }

  /** Clears the table and repopulates it with the given records. */
  async reset(items: T[]): Promise<T[]> {
    await this.clear();
    return this.bulkAdd(items);
  }
}
