describe("Views", () => {
  context("anonymous user", () => {
    it("allows visiting login page", () => {
      cy.visit("http://localhost:8080/login");
      cy.url().should("contain", "/login");
    });

    it("allows visiting help page", () => {
      cy.visit("http://localhost:8080/help");
      cy.url().should("contain", "/help");
    });

    ["select", "shifts", "contracts", "changePassword", "report"].forEach(
      (path) => {
        it(`disallows visiting ${path} page`, () => {
          cy.visit(`http://localhost:8080/${path}`);
          cy.url().should("contain", "/login");
        });
      }
    );
  });

  context("logged in user has not selected contract", () => {
    beforeEach(() => {
      cy.server();
      cy.route("GET", "/contracts/", "fixture:contracts.json");

      cy.login();
    });

    it("allows visiting main page", () => {
      cy.visit("http://localhost:8080/");
      cy.url().should("contain", "/");
    });

    ["select", "help", "changePassword"].forEach((path) => {
      it(`allows visiting ${path} page`, () => {
        cy.visit(`http://localhost:8080/${path}`);
        cy.url().should("contain", `/${path}`);
      });
    });

    ["login", "shifts", "contracts", "report"].forEach((path) => {
      it(`disallows visiting ${path} page`, () => {
        cy.visit(`http://localhost:8080/${path}`);
        cy.url().should("contain", "/select");
      });
    });
  });

  context("logged in user has selected contract", () => {
    beforeEach(() => {
      cy.server();
      cy.route("GET", "/contracts/", "fixture:contracts.json");

      cy.login();
      cy.selectContract();
    });

    it("allows visiting main page", () => {
      cy.visit("http://localhost:8080/");
      cy.url().should("contain", "/");
    });

    [
      "select",
      "help",
      "changePassword",
      "shifts",
      "contracts",
      "report"
    ].forEach((path) => {
      it(`allows visiting ${path} page`, () => {
        cy.visit(`http://localhost:8080/${path}`);
        cy.url().should("contain", `/${path}`);
      });
    });

    it("disallows visiting login page", () => {
      cy.visit("http://localhost:8080/login");
      cy.url().should("contain", "/");
    });
  });
});
