describe("Visiting calender via specific URLs", () => {
  beforeEach(() => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");
    cy.route("DELETE", "/api/shifts/7d08fa88-8ab3-489f-b20f-06055a1cf939/", {});

    cy.login();
    cy.selectContract();
  });

  it("works with the month view", () => {
    cy.visit("http://localhost:8080/month/2019/11/20");
    cy.url().should("contain", "month/2019/11/1");
    cy.get("[data-cy=calendar-title]").should("contain", "November 2019");
  });

  it("works with the day view", () => {
    cy.visit("http://localhost:8080/day/2019/11/20");
    cy.url().should("contain", "day/2019/11/20");
    cy.get("[data-cy=calendar-title]").should("contain", "November 20th 2019");
  });

  it("works with the week view", () => {
    cy.visit("http://localhost:8080/week/2019/11/20");
    cy.url().should("contain", "week/2019/11/18");
    cy.get("[data-cy=calendar-title]").should(
      "contain",
      "November 18th 2019 -  24th"
    );
  });

  it("works with the 4day view", () => {
    cy.visit("http://localhost:8080/4day/2019/11/20");
    cy.url().should("contain", "4day/2019/11/20");
    cy.get("[data-cy=calendar-title]").should(
      "contain",
      "November 20th 2019 -  24th"
    );
  });
});

describe("Viewing the calendar", () => {
  beforeEach(() => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");
    cy.route("DELETE", "/api/shifts/7d08fa88-8ab3-489f-b20f-06055a1cf939/", {});

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080/");
  });

  context("general", () => {
    it("has an create shift button", () => {
      cy.get("[data-cy=calendar-create-button]")
        .should("be.visible")
        .click();
      cy.url().should("contain", "/shifts/create");
    });
  });

  context("we interact with the type button", () => {
    it("initially has selected the month type", () => {
      cy.get("[data-cy=calendar-type-select-button]").should(
        "contain",
        "Month"
      );
    });

    it("shows a dropdown when clicking the type select", () => {
      cy.get("[data-cy=calendar-type-select-button]")
        .click()
        .get("[data-cy=calendar-type-select]")
        .children()
        .should("have.length", "4");
    });

    ["day", "month", "week", "4days"].forEach(type => {
      const titles = {
        day: "November 20th 2019",
        month: "November 2019",
        week: "November 17th 2019 -  23rd",
        "4days": "November 20th 2019 -  24th"
      };
      it(`changes the calendar type to ${type}`, () => {
        cy.get("[data-cy=calendar-type-select-button]")
          .click()
          .get(`[data-cy=calendar-type-select-${type}]`)
          .click();

        cy.get("[data-cy=calendar-title]").should("contain", titles[type]);
      });
    });
  });

  context("changing months", () => {
    it("initially shows the current month", () => {
      cy.get("[data-cy=calendar-title]").should("contain", "November 2019");
    });

    it("can go back by one", () => {
      cy.get("[data-cy=calendar-previous-month]").click();
      cy.get("[data-cy=calendar-title]").should("contain", "October 2019");
    });

    it("can go forward by one", () => {
      cy.get("[data-cy=calendar-next-month]").click();
      cy.get("[data-cy=calendar-title]").should("contain", "December 2019");
    });

    it("can reset to todays date", () => {
      cy.get("[data-cy=calendar-previous-month]").click();
      cy.get("[data-cy=calendar-today]").click();
      cy.get("[data-cy=calendar-title]").should("contain", "November 2019");
    });
  });

  context("interacting with events", () => {
    it("opens a preview of the event on click", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event]")
        .should("be.visible");
    });

    it("event preview shows a shift summary", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event-text]")
        .should("contain", "19:53 on 27th November 2019")
        .should("contain", "From 00:00 AM until 19:53 PM");
    });

    it("event preview has two buttons", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event]")
        .get("[data-cy=calendar-selected-event-edit]")
        .get("[data-cy=calendar-selected-event-delete]");
    });

    it("redirects to the edit shift form", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event]")
        .get("[data-cy=calendar-selected-event-edit]")
        .click();

      cy.url().should(
        "contain",
        "/shifts/7d08fa88-8ab3-489f-b20f-06055a1cf939/edit"
      );
    });

    it("shows a confirm dialog to delete shift", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event]")
        .get("[data-cy=calendar-selected-event-delete]")
        .click();

      cy.get("[data-cy=calendar-delete-shift-dialog]").should("be.visible");
      cy.get("[data-cy=calendar-delete-shift-confirm]").should("be.visible");
      cy.get("[data-cy=calendar-delete-shift-cancel]").should("be.visible");
    });

    it("lets us discard the dialog with the cancel button", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event]")
        .get("[data-cy=calendar-selected-event-delete]")
        .click();

      cy.get("[data-cy=calendar-delete-shift-dialog]").should("be.visible");
      cy.get("[data-cy=calendar-delete-shift-cancel]").click();
      cy.get("[data-cy=calendar-delete-shift-dialog]").should("not.be.visible");
    });

    it("lets us discard the dialog with escape key", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event]")
        .get("[data-cy=calendar-selected-event-delete]")
        .click();

      cy.get("[data-cy=calendar-delete-shift-dialog]").should("be.visible");
      cy.focused().type("{esc}");
      cy.get("[data-cy=calendar-delete-shift-dialog]").should("not.be.visible");
    });

    it("deletes the shift", () => {
      cy.get(":nth-child(4) > .v-event > .pl-1")
        .click()
        .get("[data-cy=calendar-selected-event]")
        .get("[data-cy=calendar-selected-event-delete]")
        .click();

      cy.get("[data-cy=calendar-delete-shift-dialog]").should("be.visible");
      cy.get("[data-cy=calendar-delete-shift-confirm]").click();
      cy.get("[data-cy=calendar-delete-shift-dialog]").should("not.be.visible");

      cy.get(":nth-child(4) > .v-event > .pl-1").should("not.be.visible");
    });
  });
});
