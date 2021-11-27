import path from "path";
import axios from "axios";
import fs from "fs";
import { error } from "console";
import { ticketsUrl, requesterUrl, auth } from "./cred.js";

let [user, pwd] = auth;

export async function ready(req, res) {
  let [listData, listDataFilledIndex] = [[[]], 0];
  try {
    let testing = null;
    let currUrl = ticketsUrl;
    do {
      testing = await axios.get(`${currUrl}`, {
        auth: {
          username: user,
          password: pwd,
        },
      });
      for (let ticket of testing.data.tickets) {
        if (listData[listDataFilledIndex] === undefined)
          listData.push([ticket]);
        else if (listData[listDataFilledIndex].length !== 24)
          listData[listDataFilledIndex].push(ticket);
        else listData[listDataFilledIndex++].push(ticket);
      }
      currUrl = testing.data.next_page;
    } while (currUrl !== null);
    res.send(listData);
  } catch (e) {
    // console.log(e);
    res.sendStatus(500);
  }
}

export function serveFile(req, res, path) {
  if (!fs.existsSync(path)) res.sendStatus(404);
  else res.sendFile(path);
}

export async function requester(req, res) {
  // console.log(req.query);
  let requesterId = req.query.id;
  try {
    if (requesterId === null || requesterId === undefined) throw error;
    let requester = await axios.get(`${requesterUrl}`, {
      auth: {
        username: user,
        password: pwd,
      },
      external_id: requesterId,
    });

    res.send(requester.data.users[0].name);
  } catch (e) {
    res.sendStatus(500);
  }
}
