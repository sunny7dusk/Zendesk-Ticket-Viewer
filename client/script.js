import { generateTicketList, clearContainer } from "/client/ticket.js";

let servingFiles = [
  "/",
  "/client/script.js",
  "/client/style.css",
  "/client/ticket.js",
];

function failed() {
  $(".insert").append(`<h3>Oop server connection failed :(</h3>`);
}

function successful(data) {
  console.log(data);
  generateTicketList(data, 0);
}

async function checkIfServed(url) {
  let checked = false;
  await $.ajax({
    url: url,
    type: "HEAD",
    error: () => (checked = false),
    success: () => (checked = true),
  });

  return checked;
}

$(document).ready(async () => {
  await $.ajax({
    type: "GET",
    url: "http://localhost:8080/ready",
    beforeSend: () => {
      $(".insert").append(`<h3>Loading data!</h3>`);
    },
    success: async (data) => {
      clearContainer();
      try {
        for (let fileUrl of servingFiles) {
          await checkIfServed(fileUrl);
        }
      } catch (e) {
        failed();
        return;
      }
      if (data === null) failed();
      else successful(data);
    },
    failure: () => {
      failed();
    },
  });
});
