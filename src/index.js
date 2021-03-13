const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const userAccount = users.find((user) => user.username === username);

  if (!userAccount) {
    return response.status(404).json({
      error: "User account not found!",
    });
  }

  request.userAccount = userAccount;

  return next();
}

function getTodo(userTodos, todoId) {
  const findedTodo = userTodos.find((todo) => todo.id === todoId);

  return findedTodo;
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({
      error: "Users already exists!",
    });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userAccount } = request;

  return response.json(userAccount.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userAccount } = request;

  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  userAccount.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userAccount } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const findedTodo = getTodo(userAccount.todos, id);

  if (!findedTodo) {
    return response.status(404).json({
      error: "Todo not found!",
    });
  }

  findedTodo.title = title;
  findedTodo.deadline = new Date(deadline);

  return response.status(201).json(findedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userAccount } = request;
  const { id } = request.params;

  const findedTodo = getTodo(userAccount.todos, id);

  if (!findedTodo) {
    return response.status(404).json({
      error: "Todo not found!",
    });
  }

  findedTodo.done = true;

  return response.json(findedTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userAccount } = request;
  const { id } = request.params;

  const findedTodo = getTodo(userAccount.todos, id);

  if (!findedTodo) {
    return response.status(404).json({
      error: "Todo not found!",
    });
  }

  userAccount.todos.splice(findedTodo, 1);

  return response.status(204).send();
});

module.exports = app;
