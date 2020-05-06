describe("Logout Dialog", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "/shifts/", "fixture:shifts.json");
    cy.route("GET", "/contracts/", "fixture:contracts.json");

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080/");
    cy.get("[data-cy=menu-logout]").click();
  });

  it("shows the logout form", () => {
    cy.get("[data-cy=logout-form]").contains(
      "div",
      "You sure you want to logout?"
    );
    cy.get("[data-cy=logout-form]").contains(
      "div",
      "You can come back later at any time."
    );
  });

  it("allows to cancel the logout", () => {
    cy.get("[data-cy=cancel]").click();
  });

  it("allows to cancel with escape key", () => {
    cy.get("[data-cy=logout-form]").type("{esc}");
  });

  it("performs the logout", () => {
    cy.get("[data-cy=logout]").click();
    cy.url().should("include", "/login");
  });
});
