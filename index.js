// add top level modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mustacheExpress = require('mustache-express');

// add routers
const todosRouter = require('./controllers/todos.js');

// basic app config
const app = express();
const PORT = process.env.PORT || 3000;

// wire up mustache teplating engine with express and
// declare views and public directories to be accessible
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// link up morgan and bodyParser middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect landing page to the root route
app.get('/', (req, res) => {
	res.render('main');
});

// attach todos router to the app under /todos path
app.use('/todos', todosRouter);

// set up error handling
app.use((err, req, res, next) => {
	console.log('Error encountered:', err);
	res.status(500);
	res.send(err);
});

// kick off server
app.listen(PORT, () => {
	console.log('Server started on', PORT);
});
