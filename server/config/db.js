const mongodb = require('mongodb');
const uri = process.env.uri;

if (!uri) {
  console.error('MongoDB connection URI is not defined.');
  throw new Error('MongoDB connection URI is missing. Please check your environment variables.');
}

// Helper function to get a MongoDB collection dynamically
const getCollection = async (collectionName) => {
  const client = new mongodb.MongoClient(uri);
  try {
    await client.connect();
    return client.db('DB').collection(collectionName);
  } catch (error) {
    console.error('Database connection failed:', error.message); // Log detailed error
    throw new Error('Failed to connect to the database.');
  }
};

// Predefined collection loaders for common collections
const loadUserCollection = () => getCollection('user');
const loadCompanyCollection = () => getCollection('company');
const loadArticleCollection = () => getCollection('article');

module.exports = {
  getCollection,
  loadUserCollection,
  loadCompanyCollection,
  loadArticleCollection,
};
