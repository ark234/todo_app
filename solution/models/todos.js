const db = require("../db/index.js");

const Todos = {};

Todos.allTodos = (req, res, next) => {
  db.manyOrNone('SELECT * FROM todos')
    .then(data => {
      res.locals.todosData = data;
      next();
    })
    .catch(err => {
      console.log('db error: ' + err);
      next(err);
    });
};

module.exports = Todos;
