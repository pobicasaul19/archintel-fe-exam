const fs = require('fs');
const path = require('path');
const { getCollection } = require('./config/db');

const exportSchema = async (collectionName, outputDir = './data') => {
  try {
    const collection = await getCollection(collectionName);
    const data = await collection.find({}).limit(10).toArray(); // Fetch a sample of 10 documents
    console.log(data)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const filePath = path.join(outputDir, `${collectionName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Schema for '${collectionName}' exported to ${filePath}`);
  } catch (error) {
    console.error(`Failed to export schema for '${collectionName}':`, error);
  }
};

const exportAllSchemas = async () => {
  try {
    const collections = ['user', 'company', 'article'];
    for (const collection of collections) {
      await exportSchema(collection);
    }
    console.log('All schemas exported successfully!');
  } catch (error) {
    console.error('Error exporting schemas:', error.message);
  }
};


exportAllSchemas();
