import dotenv from "dotenv";
dotenv.config();
export let ticketsUrl = "https://zccnate.zendesk.com/api/v2/tickets.json";
export let requesterUrl =
  "https://zccnate.zendesk.com/api/v2/users/search.json";
let user = `${process.env.USER}`;
let pwd = `${process.env.API_KEY}`;
export let auth = [user, pwd];
