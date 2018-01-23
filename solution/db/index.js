const pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432, 
  database: 'todo_list'
};

const db = pgp(cn);

module.exports = db;
