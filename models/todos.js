// import db connection
const db = require('../db/index.js');

// Todos model object
const Todos = {};

// Retrieve all todos
Todos.allTodos = (req, res, next) => {
	db
		.any('SELECT * FROM todos')
		.then(data => {
			res.locals.todosData = data;
			next();
		})
		.catch(err => {
			console.log('db error:', err);
			next(err);
		});
};

// Insert new todo
Todos.create = (req, res, next) => {
	db
		.one('INSERT INTO todos (title, description, is_done) VALUES ($1, $2, false) RETURNING id;', [
			req.body.title,
			req.body.description
		])
		.then(data => {
			res.locals.newTodoId = data.id;
			next();
		})
		.catch(error => {
			console.log('Error encountered in Todos.create. Error:', error);
			next(error);
		});
};

module.exports = Todos;
