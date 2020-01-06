describe("ClockInOut with short shifts", () => {
  beforeEach(() => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);
    cy.server();
    cy.route("GET", "/api/shifts/", "fixture:shifts.json");
    cy.route("GET", "/api/contracts/", "fixture:contracts.json");
    cy.route("GET", "/api/clockedinshifts/", "fixture:clockin_short.json");

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080");

    cy.tick(6000);
    cy.wait(1000);
  });

  it("shows a dialog to review shift", () => {
    cy.get("[data-cy=clock-in-out-button]").click();
    cy.get("[data-cy=review-shift]")
      .should("be.visible")
      .should("contain", "Review shift")
      .should("contain", "This shift looks very short");
  });

  it("can continue shift", () => {
    cy.get("[data-cy=clock-in-out-button]").click();
    cy.get("[data-cy=short-continue]").click();
    cy.get("[data-cy=review-shift]").should("not.be.visible");
  });

  it("can save shift", () => {
    cy.server();
    cy.route(
      "DELETE",
      "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      {}
    );
    cy.route("POST", "/api/shifts/", {});

    cy.get("[data-cy=clock-in-out-button]").click();
    cy.get("[data-cy=short-save]").click();
    cy.get("[data-cy=review-shift]").should("not.be.visible");
    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
  });

  it("can discard a shift", () => {
    cy.server();
    cy.route(
      "DELETE",
      "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      {}
    );
    cy.get("[data-cy=clock-in-out-button]").click();
    cy.get("[data-cy=short-discard]").click();
    cy.get("[data-cy=review-shift]").should("not.be.visible");
    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
  });

  it("shows an error when trying to discard a stale shift", () => {
    cy.server();
    cy.route({
      method: "DELETE",
      url: "/api/clockedinshifts/deeb24f7-07ed-45f3-b3ea-9e5452b2c3bd/",
      body: { detail: "Not found." },
      status: 404
    });

    cy.get("[data-cy=clock-in-out-button]").click();
    cy.get("[data-cy=short-discard]").click();
    cy.get("[data-cy=review-shift]").should("not.be.visible");
    cy.get("[data-cy=snackbar]").should("contain", "Not found.");
    cy.get("[data-cy=clock-in-out-button]").should("contain", "Clock in");
  });
});
