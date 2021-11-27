let [currData, currPage] = [[], 0];

export function generatePageNav(focused) {
  for (let i in currData) {
    let item = parseInt(i);
    $(".footerNav").append(
      `<button class="nav-button" style="${
        item === focused ? "color: blue;" : "color:black;"
      }">${item + 1}</button>`
    );
  }
  $(".footerNav").on("click", ".nav-button", function () {
    currPage = parseInt($(this).text()) - 1;
    generateTicketList(currData, currPage);
    window.scrollTo(0, 0);
  });
}

export function generateTicketList(data, page) {
  clearContainer();
  [currData, currPage] = [data, page];

  let currListIndex = 0;
  for (let curr of data[currPage]) {
    $(".insert").append(`<div class="ticket" ${generateBorderColor(
      curr.status
    )} id="${currListIndex}">
      ${generateTag(curr.status)}
      ${generateTitle(curr.subject)}
    </div>`);
    currListIndex++;
  }
  onTicketClickListener();
  generatePageNav(currPage);
}

function generateTicketExpended(ticket, responderName) {
  clearContainer();

  $(".insert").append(`<div class="ticket-expended" ${generateBorderColor(
    ticket.status
  )}>
  ${generateTitle(ticket.subject)}
  <h5>Requester: ${responderName}</h5>
  <p>${ticket.description}</p>
  <button id="back-button">Click here to go back to list</button>
</div>`);

  $("#back-button").click(() => {
    generateTicketList(currData, currPage);
  });
}

function onTicketClickListener() {
  $(".insert").on("click", ".ticket", async function () {
    let ticketToDisplay = currData[currPage][parseInt(this.id)];
    await $.ajax({
      type: "GET",
      url: "http://localhost:8080/requester",
      data: {
        id: ticketToDisplay.requester_id,
      },
      beforeSend: () => {
        clearContainer();
        $(".insert").append(`<h3>Loading data!</h3>`);
        event.stopPropagation();
        event.stopImmediatePropagation();
      },
      success: (responder) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        generateTicketExpended(ticketToDisplay, responder);
      },
      failure: () => {
        clearContainer();
        $(".insert").append(`<h3>Server failed oop</h3>`);
        console.log("failed");
      },
    });
  });
}

export function clearContainer() {
  $(".insert").off();
  $(".footerNav").off();
  $("#backButton").off();
  $(".insert").empty();
  $(".footerNav").empty();
}

function generateBorderColor(data) {
  return data === "open"
    ? `style="border: 1px red solid;"`
    : data === "solved"
    ? `style="border: 1px green solid;"`
    : `style="border: 1px yellow solid;"`;
}

function generateTitle(data) {
  return `<h3 class="title">${data}</h3>`;
}

function generateTag(data) {
  return data === "open"
    ? `<h3 class="tag">O</h3>`
    : data === "solved"
    ? `<h3 class="tag">S</h3>`
    : `<h3 class="tag">W</h3>`;
}
