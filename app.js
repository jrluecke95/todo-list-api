const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./public'));

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
  res.json(todoList); //send back todoList arary as JSON
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
    const newTodo = {
      id: nextId++,
      description: req.body.description,
      completed: false
    };
    todoList.push(newTodo);
    res.status(201);
    res.send();
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
    const todoIndex = todoList.findIndex((currTodo) => currTodo.id === id ? true : false);

    if (req.body.description) {
      todoList[todoIndex].description = req.body.description;
    }
    
    if (req.body.completed === 'true' || req.body.completed === true) {
      todoList[todoIndex].completed = true;
    } else if (req.body.completed === 'false' || req.body.completed === false){
      todoList[todoIndex].completed = false
    }
      

    res.json(todoList[todoIndex])
  } else {
    res.status(422).json({
      error: 'please provide a description'
    })
  }
  

})

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todoList.findIndex((currTodo) => currTodo.id === id);
  if (todoIndex !== -1) {
    todoList.splice(todoIndex, 1);
  } else {
    res.status(404).json({
      error: 'could not find item with that id'
    })
  }

  res.status(204).json()
  
})

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
