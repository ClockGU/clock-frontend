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
  });

  context("creating shifts", () => {
    beforeEach(() => {
      cy.login();
      cy.selectContract();
      cy.visit("http://localhost:8080/shifts/create");
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
      // cy.route("GET", "/api/clockedinshifts/", {});

      cy.visit("http://localhost:8080/shifts/");

      // cy.get("[data-cy=overlay]")
      //   .should("be.visible")
      //   .should("contain", "I'm sorry Dave");
      // cy.get("[data-cy=overlay-ack]").click();
      // cy.url().should("contain", "/");
    });

    it("cannot edit shift in an exported report", () => {
      cy.server();
      cy.route("GET", "/api/contracts/", "fixture:contracts.json");
      cy.route("GET", "/api/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53", {
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
      });

      cy.visit(
        "http://localhost:8080/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53/edit"
      );

      cy.get("[data-cy=overlay]")
        .should("be.visible")
        .should("contain", "I'm sorry Dave");
      cy.get("[data-cy=overlay-ack]").click();
      cy.url().should("contain", "/");
    });

    it("shows an error when trying to edit a stale shift", () => {
      cy.server();
      cy.route("GET", "/api/shifts/6e4d3cad-681c-4b3f-b328-dc49be3d6f53", {
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
      });

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
});
