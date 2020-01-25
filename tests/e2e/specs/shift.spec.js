describe("ShiftForm", () => {
  context("general behaviour", () => {
    before(() => {
      cy.clock(Date.UTC(2019, 10, 20, 10));
      cy.server();
      cy.route("GET", "/api/contracts/", "fixture:contracts.json");
      cy.route("GET", "/api/shifts/", "fixture:shifts.json");

      cy.login();
      cy.selectContract();

      cy.visit("http://localhost:8080/shifts/create");
    });

    it("has selected the current date", () => {
      cy.get(":nth-child(4) > :nth-child(4) > .v-btn").should(
        "have.class",
        "v-btn--active"
      );
    });

    it("has selected default start and end times", () => {
      cy.get('[data-time-value="10:00"]');
      cy.get('[data-time-value="11:00"]');
    });

    it("has an enabled save button", () => {
      cy.get("[data-cy=shift-save]").should("be.enabled");
    });

    it("requires the start time to be before the end time", () => {
      cy.get("[data-cy=start]")
        .clear()
        .type("10:00");

      cy.get("[data-cy=end]")
        .clear()
        .type("08:00")
        .blur();

      cy.get(
        "[data-cy=shift-start-time] > .v-input > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message"
      ).should("contain", "A shift must start before it ends.");

      cy.get(
        "[data-cy=shift-end-time] > .v-input > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message"
      ).should("contain", "A shift must end after it starts.");

      cy.get("[data-cy=shift-save]").should("not.be.enabled");
    });

    it("has a tag input", () => {
      cy.get("[data-cy=tags]").type(
        "tag1{enter}tag2{enter}tag3{enter}{leftarrow}{leftarrow}{backspace}"
      );
      cy.get(".v-chip")
        .should("contain", "tag1")
        .should("contain", "tag3")
        .its("length")
        .should("eq", 2);

      cy.get(":nth-child(2) > .v-chip__content > .v-icon").click();
      cy.get(".v-chip")
        .its("length")
        .should("eq", 1);
    });

    it("has an enabled cancel button", () => {
      cy.get("[data-cy=shift-cancel]").should("be.enabled");
    });

    it("clicking the cancel button will redirect to previous view", () => {
      cy.get("[data-cy=shift-cancel]").click();
      cy.url().should("not.contain", "/shifts");
    });
  });

  context("creating shifts", () => {
    beforeEach(() => {
      cy.login();
      cy.selectContract();
      cy.visit("http://localhost:8080/shifts/create");
    });

    it("has no delete button", () => {
      cy.get("[data-cy=shift-form-delete-button]").should("not.be.visible");
    });

    it("can save a shift without input", () => {
      cy.server();
      cy.route({
        method: "POST",
        url: "/api/shifts/",
        response: {},
        status: 204
      });
      cy.get("[data-cy=shift-save]").click();
      cy.url().should("contain", "/");
    });
  });

  context("updating shifts", () => {
    beforeEach(() => {
      cy.login();
      cy.selectContract();
    });

    it("edit a shift", () => {
      cy.server();
      cy.route("GET", "/api/shifts/", "fixture:shifts.json");
      cy.route("GET", "/api/contracts/", "fixture:contracts.json");

      cy.visit(
        "http://localhost:8080/shifts/dac0ea17-e0d5-43dd-8032-bba8ac41f43c/edit"
      );

      cy.url().should(
        "contain",
        "/shifts/dac0ea17-e0d5-43dd-8032-bba8ac41f43c/edit"
      );

      cy.get(".accent--text > button").should("contain", "November 2019");
      cy.get(":nth-child(5) > :nth-child(2) > .v-btn").should(
        "have.class",
        "accent"
      );
      cy.get("[data-cy=start]").should("have.attr", "data-time-value", "18:20");
      cy.get("[data-cy=end]").should("have.attr", "data-time-value", "23:59");

      cy.get(
        "[data-cy=shift-tags] > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > :nth-child(1)"
      ).should("be.visible");
      cy.get(
        "[data-cy=shift-tags] > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > :nth-child(2)"
      ).should("be.visible");
    });

    it("has a delete button", () => {
      cy.server();
      cy.route("GET", "/api/shifts/", "fixture:shifts.json");
      cy.route("GET", "/api/contracts/", "fixture:contracts.json");

      cy.visit(
        "http://localhost:8080/shifts/dac0ea17-e0d5-43dd-8032-bba8ac41f43c/edit"
      );

      cy.get("[data-cy=shift-form-delete-button]").should("be.visible");
    });

    it("cannot edit shift in an exported report", () => {
      cy.server();
      cy.route("GET", "/api/contracts/", "fixture:contracts.json");
      cy.route("GET", "/api/shifts/", [
        {
          id: "6e4d3cad-681c-4b3f-b328-dc49be3d6f53",
          tags: [],
          started: "2019-10-13T06:30:00+02:00",
          stopped: "2019-10-13T08:56:00+02:00",
          type: "sk",
          note: "",
          was_reviewed: true,
          was_exported: true,
          created_at: "2019-09-13T08:53:23.180684+02:00",
          modified_at: "2019-09-13T08:54:08.613204+02:00",
          contract: "178bc9a6-132e-46ab-8fa2-df8e22c229b6"
        }
      ]);

      cy.visit(
        "http://localhost:8080/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53/edit"
      );

      cy.get("[data-cy=overlay]")
        .should("be.visible")
        .should("contain", "I'm sorry Dave");
      cy.get("[data-cy=overlay-ack]").click();
      cy.url().should("contain", "/");
    });

    it("shows an error when trying to save an exported shift", () => {
      cy.server();
      cy.route("GET", "/api/shifts/", [
        {
          id: "6e4d3cad-681c-4b3f-b328-dc49be3d6f53",
          tags: [],
          started: "2019-11-13T06:30:00+02:00",
          stopped: "2019-11-13T08:56:00+02:00",
          type: "sk",
          note: "",
          was_reviewed: true,
          was_exported: false,
          created_at: "2019-11-13T06:30:00+02:00",
          modified_at: "2019-11-13T06:30:00+02:00",
          contract: "178bc9a6-132e-46ab-8fa2-df8e22c229b6"
        }
      ]);
      cy.route(
        "PATCH",
        "/api/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53/",
        {
          detail:
            "Eine Schicht die bereits exportiert wurde darf nicht modifiziert werden."
        },
        { status: 403 }
      );

      cy.visit(
        "http://localhost:8080/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53/edit"
      );

      cy.get("[data-cy=shift-save]").click();
      cy.get("[data-cy=snackbar]").should(
        "contain",
        "Eine Schicht die bereits exportiert wurde darf nicht modifiziert werden."
      );
    });

    it("shows an error when trying to edit a stale shift", () => {
      cy.server();
      cy.route("GET", "/api/shifts/", [
        {
          id: "6e4d3cad-681c-4b3f-b328-dc49be3d6f53",
          tags: [],
          started: "2019-11-13T06:30:00+02:00",
          stopped: "2019-11-13T08:56:00+02:00",
          type: "sk",
          note: "",
          was_reviewed: true,
          was_exported: false,
          created_at: "2019-11-13T06:30:00+02:00",
          modified_at: "2019-11-13T06:30:00+02:00",
          contract: "178bc9a6-132e-46ab-8fa2-df8e22c229b6"
        }
      ]);

      cy.visit(
        "http://localhost:8080/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53/edit"
      );

      cy.get("[data-cy=shift-save]").click();
      cy.get("[data-cy=snackbar]").should("contain", "Not found.");
      cy.url().should(
        "contain",
        "/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53/edit"
      );
    });
  });

  context("deleting a shift", () => {
    before(() => {
      cy.server();
      cy.route("GET", "/api/shifts/", "fixture:shifts.json");
      cy.route("GET", "/api/contracts/", "fixture:contracts.json");

      cy.login();
      cy.selectContract();

      cy.visit(
        "http://localhost:8080/shifts/dac0ea17-e0d5-43dd-8032-bba8ac41f43c/edit"
      );
    });

    it("shows a confirm dialog when trying to delete", () => {
      cy.get("[data-cy=shift-form-delete-button]").click();
      cy.get("[data-cy=delete-dialog]", { timeout: 1000 }).should(
        "contain",
        "Are you sure you want to delete the selected shifts? This action is permanent."
      );
      cy.get("[data-cy=delete-dialog]").should("be.visible");
    });

    it("can cancel the delete dialog", () => {
      cy.get("[data-cy=delete-cancel]").click();
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
    });

    it("can cancel the delete dialog with escape key", () => {
      cy.get("[data-cy=shift-form-delete-button]").click();
      cy.focused().type("{esc}");
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
    });

    it("can delete a shift", () => {
      const time = new Date(2019, 10, 20, 10).getTime();
      cy.clock(time, ["Date"]);

      cy.server();
      cy.route("GET", "/api/shifts/", "fixture:shifts.json").as("shifts");

      cy.login();
      cy.selectContract();

      cy.visit(
        "http://localhost:8080/shifts/dac0ea17-e0d5-43dd-8032-bba8ac41f43c/edit"
      );

      cy.fixture("shifts.json").then(shifts => {
        cy.wait("@shifts");

        const remainingShifts = shifts.slice(1);
        cy.route("GET", "/api/shifts/", remainingShifts).as("remainingShifts");
        cy.route("DELETE", "/api/shifts/**", {});

        cy.get("[data-cy=shift-form-delete-button]").click();
        cy.get("[data-cy=delete-confirm]").click();
        cy.get(":nth-child(1) > .v-event > .pl-1").should("not.be.visible");
        cy.url().should("contain", "/month/2019/11/1");
      });
    });
  });
});

describe("returns to correct previous view", () => {
  beforeEach(() => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json").as("shifts");
    cy.route({
      method: "POST",
      url: "/api/shifts/",
      response: {},
      status: 204
    });
    cy.route({
      method: "PATCH",
      url: "/api/shifts/**",
      response: {},
      status: 204
    });

    cy.login();
    cy.selectContract();
  });

  context("when creating a shift", () => {
    it("redirects to generic calendar view", () => {
      cy.visit("http://localhost:8080/");
      cy.get("[data-cy=calendar-create-button]").click();
      cy.get("[data-cy=shift-save]").click();
      cy.url().should("contain", "/month/2019/11/1");
    });

    it("redirects to specific calendar view", () => {
      cy.visit("http://localhost:8080/day/2019/11/22");
      cy.get("[data-cy=calendar-create-button]").click();
      cy.get("[data-cy=shift-save]").click();
      cy.url().should("contain", "/day/2019/11/22");
    });

    it("redirects to shift list", () => {
      cy.visit("http://localhost:8080/shifts");
      cy.get("[data-cy=shift-create-button]").click();
      cy.url().should("contain", "/shifts/create");
      cy.get("[data-cy=shift-save]").click();
      cy.url().should("contain", "/shifts");
    });
  });

  context("when updating a shift", () => {
    it("redirects to generic calendar view", () => {
      cy.visit("http://localhost:8080/");
      cy.wait("@shifts");
      cy.get(":nth-child(1) > .v-event > .pl-1").click();
      cy.get("[data-cy=calendar-selected-event-edit]").click();
      cy.get("[data-cy=shift-save]").click();
      cy.url().should("contain", "/month/2019/11/1");
    });

    it("redirects to specific calendar view", () => {
      cy.visit("http://localhost:8080/day/2019/11/25");
      cy.wait("@shifts");
      cy.get(".v-event-timed").click();
      cy.get("[data-cy=calendar-selected-event-edit]").click();
      cy.get("[data-cy=shift-save]").click();
      cy.url().should("contain", "/day/2019/11/25");
    });

    it("redirects to shift list", () => {
      cy.visit("http://localhost:8080/shifts");
      cy.wait("@shifts");
      cy.get("[data-cy=shift-list-item-2]").click();
      cy.url().should(
        "contain",
        "/shifts/dac0ea17-e0d5-43dd-8032-bba8ac41f43c/edit"
      );
      cy.get("[data-cy=shift-save]").click();
      cy.url().should("contain", "/shifts");
    });
  });
});
