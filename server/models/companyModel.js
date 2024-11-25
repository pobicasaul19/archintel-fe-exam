const { loadCollection, saveDatabase } = require('../config/db');

const validateCompany = (company) => {
  if (!company.logo || !company.name || !['Active, Inactive'].includes(company.status)) {
    throw new Error('All fields are required: logo, name, and status.');
  }
};

const addCompany = async (company) => {
  validateCompany(company);
  const companies = await loadCollection('companies');
  companies.push({ id: Date.now(), ...company });
  await saveDatabase();
  return company;
};

module.exports = { addCompany };
