const path = require('path');

const dbFilePath = path.resolve('db.json');
let db;

const initializeDatabase = async () => {
  if (!db) {
    const { Low } = await import('lowdb');
    const { JSONFile } = await import('lowdb/node');
    const adapter = new JSONFile(dbFilePath);
    db = new Low(adapter);

    await db.read();
    db.data ||= {
      users: [],
      companies: [],
      articles: [],
    };
    await db.write();
  }
};

const loadCollection = async (collectionName) => {
  await initializeDatabase();
  return db.data[collectionName];
};

const saveDatabase = async () => {
  await initializeDatabase();
  await db.write();
};

module.exports = { initializeDatabase, loadCollection, saveDatabase };
