const router = require("express").Router();
const Todos = require("../models/todos.js");


router.get("/", Todos.allTodos, (req, res, next) => {
  res.render("todos", { todosData: res.locals.todosData  });
});

module.exports = router;
