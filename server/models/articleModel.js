const { loadCollection, saveDatabase } = require('../config/db');

const validateArticle = (article, companies) => {
  if (!article.id || !article.image || !article.title || !article.link || !article.date || !article.content) {
    throw new Error('All fields are required: related company, image, title, link, date, and content.');
  }
  if (!companies.find((c) => c.id === article.id)) {
    throw new Error('Invalid related company.');
  }
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/[^\s]*)?$/;
  if (!urlRegex.test(article.link)) {
    throw new Error('Invalid URL format for link.');
  }
};

const addArticle = async (article) => {
  const companies = await loadCollection('companies');
  validateArticle(article, companies);

  const articles = await loadCollection('articles');
  articles.push({ id: Date.now(), ...article });
  await saveDatabase();
  return article;
};

module.exports = { addArticle };
