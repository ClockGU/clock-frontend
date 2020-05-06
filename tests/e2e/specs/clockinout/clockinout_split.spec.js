describe("when a shift overflows into the next day", () => {
  beforeEach(() => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);
    cy.server();
    cy.route("GET", "/shifts/", "fixture:shifts.json");
    cy.route("GET", "/contracts/", "fixture:contracts.json");
    cy.route("GET", "/clockedinshifts/", "fixture:clockin_overflow.json");

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080");

    cy.tick(1000);
    cy.wait(500);
    cy.get("[data-cy=clock-in-out-button]").click();
  });

  it("shows the full screen review dialog", () => {
    cy.get("[data-cy=review-shift]").should("be.visible");
  });

  it("shows the overflowing shift", () => {
    cy.get("[data-cy=overflowing-shift-duration]").should("contain", "19h 00m");
    cy.get("[data-cy=overflowing-shift-dates]").should(
      "contain",
      "2019-11-19 15:00 - 2019-11-20 10:00"
    );
  });

  it("shows the new pseudo shifts", () => {
    cy.get("[data-cy=new-shift-duration-0]").should("contain", "08h 59m");
    cy.get("[data-cy=new-shift-dates-0]").should(
      "contain",
      "2019-11-19 15:00 - 2019-11-19 23:59"
    );

    cy.get("[data-cy=new-shift-duration-1]").should("contain", "10h 00m");
    cy.get("[data-cy=new-shift-dates-1]").should(
      "contain",
      "2019-11-20 00:00 - 2019-11-20 10:00"
    );
  });

  it("shows a select element and disabled reset button", () => {
    cy.get("[data-cy=select]").should("be.enabled");
    cy.get("[data-cy=reset]").should("be.disabled");
  });

  it("shows save and discard buttons", () => {
    cy.get("[data-cy=save]").should("be.enabled");
    cy.get("[data-cy=discard]").should("be.enabled");
  });

  it("can save the pseudo shifts", () => {
    cy.server();
    cy.route("POST", "/shifts/", {});
    cy.route("DELETE", "/shifts/cf9c16d8-5965-4c06-947b-7e860922eafb/", {});
    cy.get("[data-cy=save]").click();
    cy.get("[data-cy=review-shift]").should("not.be.visible");
  });
});

describe("when the user wants to update the pseudo shifts", () => {
  beforeEach(() => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);
    cy.server();
    cy.route("GET", "/shifts/", "fixture:shifts.json");
    cy.route("GET", "/contracts/", "fixture:contracts.json");
    cy.route("GET", "/clockedinshifts/", "fixture:clockin_overflow.json");

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080");

    cy.tick(1000);
    cy.wait(500);
    cy.get("[data-cy=clock-in-out-button]").click();
  });

  it("shows another dialog with the ShiftForm", () => {
    cy.get("[data-cy=options-0]").click();
    cy.wait(500);
    cy.get("[data-cy=edit-0]").click();
    cy.get("[data-cy=review-edit-shift]").should("be.visible");
  });

  it("delete one shift", () => {
    cy.get("[data-cy=options-0] > .v-btn").click();
    cy.wait(500);

    cy.get("[data-cy=delete-0]").click();

    cy.get("[data-cy=new-shift-duration-0]").should("contain", "10h 00m");
    cy.get("[data-cy=new-shift-dates-0]").should(
      "contain",
      "2019-11-20 00:00 - 2019-11-20 10:00"
    );
  });

  it("will automatically restore if no shifts are left", () => {
    cy.get("[data-cy=options-1] > .v-btn").click();
    cy.wait(500);
    cy.get("[data-cy=delete-1]").click();

    cy.get("[data-cy=options-0]").click();
    cy.wait(500);
    cy.get("[data-cy=delete-0]").click();
  });

  it("can keep the first only", () => {
    cy.get("div")
      .contains("Keep both shifts and split across days")
      .click();

    cy.get("div")
      .contains("Keep first")
      .click();

    cy.get("[data-cy=new-shift-duration-0]").should("contain", "08h 59m");
    cy.get("[data-cy=new-shift-dates-0]").should(
      "contain",
      "2019-11-19 15:00 - 2019-11-19 23:59"
    );

    cy.get("[data-cy=new-shift-duration-1]").should("not.be.visible");
  });

  it("can keep the second only", () => {
    cy.get("div")
      .contains("Keep both shifts and split across days")
      .click();

    cy.get("div")
      .contains("Keep second")
      .click();

    cy.get("[data-cy=new-shift-duration-0]").should("contain", "10h 00m");
    cy.get("[data-cy=new-shift-dates-0]").should(
      "contain",
      "2019-11-20 00:00 - 2019-11-20 10:00"
    );
    cy.get("[data-cy=new-shift-duration-1]").should("not.be.visible");
  });

  it("can update the time", () => {
    cy.get("[data-cy=options-0]").click();
    cy.wait(500);
    cy.get("[data-cy=edit-0]").click();
    cy.get("[data-cy=end]")
      .clear()
      .type("18:00");
    cy.get("[data-cy=shift-save]").click();
  });
});

describe("when a user wants to discard an overflowing shift", () => {
  beforeEach(() => {
    const time = new Date(2019, 10, 20, 10).getTime();
    cy.clock(time, ["Date"]);
    cy.server();
    cy.route("GET", "/shifts/", "fixture:shifts.json");
    cy.route("GET", "/contracts/", "fixture:contracts.json");
    cy.route("GET", "/clockedinshifts/", "fixture:clockin_overflow.json");

    cy.login();
    cy.selectContract();

    cy.visit("http://localhost:8080");

    cy.tick(1000);
    cy.wait(500);
    cy.get("[data-cy=clock-in-out-button]").click();
  });

  it("shows a confirm dialog", () => {
    cy.get("[data-cy=discard]").click();
    cy.wait(500);
    cy.get("[data-cy=review-shift]").should("not.be.visible");
    cy.get("[data-cy=discard-dialog]").should("be.visible");
  });

  it("can cancel the discard", () => {
    cy.get("[data-cy=discard]").click();
    cy.get("[data-cy=dialog-cancel]").click();
    cy.get("[data-cy=discard-dialog]").should("not.be.visible");
    cy.get("[data-cy=review-shift]").should("be.visible");
  });

  it("can confirm the discard", () => {
    cy.server();
    cy.route(
      "DELETE",
      "/clockedinshifts/cf9c16d8-5965-4c06-947b-7e860922eafb/",
      {}
    );
    cy.get("[data-cy=discard]").click();
    cy.get("[data-cy=dialog-confirm]").click();
    cy.get("[data-cy=review-shift]").should("not.be.visible");
    cy.get("[data-cy=discard-dialog]").should("not.be.visible");
  });
});
