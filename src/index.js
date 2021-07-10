const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function verifyIfExistsReporitory(request, response, next) {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(404).json({ error: "ID is not an uuid" });
  }

  const repository = repositories.find((repository) => repository.id === id);
  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", verifyIfExistsReporitory, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", verifyIfExistsReporitory, (request, response) => {
  const { repository } = request;

  repositoryIndex = repositories.findIndex((repo) => repo.id === repository.id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyIfExistsReporitory, (request, response) => {
  const { repository } = request;
  repository.likes = ++repository.likes;

  return response.json(repository);
});

module.exports = app;
