describe("Login Page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    cy.visit("http://localhost:8080");
  });

  it("shows the login form", () => {
    cy.contains("div", "Login form");
  });

  it("has an enabled Login button", () => {
    cy.get(".v-card__actions").within(() => {
      cy.get("button").should("not.be.disabled");
    });
  });

  it("requires a password", () => {
    cy.get("input[name=email]").type("cypress@example.com{enter}");

    cy.get("div.v-messages__message").contains("Password is required");

    cy.get(".v-card__actions").within(() => {
      cy.get("button").should("be.disabled");
    });
  });

  it("requires an e-mail address", () => {
    cy.get("input[name=password]").type("cypress{enter}");

    cy.get("div.v-messages__message").contains("E-mail is required");

    cy.get(".v-card__actions").within(() => {
      cy.get("button").should("be.disabled");
    });
  });

  it("requires an valid e-mail", () => {
    cy.get("input[name=email]").type("cypress@example.{enter}");

    cy.get("div.v-messages__message").contains("Must be valid e-mail");

    cy.get(".v-card__actions").within(() => {
      cy.get("button").should("be.disabled");
    });
  });

  it("has a button to make password visible", () => {
    cy.get(".v-input__append-inner").click();
    cy.get("input[type=text]")
      .get("#password")
      .type("cypress");

    cy.get(".v-input__append-inner").click();
    cy.get("input[type=password]").get("#password");
  });

  it("will not let us login with wrong credentials", () => {
    cy.get("input[name=email]").type("cypress@example.com");
    cy.get("input[name=password]").type(`ABC{enter}`);
    cy.get("div")
      .should("have.class", "v-snack__content")
      .contains("No active account found with the given credentials")
      .should("be.visible");

    cy.get(".v-card__actions").within(() => {
      cy.get("button").should("not.be.disabled");
    });
  });

  it("will let us login with the keyboard only", () => {
    cy.get("input[name=email]").type("cypress@example.com");
    cy.get("input[name=password]").type(`cypress{enter}`);
    cy.url().should("include", "/select");
  });

  it("will let us login with the submit button", () => {
    cy.get("input[name=email]").type("cypress@example.com");
    cy.get("input[name=password]").type(`cypress`);

    cy.get(".v-card__actions").within(() => {
      cy.get("button").click();
    });

    cy.url().should("include", "/select");
  });
});
