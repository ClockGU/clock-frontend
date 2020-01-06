describe("Contracts", () => {
  context("selecting a contract", () => {
    beforeEach(() => {
      cy.login();

      cy.server();
      cy.route("GET", "/api/contracts/", "fixture:contracts.json", {
        delay: 1000
      }).as("contracts");

      cy.visit("http://localhost:8080/contracts/");
    });

    it("initially shows a loading skeleton", () => {
      cy.get("[data-cy=skeleton]").should("be.visible");
      cy.wait("@contracts");
      cy.get("[data-cy=skeleton]").should("not.be.visible");
    });

    it("shows a list of contracts", () => {
      cy.get("[data-cy=contract-list]")
        .children()
        .should("have.length", 5);
    });

    it("each contract lists all details", () => {
      cy.get("[data-cy=contract-0]")
        .should("contain", "20:00 per month")
        .should("contain", "Cypress")
        .should("contain", "2019-10-01 until 2020-03-31");
    });

    it("lets us select one contract", () => {
      cy.get("[data-cy=contract-0]").click();
      cy.url().should("include", "/");
      cy.get("[data-cy=select-contract-button]").should("contain", "Cypress");
    });

    it("disables all but one contract, if a shift is clocked", () => {
      cy.server();
      cy.route("GET", "/api/clockedinshifts/", {
        id: "deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd",
        started: "2019-11-20T08:00:00.00000+01:00",
        created_at: "2019-11-20T08:00:00.00000+01:00",
        modified_at: "2019-11-20T08:00:00.00000+01:00",
        contract: "32157f66-8eca-4410-b6af-386d858d2804"
      });

      cy.visit("http://localhost:8080/contracts/");

      cy.get("[data-cy=contract-0] > .mx-auto").should(
        "have.class",
        "v-card--disabled"
      );
      cy.get("[data-cy=contract-1] > .mx-auto").should(
        "not.have.class",
        "v-card--disabled"
      );
      cy.get("[data-cy=contract-2] > .mx-auto").should(
        "have.class",
        "v-card--disabled"
      );
      cy.get("[data-cy=contract-3] > .mx-auto").should(
        "have.class",
        "v-card--disabled"
      );
    });
  });

  context("viewing the list of contracts", () => {
    beforeEach(() => {
      cy.server();
      cy.route("GET", "/api/contracts/", "fixture:contracts.json").as(
        "contracts"
      );

      cy.login();
      cy.selectContract();
      cy.visit("http://localhost:8080/contracts/");
    });

    it("initially shows a loading skeleton", () => {
      cy.get("[data-cy=skeleton]").should("be.visible");
      cy.wait("@contracts");
      cy.get("[data-cy=skeleton]").should("not.be.visible");
    });

    it("lists all contracts", () => {
      cy.get("[data-cy=contract-list]")
        .children()
        .should("have.length", 5);
    });

    it("each contract lists all details", () => {
      cy.get("[data-cy=contract-0]")
        .should("contain", "20:00 per month")
        .should("contain", "Cypress")
        .should("contain", "2019-10-01 until 2020-03-31");
    });

    it("each contract has two buttons", () => {
      cy.get("[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions]")
        .children()
        .should("have.length", 2);

      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=edit]"
      )
        .should("not.be.disabled")
        .should("contain", "Edit");

      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=delete]"
      )
        .should("not.be.disabled")
        .should("contain", "Delete");
    });

    it("shows a confirm dialog when trying to delete", () => {
      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=delete]"
      ).click();
      cy.get("[data-cy=delete-dialog]", { timeout: 1000 }).should(
        "contain",
        "You sure you want to delete this contract?"
      );
      cy.get("[data-cy=delete-dialog]").should("be.visible");
    });

    it("can cancel the delete dialog", () => {
      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=delete]"
      ).click();
      cy.get("[data-cy=delete-cancel]").click();
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
    });

    it("can cancel the delete dialog with escape key", () => {
      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=delete]"
      ).click();
      cy.focused().type("{esc}");
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
    });

    it("can delete a single contract", () => {
      cy.fixture("contracts.json").then(contracts => {
        cy.wait("@contracts");

        const remainingContracts = contracts.slice(1);
        cy.route("GET", "/api/contracts/", remainingContracts);
        cy.route(
          "DELETE",
          "/api/contracts/178bc9a6-132e-46ab-8fa2-df8e22c229b6/",
          {}
        );

        cy.get(
          "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=delete]"
        ).click();
        cy.get("[data-cy=delete-confirm]").click();
        cy.get("[data-cy=delete-dialog]").should("not.be.visible");
        cy.get("[data-cy=contract-list]")
          .children()
          .should("have.length", 4);
      });
    });

    it("shows a warning when we try to delete a contract", () => {
      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=delete]"
      ).click();
      cy.get("[data-cy=delete-confirm]").click();
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
      cy.get("[data-cy=snackbar]").should("contain", "Not found.");
    });
  });

  context("editing a contract", () => {
    beforeEach(() => {
      cy.server();
      cy.route("GET", "/api/contracts/", "fixture:contracts.json").as(
        "contracts"
      );

      cy.login();
      cy.selectContract();
      cy.visit("http://localhost:8080/contracts/");
    });

    it("redirects to contract form", () => {
      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=edit]"
      ).click();

      cy.url().should(
        "contain",
        "/contracts/178bc9a6-132e-46ab-8fa2-df8e22c229b6/edit"
      );
    });

    it("fills the contract form with all data", () => {
      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=edit]"
      ).click();

      cy.progressContractForm();
      cy.get("[data-cy=header]").should("contain", "Summary");
      cy.get("[data-cy=summary] > .v-card__text")
        .should("contain", "Cypress")
        .should("contain", "20:00")
        .should("contain", "2019-10-01 - 2020-03-31");
    });

    it("can update a contract without input", () => {
      cy.server();
      cy.route("PATCH", "**/contracts/*", {});

      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=edit]"
      ).click();

      cy.progressContractForm();

      // Submit data
      cy.get("[data-cy=save]").click();
      cy.url().should("include", "/contracts");
    });

    it("can update a contract", () => {
      cy.server();
      cy.route("PATCH", "**/contracts/*", {});

      cy.fixture("contracts.json").then(contracts => {
        cy.wait("@contracts");

        const editedContract = Object.assign({}, contracts[0], {
          name: "ABC",
          hours: 15
        });
        const remainingContracts = contracts.slice(1);
        const newContracts = [editedContract];
        Array.prototype.push.apply(newContracts, remainingContracts);
        cy.route("GET", "/api/contracts/", newContracts);

        cy.get(
          "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=edit]"
        ).click();

        cy.get("[data-cy=continue-step-one]").click();
        cy.get("[data-cy=continue-step-two]").click();

        cy.get("[data-cy=input-hours]")
          .clear()
          .type("15:00");
        cy.get("[data-cy=continue-step-three]").click();

        cy.get("[data-cy=input-contract]")
          .clear()
          .type("ABC");
        cy.get("[data-cy=continue-step-four]").click();

        cy.get("[data-cy=header]").should("contain", "Summary");
        cy.get("[data-cy=summary] > .v-card__text")
          .should("contain", "ABC")
          .should("contain", "15:00")
          .should("contain", "2019-10-01 - 2020-03-31");

        // Submit data
        cy.get("[data-cy=save]").click();
        cy.url().should("include", "/contracts");

        cy.get("[data-cy=contract-0]")
          .should("contain", "15:00 per month")
          .should("contain", "ABC")
          .should("contain", "2019-10-01 until 2020-03-31");
      });
    });

    it("shows a banner after adding shifts to the contract", () => {
      cy.server();
      cy.route("GET", "/api/shifts/", "fixture:shifts.json").as("shifts");
      cy.visit("http://localhost:8080/contracts/");

      cy.wait(["@shifts", "@contracts"]);

      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=edit]"
      ).click();

      cy.get("[data-cy=alert-step-one]").should(
        "contain",
        "You cannot change the start/end date, after adding shifts to the contract."
      );
      cy.get(
        "[data-cy=datepicker-step-one] > .v-picker__body > :nth-child(1) > :nth-child(1)"
      ).should("have.class", "v-date-picker-header--disabled");
      cy.get(
        "[data-cy=datepicker-step-one] > .v-picker__body > :nth-child(1) > :nth-child(2)"
      ).should("have.class", "v-date-picker-table--disabled");
      cy.get("[data-cy=continue-step-one]").click();

      cy.get("[data-cy=alert-step-two]").should(
        "contain",
        "You cannot change the start/end date, after adding shifts to the contract."
      );
      cy.get(
        "[data-cy=datepicker-step-two] > .v-picker__body > :nth-child(1) > :nth-child(1)"
      ).should("have.class", "v-date-picker-header--disabled");
      cy.get(
        "[data-cy=datepicker-step-two] > .v-picker__body > :nth-child(1) > :nth-child(2)"
      ).should("have.class", "v-date-picker-table--disabled");
    });

    it("shows an error when trying to edit a stale contract", () => {
      cy.get(
        "[data-cy=contract-0] > .mx-auto > [data-cy=contract-actions] > [data-cy=edit]"
      ).click();

      cy.progressContractForm();
      cy.get("[data-cy=save]").click();
      cy.get("[data-cy=snackbar]").should("contain", "Not found.");
      cy.url().should(
        "contain",
        "/contracts/178bc9a6-132e-46ab-8fa2-df8e22c229b6/edit"
      );
    });
  });

  context("adding a contract", () => {
    beforeEach(() => {
      const time = new Date(2019, 10, 20, 10).getTime();
      cy.clock(time, ["Date"]);

      cy.server();
      cy.route({
        method: "POST",
        url: "/api/contacts/",
        response: {},
        status: 204
      });

      cy.login();
      cy.visit("http://localhost:8080/contracts/create");
    });

    it("can create a contract", () => {
      cy.server();
      cy.route({
        method: "POST",
        url: "/api/contracts/",
        response: {},
        status: 204
      });

      // First step
      cy.get("[data-cy=header]").contains("Step 1 / 5");
      cy.get("[data-cy=continue-step-one]")
        .contains("Continue")
        .click();

      // Second step
      cy.get("[data-cy=header]").contains("Step 2 / 5");
      cy.get("[data-cy=continue-step-two]")
        .contains("Continue")
        .click();

      // Third step
      cy.get("[data-cy=header]").contains("Step 3 / 5");
      cy.get("[data-cy=continue-step-three]")
        .should("be.disabled")
        .contains("Continue");

      cy.get("input[mask=time]")
        .type("40")
        .blur();

      cy.get(".v-messages__message").contains(
        "Please enter a valid format (HH:MM)"
      );

      cy.get("input[mask=time]").type("00");

      cy.get("[data-cy=continue-step-three]")
        .should("not.be.disabled")
        .click();

      // // Fourth step
      cy.get("[data-cy=header]").contains("Step 4 / 5");
      cy.get("[data-cy=continue-step-four]")
        .should("be.disabled")
        .contains("Continue");

      cy.get("[data-cy=input-contract]").type("Cypress");
      cy.get("[data-cy=continue-step-four]")
        .should("not.be.disabled")
        .contains("Continue");

      cy.get("[data-cy=input-contract]").clear();
      cy.get("[data-cy=continue-step-four]")
        .should("be.disabled")
        .contains("Continue");

      cy.get("[data-cy=input-contract]").type("Cypress");
      cy.get("[data-cy=continue-step-four]").click();

      // Fifth step
      cy.get("[data-cy=header]").should("contain", "Summary");
      cy.get("[data-cy=summary] > .v-card__text")
        .should("contain", "Cypress")
        .should("contain", "40:00")
        .should("contain", "2019-11-01 - 2019-11-30");

      // Submit data
      cy.get("[data-cy=save]").click();
      cy.url().should("include", "/contracts");
    });
  });
});
