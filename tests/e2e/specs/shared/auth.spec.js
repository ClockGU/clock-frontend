describe("Auth control", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");

    cy.login();
    cy.selectContract();
  });

  it.skip("refreshes the auth token", () => {
    // manually set the auth token to some value and check
    // that it is reset and we remain logged in!
  });

  it("redirects to the login page when refresh token expires", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: "/api/clockedinshifts/",
      status: 401,
      response: {
        code: "token_not_valid",
        detail: "Token is invalid or expired"
      }
    });

    cy.visit("http://localhost:8080");
    cy.url().should("include", "/login");
    cy.get(".v-snack__content").contains("Your session has expired.");
  });
});
