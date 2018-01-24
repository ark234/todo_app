// import express and get router module
const router = require('express').Router();
// import todos model
const Todos = require('../models/todos');

// fetch the index or 'get all' route for the TODOS
router.get('/', Todos.allTodos, (req, res, next) => {
	res.render('todos', { todosData: res.locals.todosData });
});

// route to new todo page
router.get('/new', (req, res, next) => {
	res.render('new');
});

// add new todo route
router.post('/new', Todos.create, (req, res, next) => {
	res.json({ id: res.locals.newTodoId, body: req.body });
});

module.exports = router;
