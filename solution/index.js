const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mustacheExpress = require('mustache-express');

const todosRouter = require('./controllers/todos');

const app = express();
const PORT = 3000;

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('main');
});

app.use('/todos', todosRouter);

app.use((err, req, res, next) => {
  console.log('Error encountered: ', err);
  res.status(500);
  res.send(err);
});

app.listen(PORT, () => { console.log('Server started on ' + PORT); });
