describe("when no shifts are clocked", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");
    cy.route({
      method: "GET",
      url: "/api/clockedinshifts/",
      data: {},
      status: 404
    });
    cy.route("POST", "/api/clockedinshifts/", "fixture:clockin_short.json");

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080");
  });

  it("shows a clock in message", () => {
    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
  });

  it("shows the duration after a shift is started", () => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.get("[data-cy=clock-in-out-button]").click();
    cy.tick(1);
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h00m00s");

    cy.tick(999);
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h00m01s");
  });

  it("can clock out of a shift after waiting long enough", () => {
    cy.server();
    cy.route(
      "DELETE",
      "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      {}
    );
    cy.route("POST", "/api/shifts/", {});
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.get("[data-cy=clock-in-out-button]").click();
    cy.tick(10 * 60 * 1000);
    cy.get("[data-cy=clock-in-out-button]").click();

    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
    cy.tick(1000);
    cy.wait(1000);
  });
});

describe("when a shift was already clocked before loading the page", () => {
  beforeEach(() => {
    cy.login();
    cy.selectContract();

    const time = new Date(2019, 10, 20, 10, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");
    cy.route("POST", "/api/shifts/", {});
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");
    cy.route("GET", "/api/clockedinshifts/", "fixture:clockin_short.json");
    cy.route(
      "DELETE",
      "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      {}
    );
    cy.route("POST", "/api/clockedinshifts/", {});

    cy.visit("http://localhost:8080");
    cy.tick(1000);
    cy.wait(100);
  });

  it("can clock out", () => {
    cy.get("[data-cy=clock-in-out-button]").click();
    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
  });

  it("shows an error when trying to delete a stale shift", () => {
    cy.server();
    cy.route({
      method: "DELETE",
      url: "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      body: { detail: "Not found." },
      status: 404
    });

    cy.get("[data-cy=clock-in-out-button]").click();
    cy.get("[data-cy=snackbar]").should("contain", "Not found.");
    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
  });
});

describe("handles clock-actions in other browser sessions accordingly", () => {
  beforeEach(() => {
    cy.login();
    cy.selectContract();

    const time = new Date(2019, 10, 20, 10, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");
    cy.route("POST", "/api/shifts/", {});
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");
    cy.route(
      "DELETE",
      "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      {}
    );
    cy.route("POST", "/api/clockedinshifts/", {});
  });

  it("starts a new clock when it was started after loading the current page", () => {
    cy.server();
    cy.route("GET", "/api/clockedinshifts/", "fixture:clockin_short.json");
    cy.visit("http://localhost:8080");
    cy.tick(1000);
    cy.wait(100);

    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
    cy.get('[href="/shifts"]').click();
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h10m01s");
    cy.tick(60000);
    cy.wait(1000);
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h11m01s");
  });

  it("replaces clock when it was started after loading the current page", () => {
    cy.server();
    cy.route("GET", "/api/clockedinshifts/", "fixture:clockin_short.json");

    cy.visit("http://localhost:8080");
    cy.tick(1000);
    cy.wait(100);

    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
    cy.get('[href="/shifts"]').click();
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h10m01s");
    cy.tick(60000);
    cy.wait(1000);
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h11m01s");

    cy.server();
    cy.route("GET", "/api/clockedinshifts/", {
      id: "deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd",
      started: "2019-11-20T08:00:00.00000+01:00",
      created_at: "2019-11-20T08:00:00.00000+01:00",
      modified_at: "2019-11-20T08:00:00.00000+01:00",
      contract: "178bc9a6-132e-46ab-8fa2-df8e22c229b6"
    });
    cy.get('[href="/changePassword"]').click();
    cy.get("[data-cy=clock-in-out-button]").should("contain", "02h11m01s");
    cy.tick(60000);
    cy.wait(1000);
    cy.get("[data-cy=clock-in-out-button]").should("contain", "02h12m01s");
  });

  it("resets the clock if it was stopped after loading the page", () => {
    cy.server();
    cy.route("GET", "/api/clockedinshifts/", "fixture:clockin_short.json");

    cy.visit("http://localhost:8080");
    cy.tick(1000);
    cy.wait(100);

    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
    cy.get('[href="/shifts"]').click();
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h10m01s");
    cy.tick(60000);
    cy.wait(1000);
    cy.get("[data-cy=clock-in-out-button]").should("contain", "00h11m01s");

    cy.server();
    cy.route({
      method: "GET",
      url: "/api/clockedinshifts/",
      data: {},
      status: 404
    });
    cy.get('[href="/changePassword"]').click();
    cy.tick(1000);
    cy.wait(1000);
    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
  });
});

describe("forces to change contract when a shift is clocked outside the current contract", () => {
  beforeEach(() => {
    cy.login();
    cy.selectContract();

    const time = new Date(2019, 10, 20, 10, 10).getTime();
    cy.clock(time, ["Date"]);

    cy.visit("http://localhost:8080");
  });
  it("shows an undismissable dialog informing the user what is going to happen", () => {
    cy.server();
    cy.route("GET", "/api/clockedinshifts/", {
      id: "deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd",
      started: "2019-11-20T08:00:00.00000+01:00",
      created_at: "2019-11-20T08:00:00.00000+01:00",
      modified_at: "2019-11-20T08:00:00.00000+01:00",
      contract: "32157f66-8eca-4410-b6af-386d858d2804"
    });

    cy.get('[href="/report"]').click();
    cy.tick(1000);
    cy.wait(1000);

    cy.get("[data-cy=change-contract]").should("be.visible");

    // Cannot discard it through escape key
    cy.focused().type("{esc}");
    cy.get("[data-cy=change-contract]").should("be.visible");
  });

  it("redirects the user on button click", () => {
    cy.server();
    cy.route("GET", "/api/clockedinshifts/", {
      id: "deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd",
      started: "2019-11-20T08:00:00.00000+01:00",
      created_at: "2019-11-20T08:00:00.00000+01:00",
      modified_at: "2019-11-20T08:00:00.00000+01:00",
      contract: "32157f66-8eca-4410-b6af-386d858d2804"
    });

    cy.get('[href="/report"]').click();
    cy.tick(1000);
    cy.wait(1000);

    cy.get("[data-cy=redirect]").click("");
    cy.url().should("contain", "/select");
  });

  ["select", "createContract", "help", "changePassword"].forEach(path => {
    it(`allows visiting ${path} page without showing the dialog`, () => {
      cy.server();
      cy.route("GET", "/api/clockedinshifts/", {
        id: "deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd",
        started: "2019-11-20T08:00:00.00000+01:00",
        created_at: "2019-11-20T08:00:00.00000+01:00",
        modified_at: "2019-11-20T08:00:00.00000+01:00",
        contract: "32157f66-8eca-4410-b6af-386d858d2804"
      });

      cy.visit(`http://localhost:8080/${path}`);
      cy.url().should("contain", `/${path}`);

      cy.tick(1000);
      cy.wait(1000);

      cy.get("[data-cy=change-contract]").should("not.be.visible");
    });
  });
});

describe.only("expired tokens", () => {
  beforeEach(() => {
    cy.login();
    cy.selectContract();

    const time = new Date(2019, 10, 20, 11).getTime();
    cy.clock(time, ["Date"]);

    cy.server();
    cy.route("GET", "/api/clockedinshifts/", "fixture:clockin_short.json");

    cy.visit("http://localhost:8080/help");
    cy.tick(1000);
    cy.wait(1000);
  });

  it("handles an expired refresh token", () => {
    cy.server();
    cy.route({
      method: "DELETE",
      url: "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      status: 401,
      response: {
        code: "token_not_valid",
        detail: "Token is invalid or expired"
      }
    });

    cy.get("[data-cy=clock-in-out-button]").click();

    cy.url().should("include", "/login");
    cy.get(".v-snack__content").contains("Your session has expired.");
  });

  it("handles an expired access token", () => {
    cy.server();
    cy.route("POST", "/api/shifts/", {});
    cy.route({
      method: "DELETE",
      url: "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      status: 401,
      response: {
        code: "token_not_valid",
        detail: ""
      }
    }).as("tokenExpired");
    cy.get("[data-cy=clock-in-out-button]").click();

    cy.wait("@tokenExpired");
    cy.route({
      method: "DELETE",
      url: "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      status: 200,
      response: {}
    });

    cy.get(".v-snack__content").should("not.be.visible");
  });
});
