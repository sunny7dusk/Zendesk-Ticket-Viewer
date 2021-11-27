import { app } from "./server";
import supertest from "supertest";
import { ready, requester, serveFile } from "./endpointFunctions";
import { jest } from "@jest/globals";
import axios from "axios";
const request = supertest(app);

let fakeRes = (data, status) => {
  if (data !== null)
    return {
      send: (data) => Promise.resolve(data),
    };
  return {
    sendStatus: (data) => Promise.resolve(data),
  };
};

let mockRequest = await jest.spyOn(axios, "get").mockImplementation(() => {
  const fetchRes = {
    ok: false,
    json: () => Promise.resolve(false),
    status: () => Promise.resolve(500),
  };
  return Promise.resolve(fetchRes);
});

beforeEach(() => {
  mockRequest.mockRestore();
});

test("All files served", async () => {
  const index = await request.get("/");
  const script = await request.get("/client/script.js");
  const style = await request.get("/client/style.css");
  const ticket = await request.get("/client/ticket.js");
  expect(index.statusCode).toEqual(200);
  expect(script.statusCode).toEqual(200);
  expect(style.statusCode).toEqual(200);
  expect(ticket.statusCode).toEqual(200);
});

test("Serve failed", async () => {
  let testing = null;
  try {
    testing = await serveFile();
  } catch (e) {
    expect(testing).toBe(null);
  }
  mockRequest.mockRestore();
});

test("/ready", async () => {
  const testing = await request.get("/ready");
  expect(testing.statusCode).toEqual(200);
  expect(testing).not.toBe(null);
});

test("/ready fails", async () => {
  let testing = null;
  try {
    testing = await ready(null, mockRequest);
  } catch (e) {
    expect(testing).toBe(null);
  }
  mockRequest.mockRestore();
});

test("/requester", async () => {
  const testing = await request
    .get("/requester")
    .query({ id: "1909996704725" });
  expect(testing.statusCode).toEqual(200);
  expect(testing).not.toBe(null);
  expect(testing.text).toEqual("Nathaniel Zhuo En Chai");
});

test("/requester fails ", async () => {
  const testing = await request.get("/requester");
  expect(testing.statusCode).toEqual(500);
});
