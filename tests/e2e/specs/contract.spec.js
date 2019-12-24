describe("Contract Page", () => {
  beforeEach(() => {
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

  it("Can create a contract", () => {
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

    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const lastDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // Fifth step
    cy.get("[data-cy=header]").should("contain", "Summary");
    cy.get("[data-cy=summary] > .v-card__text")
      .should("contain", "Cypress")
      .should("contain", "40:00")
      .should("contain", `2019-${currentMonth}-01 - 2019-${currentMonth}-${lastDayOfCurrentMonth}`);

    // Submit data
    cy.get("[data-cy=save]").click();
    cy.url().should("include", "/contracts");
  });
});
