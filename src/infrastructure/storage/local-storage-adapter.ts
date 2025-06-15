import { STORAGE_KEY_NAME } from "@/domain/constants/app";

export class LocalStorageAdapter {
  private readonly storage: Storage;
  private readonly prefix: string;

  constructor() {
    this.storage = window.localStorage;
    this.prefix = `${STORAGE_KEY_NAME}-`;
  }

  /**
   * Checks if a key exists in localStorage
   * @param key The key to check
   * @returns boolean indicating if the key exists and has a value
   */
  public exist(key: string): boolean {
    const value = this.storage.getItem(this.prefix + key);
    return value !== null && value !== "undefined";
  }

  /**
   * Retrieves a JSON value from localStorage
   * @param key The key of the value to retrieve
   * @returns The parsed JSON value or null if not found
   */
  public getJson<T = object>(key: string): T | null {
    if (!this.exist(key)) {
      return null;
    }
    const value = this.storage.getItem(this.prefix + key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Stores a JSON value in localStorage
   * @param key The key under which to store the value
   * @param data The data to store (will be JSON stringified)
   */
  public setJson(key: string, data: unknown): void {
    this.storage.setItem(this.prefix + key, JSON.stringify(data));
  }

  /**
   * Retrieves a string value from localStorage
   * @param key The key of the value to retrieve
   * @returns The string value or null if not found
   */
  public get<T = string>(key: string): T | null {
    if (!this.exist(key)) {
      return null;
    }
    return this.storage.getItem(this.prefix + key) as unknown as T;
  }

  /**
   * Stores a string value in localStorage
   * @param key The key under which to store the value
   * @param data The data to store
   */
  public set(key: string, data: string): void {
    this.storage.setItem(this.prefix + key, data);
  }

  /**
   * Removes a key-value pair from localStorage
   * @param key The key to remove
   */
  public remove(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  /**
   * Clears all items from localStorage (including those without the prefix)
   */
  public clear(): void {
    this.storage.clear();
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
