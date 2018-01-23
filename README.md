## TODO LAB

#### GANBARE

### Intro

Today we're going to build a canonical Todo application.  The basic requirements are

- A User can view all existing TODO tasks
- A User can create a new TODO task
- A User can update a TODO as being DONE
- A User can delete a TODO

TODO apps are commonly used examples for MVC/CRUD apps since they are relatively simple and outline a full CRUD structure.  One of the first examples or pieces of documentation for a new language or framework is typically a TODO app, fwiw.

### Setup
Let's light this candle.

Create a new directory `todo_lab` and `cd` into it.

Then run the following commands for the initial project setup:

- `npm init` --> and cycle through the various options
- `npm install -S morgan express body-parser mustache-express pg-promise`
- `git init`
- `touch .gitignore`

Lastly, open `.gitignore` in your editor and add the following to the top of the file:

`node_modules`

If you run `git status` from the terminal the following output should be displayed:

```bash
On branch master

Initial commit

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        .gitignore
        package-lock.json
        package.json

nothing added to commit but untracked files present (use "git add" to track)
```

Now add these changes and commit them.

Create a new repo on github and set the local repo's origin accordingly, then push up your changes.

### Index.js

##### Require all the things

Create an `index.js` file and open it in your editor.
At the top, add the following require statements to import express, the mustache templating engine, the body-parser middleware and morgan, our logger:

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mustacheExpress = require('mustache-express');
```

##### Config and Middleware

Now it's time to establish some basic configuration and add Middleware

First, let's initialize express and conditionally set a server port.  The syntax below will allow us later on to adjust the port with something called an `env` file, but for now it will default to 3000

```javascript
const app = express();
const PORT = process.env.PORT || 3000;
```

To wire up the mustache templating engine with express and declare a `views` and `public` directories to be accessible from our app add the following lines below where the app is initialized.

```javascript
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
```

At this point, go ahead and go to terminal and `mkdir` both a `views` and `public` directories inside your project directory

Go back to your editor and link up the morgan and bodyParser middlewares so we get nice logging when we run the server and so we can parse request body data.

```javascript
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
```

It may be a little odd to think of error handling as middleware, but it's a nice way to establish a catchall for any wayward web requests.

Add the following as the second to last thing we do in the file

```javascript
app.use((err, req, res, next) => {
	console.log('Error encountered:', err);
	res.status(500);
	res.send(err);
});
```

Finally, kick off the server by `listening` to the port declared from before

```javascript
app.listen(PORT, () => { console.log("Server started on " + PORT); });
```

As a last step, you can optionally add the following line to `package.json` under the `scripts` section to spin up a server without too much typing:

```javascript
"dev": "nodemon -e html,css,js index.js"
```

If you add that, make sure to either put a comma on the preceding line or this one depending
on which comes first.

Now, go to terminal and start the server either with the `nodemon` command above or just type `npm run dev`

The server should start, and if you navigate to `http://localhost:3000/` in a browser the following should be displayed

```
Cannot GET /
```

#### A controller and View

##### Say Welcome

Now we need to fix that 404 and actually render something to the browser.

In the `views` directory open up `main.html` in your editor.

Add a nice welcome message and a link to view all TODOs:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Welcome</title>
  </head>
  <body>
    <h1>Welcome!</h1>
    <a href="/todos">View All Todos!</a>
  </body>
</html>
```

and then connect it to the root route of your app by adding the following lines ABOVE the error handling in `index.js`

```javascript
app.get('/', (req, res) => {
  res.render('main');
});
```

Now refresh your browser and you should see the welcome message.  Click the link, and your browser should be directed to `http://localhost:3000/todos` with a `Cannot Get ...` message.

##### Display those TODOs
It should come as a shock that we're now going to fill out the todos routing and model.

`mkdir` a `controllers` directory and open up `controllers/todos.js` in an editor.

At the top of the file import express again and get the router module out of it

```javascript
const router = require("express").Router();
```

Next, declare a route for `/` which by convention should fetch the index or "get all" route for the TODOs

```javascript
router.get("/", (req, res, next) => {
  const todosData = [
    { id: 1, title: 'Clean Car', description: 'not fun' },
    { id: 2, title: 'Shave cat', description: 'why is that happening' },
    { id: 3, title: 'make pasta', description: 'need food' }
  ];
  res.render("todos", { todosData: todosData });
});
```

Don't forget to export the router at the bottom of the file:

```javascript
module.exports = router;
```

Now head back to `index.js` to import the router and mount it to the app:

At the top of the file add:

```javascript
const todosRouter = require('./controllers/todos');
```

Then, ABOVE the error handling add the following to attach the router to the app under the `/todos` path.
```javascript
app.use('/todos', todosRouter);
```

At this point, your `index.js` should look something like the following, fwiw:

```javascript
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
```

If you navigate to `/todos` in your browser, an error should be displayed in the terminal about not being able to find the todos view.  So let's add it!

In the `views` directory make a `todos.js` and display the todos:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Todos</title>
  </head>
  <body>
    <h3>All the TODOs</h3>
    {{#todosData}}
    <h4>{{id}}</h4>
    <p>{{title}} --> {{description}}</p>
    <p>is done: {{is_done}}</p>
    {{/todosData}}
  </body>
</html>
```

If everything goes as planned, you should be able to view the hardcoded TODOs from above in the browser.
YAY

#### The Model
So far, we're just returning hard coded TODOs from the server because we haven't built out the database yet.  So let's do that.

Go to terminal and `mkdir` a `db` directory.

Set up the `index.js` inside the `db` dir as usual.

```javascript
const pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'todos_list'
};

const db = pgp(cn);

module.exports = db;
```

Then add a `schema.sql` file
```sql
DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  is_done BOOLEAN
);
```

Now in terminal, make the db:
```bash
createdb todos_list
```

And run the schema file from the root of your project directory:

```bash
psql -f db/schema.sql -d todos_list
```

You should be able to open the db from a psql shell and insert/read rows from the new db

```sql
todos_list=# INSERT INTO todos (title, description, is_done) VALUES ('Make cat house', 'wat', false);
INSERT 0 1
todos_list=# SELECT * FROM todos;
 id |     title      | description | is_done
----+----------------+-------------+---------
  1 | cat            | bad         | f
  2 | Make cat house | wat         | f
(2 rows)
```

Having verified that the db is up and running, let's build out our todo model.

In terminal, `mkdir` a models directory and open up `todos.js` from the models dir in an editor and require the db

```javascript
const db = require("../db/index.js");
```

Now add a Todos model object and define a method for fetching all the todos from the db

```javascript
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
```

Now that we've define a model method it's time to hook it up to the controller

Back in `controllers/todos.js` require the todo model

```javascript
const todos = require("../models/todos.js");
```
and then call the middleware model method from the route handler and add it to the response like so:

```javascript
router.get("/", Todos.allTodos, (req, res, next) => {
  res.render("todos", { todosData: res.locals.todosData  });
});
```

Obviously, you can go ahead and delete the hardcoded todos.

And now, any TODOs that you added from the psql shell will display in the browser

### Next Steps

#### Create Form

Now that the groundplan is set, add another route for `/todos/new` and the associated view.
In the `new` view, write a form for creating a new TODO; it should have a title and description (since, status should always be not done for a new TODO, and the id is handled by the db).
Add a button to the form for submitting.  Then, write a js script that will preventDefault on the form's submit event and POST a request to the server to create a new todo.

Remember to add both the jquery lib and the script you wrote to the view for `/todos/new` in the view's html.  Put the js script in the `public` dir and then reference it as a relative path.  For example, if you `mkdir` a `public/js/` directory then add a `first_todo.js` script in that directory, you could simply refer to it with `src="js/first_todo.js"` in a script tag.

In the success callback for the ajax POST request, display a message on the page that a new TOOD was created and remove/hide the form.

Finally, add a link from the show all TODOs page to the form, and a link on the form back to the all TODOs page.

### Bonus

#### Make a TODO TODONE

Now it's time to update our todos.  Add a "TODONE" button to each TODO in the show all TODOS page that makes a PUT request to the server that toggles the is_done flag for the TODO to `true`

GOOD LUCK
