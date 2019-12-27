describe("when no shifts are clocked", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");
    cy.route("GET", "/api/clockedinshifts/", {});
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

  it("deselects the contract when a shift is clocked outside the current contract", () => {
    throw "not implemented";
  });
});
