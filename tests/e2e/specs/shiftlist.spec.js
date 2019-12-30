describe("Shift list table", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080/shifts");
  });

  it("lists all shifts", () => {
    cy.get("[data-cy=shift-table]")
      .should("contain", "Work time sum:")
      .should("contain", "25th November 2019")
      .should("contain", "26th November 2019")
      .should("contain", "27th November 2019");
  });

  context("no shift selected", () => {
    it("shows disabled edit button", () => {
      cy.get("[data-cy=shift-edit]").should("be.disabled");
    });

    it("shows disabled delete button", () => {
      cy.get("[data-cy=shift-delete]").should("be.disabled");
    });
  });

  context("one shift selected", () => {
    beforeEach(() => {
      // Select single shift
      cy.get(
        "tbody > :nth-child(1) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple"
      ).click();
    });

    afterEach(() => {
      // Reset selections
      cy.get(
        '[aria-label=""] > .v-data-table__checkbox > .v-input--selection-controls__ripple'
      )
        .click()
        .click();
    });

    it("shows enabled edit button", () => {
      cy.get("[data-cy=shift-edit]").should("not.be.disabled");
    });

    it("shows enabled delete button", () => {
      cy.get("[data-cy=shift-delete]")
        .should("not.be.disabled")
        .should("contain", "Delete (1 shift)");
    });

    it("shows an error when trying to delete a stale shift", () => {
      cy.server();
      cy.get("[data-cy=shift-delete]").click();
      cy.get("[data-cy=delete-dialog]").should("contain", "Delete shifts?");
      cy.get("[data-cy=delete-confirm]").click();
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
      cy.get("[data-cy=snackbar]").should("contain", "Not found.");
    });
  });

  context("multiple shifts selected", () => {
    beforeEach(() => {
      // Select two shifts
      cy.get(
        "tbody > :nth-child(1) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple"
      ).click();
      cy.get(
        ":nth-child(3) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple"
      ).click();
    });

    afterEach(() => {
      // Reset selections
      cy.get(
        '[aria-label=""] > .v-data-table__checkbox > .v-input--selection-controls__ripple'
      )
        .click()
        .click();
    });

    it("shows disabled edit button", () => {
      cy.get("[data-cy=shift-edit]").should("be.disabled");
    });

    it("shows enabled delete button", () => {
      cy.get("[data-cy=shift-delete]")
        .should("not.be.disabled")
        .should("contain", "Delete (2 shifts)");
    });

    it("shows a dismissable dialog to confirm deletion", () => {
      cy.get("[data-cy=shift-delete]").click();
      cy.get("[data-cy=delete-dialog]").should("contain", "Delete shifts?");
      cy.get("[data-cy=delete-cancel]").click();
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
    });

    it("deletes selected shifts on confirm", () => {
      cy.server();
      cy.route({ method: "DELETE", url: "**/shifts/*", response: {} });

      cy.route("GET", "/api/shifts/", [
        {
          id: "01c7098c-c209-4e61-86b2-da4652163ed9",
          tags: [],
          started: "2019-11-26T12:00:00+01:00",
          stopped: "2019-11-26T16:00:00+01:00",
          type: "st",
          note: "",
          was_reviewed: true,
          was_exported: false,
          created_at: "2019-11-27T19:53:45.394670+01:00",
          modified_at: "2019-11-27T19:53:45.394725+01:00",
          contract: "178bc9a6-132e-46ab-8fa2-df8e22c229b6"
        }
      ]);

      cy.get("[data-cy=shift-delete]").click();
      cy.get("[data-cy=delete-dialog]").should("contain", "Delete shifts?");
      cy.get("[data-cy=delete-confirm]").click();
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");

      cy.get("[data-cy=shift-table]")
        .should("not.contain", "25th November 2019")
        .should("contain", "26th November 2019")
        .should("not.contain", "27th November 2019");
    });
  });

  context("edit one shift", () => {
    beforeEach(() => {
      // Select single shift
      cy.get(
        "tbody > :nth-child(1) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple"
      ).click();
    });

    it("redirects to shift form", () => {
      cy.server();
      cy.route("GET", "/api/shifts/7d08fa88-8ab3-489f-b20f-06055a1cf939", {
        id: "7d08fa88-8ab3-489f-b20f-06055a1cf939",
        tags: [],
        started: "2019-11-27T00:00:00+01:00",
        stopped: "2019-11-27T19:53:06+01:00",
        type: "st",
        note: "",
        was_reviewed: true,
        was_exported: false,
        created_at: "2019-11-27T19:53:45.294094+01:00",
        modified_at: "2019-11-27T19:53:45.294180+01:00",
        contract: "178bc9a6-132e-46ab-8fa2-df8e22c229b6"
      });

      cy.get("[data-cy=shift-edit]").click();

      cy.url().should("contain", "7d08fa88-8ab3-489f-b20f-06055a1cf939/edit");
    });
  });
});
