const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./public'));

const config = {
  host: 'localhost',
  port: 5432,
  database: 'todos',
  user: 'postgres'
}
const db = pgp(config);

const todoList = [
  {
    id: 1,
    description: 'Implement a REST API',
    completed: false
  },
  {
    id: 2,
    description: 'Build a frontend',
    completed: false
  },
  {
    id: 3,
    description: '???',
    completed: false
  },
  {
    id: 4,
    description: 'Profit!',
    completed: false
  },
];

let nextId = 5;

// GET /api/todos
app.get('/api/todos', (req, res) => {
  //res.json(todoList); //send back todoList arary as JSON
  db.query('SELECT * FROM todos ORDER BY id')
    .then((results) => {
      res.json(results);
    })
})

// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todoList.find((currTodo) => {
    if (currTodo.id === id) {
      return true;
    } else {
      return false
    }
  });

  if (!todo) {
    res.status(404).json({
      error: `Could not find an item with ${id} for id`
    });
  } else {
    res.json(todo);
  }
})

// POST /api/todos
app.post('/api/todos', (req, res) => {
  if (req.body.description) {
    db.result("INSERT INTO todos (description) VALUES ($1)", req.body.description)
    .then(result => {
      res.status(201);
      res.send();
    })
  } else {
    res.status(422);
    res.json({
      error: 'please add a description'
    })
  }
})

// PUT /api/todos/:id
app.patch('/api/todos/:id', (req, res) => {
  if (req.body.description || req.body.description === '' || req.body.completed) {
    const id = parseInt(req.params.id);
    let query = 'UPDATE todos SET ';
    if (req.body.description) {
      query += ' description = ${description} '
    }
    if (req.body.description && req.body.completed) {
      query += ','
    }
    if (req.body.completed) {
      query += ' completed = ${completed}'
    }
    query += ' WHERE id = ${id}'
    db.result(query, {
      id: id,
      description: req.body.description,
      completed: req.body.completed
    })
    .then(result => {
      res.json(result)
    })
  } else {
    res.status(422).json({
      error: 'please provide a description'
    })
  }
})

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.result('DELETE FROM todos WHERE id = $1', id)
    .then(result => {
      if (result) {
        res.status(204).json()
      } else {
        res.status(404).json({error: `Could not find todo with id: ${id}`})
      }
    })
  
})

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
