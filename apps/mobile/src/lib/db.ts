import * as SQLite from "expo-sqlite";
import { Item, WearEvent } from "@closetclear/shared";
import { seedItems, seedWearEvents } from "../data/seeds";

const databaseName = "closetclear.db";
let memoryItems = [...seedItems];
let memoryWearEvents = [...seedWearEvents];

const openDb = (): SQLite.SQLiteDatabase | undefined => {
  try {
    return SQLite.openDatabase(databaseName);
  } catch (_error) {
    return undefined;
  }
};

const db = openDb();

const ensureTables = (): void => {
  if (!db) return;
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY NOT NULL, createdAt TEXT, updatedAt TEXT, imageUri TEXT, name TEXT, category TEXT, brand TEXT, color TEXT, material TEXT, season TEXT, formality INTEGER, condition TEXT, purchasePrice REAL, tags TEXT);"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS wear_events (id TEXT PRIMARY KEY NOT NULL, itemId TEXT, wornAt TEXT);"
    );
  });
};

ensureTables();

const seedIfEmpty = (): void => {
  if (!db) return;
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT COUNT(*) as count FROM items",
      [],
      (_, result) => {
        const count = result.rows.item(0).count as number;
        if (count === 0) {
          seedItems.forEach((item) => {
            tx.executeSql(
              "INSERT INTO items (id, createdAt, updatedAt, imageUri, name, category, brand, color, material, season, formality, condition, purchasePrice, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
              [
                item.id,
                item.createdAt,
                item.updatedAt,
                item.imageUri,
                item.name,
                item.category,
                item.brand,
                item.color,
                item.material,
                item.season,
                item.formality,
                item.condition,
                item.purchasePrice,
                JSON.stringify(item.tags)
              ]
            );
          });
          seedWearEvents.forEach((wear) => {
            tx.executeSql("INSERT INTO wear_events (id, itemId, wornAt) VALUES (?, ?, ?);", [wear.id, wear.itemId, wear.wornAt]);
          });
        }
      }
    );
  });
};

seedIfEmpty();

export const dbRepository = {
  async listItems(): Promise<Item[]> {
    if (!db) return memoryItems;
    return new Promise<Item[]>((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM items",
          [],
          (_, result) => {
            const rows: Item[] = [];
            for (let i = 0; i < result.rows.length; i += 1) {
              const row = result.rows.item(i);
              rows.push({
                ...row,
                formality: Number(row.formality),
                purchasePrice: row.purchasePrice ? Number(row.purchasePrice) : null,
                tags: row.tags ? JSON.parse(row.tags) : []
              });
            }
            resolve(rows);
          }
        );
      });
    });
  },
  async listWearEvents(): Promise<WearEvent[]> {
    if (!db) return memoryWearEvents;
    return new Promise<WearEvent[]>((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM wear_events",
          [],
          (_, result) => {
            const rows: WearEvent[] = [];
            for (let i = 0; i < result.rows.length; i += 1) {
              rows.push(result.rows.item(i));
            }
            resolve(rows);
          }
        );
      });
    });
  },
  async addItem(item: Item): Promise<void> {
    if (!db) {
      memoryItems = [item, ...memoryItems];
      return;
    }
    return new Promise<void>((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO items (id, createdAt, updatedAt, imageUri, name, category, brand, color, material, season, formality, condition, purchasePrice, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [
            item.id,
            item.createdAt,
            item.updatedAt,
            item.imageUri,
            item.name,
            item.category,
            item.brand,
            item.color,
            item.material,
            item.season,
            item.formality,
            item.condition,
            item.purchasePrice,
            JSON.stringify(item.tags)
          ],
          () => resolve()
        );
      });
    });
  },
  async addWearEvent(event: WearEvent): Promise<void> {
    if (!db) {
      memoryWearEvents = [event, ...memoryWearEvents];
      return;
    }
    return new Promise<void>((resolve) => {
      db.transaction((tx) => {
        tx.executeSql("INSERT INTO wear_events (id, itemId, wornAt) VALUES (?, ?, ?);", [event.id, event.itemId, event.wornAt], () => resolve());
      });
    });
  }
};
