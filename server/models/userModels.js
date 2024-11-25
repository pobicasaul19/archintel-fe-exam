const { loadCollection, saveDatabase } = require('../config/db');

const validateUser = (user) => {
  if (
    !user.firstname
    || !user.lastname
    || !['Writer', 'Editor'].includes(user.type)
    || !['Active', 'Inactive'].includes(user.status)
  ) {
    throw new Error('Invalid User data: firstname, lastname, type, and status are required.');
  }
};

const addUser = async (user) => {
  validateUser(user);
  const users = await loadCollection('users');
  users.push({ id: Date.now(), ...user });
  await saveDatabase();
  return user;
};

module.exports = { addUser };
