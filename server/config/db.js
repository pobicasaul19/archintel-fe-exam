const mongodb = require('mongodb');
const uri = process.env.uri;

// Validate the URI at startup
if (!uri) {
  console.error('MongoDB connection URI is not defined.');
  throw new Error('MongoDB connection URI is missing. Please check your environment variables.');
}

let client;

// Reuse the MongoDB client to avoid creating multiple connections
const connectToDB = async () => {
  if (!client) {
    try {
      client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
  }
  return client;
};

// Helper function to get a MongoDB collection dynamically
const getCollection = async (collectionName) => {
  const client = await connectToDB();
  return client.db('DB').collection(collectionName);
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
