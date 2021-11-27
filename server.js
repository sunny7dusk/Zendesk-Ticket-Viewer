import express from "express";
import path from "path";
import axios from "axios";
import { ready, serveFile, requester } from "./endpointFunctions.js";

export const app = express();
export const port = process.env.PORT || 8080;

app.get("/", (req, res) =>
  serveFile(req, res, path.join(path.resolve(), "./client/index.html"))
);
app.get("/client/script.js", (req, res) =>
  serveFile(req, res, path.join(path.resolve(), "./client/script.js"))
);
app.get("/client/style.css", (req, res) =>
  serveFile(req, res, path.join(path.resolve(), "./client/style.css"))
);
app.get("/client/ticket.js", (req, res) =>
  serveFile(req, res, path.join(path.resolve(), "./client/ticket.js"))
);

app.get("/ready", async (req, res) => ready(req, res));

app.get("/requester", async (req, res) => requester(req, res));

console.log(`Server started at http://localhost:${port}`);
