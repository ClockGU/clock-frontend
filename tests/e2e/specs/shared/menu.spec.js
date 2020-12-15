const PUBLIC_LINKS = ["Home", "Help"];
const PARTIALLY_LOGGED_IN_LINKS = ["", "Home", "Password", "Help", "Logout"];
const LOGGED_IN_LINKS = [
  "",
  "Home",
  "Shifts",
  "Contracts",
  "Report",
  "Password",
  "Help",
  "Logout"
];

describe("The public Sidebar", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");
  });

  it("shows icons only when collapsed", () => {
    cy.get("a").should("have.attr", "href", "/");
    cy.contains("div", "Home").should("not.be.visible");
  });

  it("shows icons and text when extended", () => {
    cy.get("header").find("button").click();
    cy.contains("div", "Home").should("be.visible");
  });

  it("shows only public links when logged out", () => {
    cy.get("[data-cy=menu-list]")
      .find(".v-list-item__content")
      .its("length")
      .should("eq", PUBLIC_LINKS.length);

    cy.get("[data-cy=menu-list]")
      .find(".v-list-item__content")
      .each(($el) => {
        expect(PUBLIC_LINKS.indexOf($el[0].innerText)).to.not.equal(-1);
      });
  });
});

describe("The private Sidebar", () => {
  it("shows links when logged in before selecting a contract", () => {
    cy.login();
    cy.visit("http://localhost:8080/select");

    // TODO: We need to wait, otherwise tests fail.
    cy.wait(1000);

    cy.get("[data-cy=menu-list]")
      .find(".v-list-item__content")
      .its("length")
      .should("eq", PARTIALLY_LOGGED_IN_LINKS.length);

    cy.get("[data-cy=menu-list]")
      .find(".v-list-item__content")
      .each(($el) => {
        expect(
          PARTIALLY_LOGGED_IN_LINKS.indexOf($el[0].innerText)
        ).to.not.equal(-1);
      });
  });

  it("shows links when logged in after selecting a contract", () => {
    cy.server();
    cy.route("GET", "/contracts/", "fixture:contracts.json");

    cy.login();
    cy.selectContract();
    cy.visit("http://localhost:8080/");

    // TODO: We need to wait, otherwise tests fail.
    cy.wait(1000);

    cy.get("[data-cy=menu-list]")
      .find(".v-list-item__content")
      .its("length")
      .should("eq", LOGGED_IN_LINKS.length);

    cy.get("[data-cy=menu-list]")
      .find(".v-list-item__content")
      .each(($el) => {
        expect(LOGGED_IN_LINKS.indexOf($el[0].innerText)).to.not.equal(-1);
      });
  });
});
