describe("Shift list table", () => {
  context("without existing shifts", () => {
    beforeEach(() => {
      cy.server();
      cy.route("GET", "/shifts/").as("shifts");

      cy.login();
      cy.selectContract();

      cy.visit("http://localhost:8080/shifts");
    });

    it("shows a skeleton placeholder while loading and empty placeholder after loading", () => {
      cy.get("[data-cy=shift-list-skeleton]").should("be.visible");
      cy.wait("@shifts");
      cy.get("[data-cy=shift-list-skeleton]").should("not.be.visible");
      cy.get("[data-cy=shift-list-empty-placeholder]").should("be.visible");
    });
  });

  context("with existing shifts", () => {
    before(() => {
      cy.server();
      cy.route("GET", "/shifts/", "fixture:shifts.json").as("shifts");

      cy.login();
      cy.selectContract();

      cy.visit("http://localhost:8080/shifts");
      cy.wait("@shifts");
    });

    it("shows shifts in a list", () => {
      cy.get("[data-cy=shift-lists]");
    });

    it("separates each month into a separate list", () => {
      cy.get('[data-cy="shift-list-2019 11"]');
      cy.get('[data-cy="shift-list-2019 10"]');
    });

    it("shows a header with the month name and total sum", () => {
      cy.get(
        '[data-cy="shift-list-2019 11"] > .v-subheader > [data-cy=shift-list-header]'
      )
        .should("contain", "November 2019")
        .should("contain", "Work time sum: 29:32 / 20:00");

      cy.get(
        '[data-cy="shift-list-2019 10"] > .v-subheader > [data-cy=shift-list-header]'
      )
        .should("contain", "October 2019")
        .should("contain", "Work time sum: 01:00 / 20:00");
    });

    it("shows a single list item per shift", () => {
      cy.get('[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group]')
        .children()
        .should("have.length", 3);

      cy.get('[data-cy="shift-list-2019 10"] > [data-cy=shift-list-group]')
        .children()
        .should("have.length", 2);
    });

    it("shows information for every shift", () => {
      cy.get(
        '[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group] > [data-cy=shift-list-item-0] > .v-list-item__content'
      )
        .should("contain", "Wednesday, 27th")
        .should("contain", "00:00 - 19:53 (19h 53m)");
    });

    it("shows a type for every shift", () => {
      cy.get(
        '[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group] > [data-cy=shift-list-item-0] > .v-list-item__content > :nth-child(3) > [data-cy=shift-list-item-type]'
      ).should("contain", "Shift");
      cy.get(
        "[data-cy=shift-list-item-2] > .v-list-item__content > :nth-child(3) > [data-cy=shift-list-item-type]"
      ).should("contain", "Sick");
    });

    it("shows tags for every shift, if available", () => {
      cy.get(
        "[data-cy=shift-list-item-0] > .v-list-item__content > :nth-child(3) > [data-cy=shift-list-item-tag-0]"
      ).should("not.be.visible");

      cy.get(
        "[data-cy=shift-list-item-2] > .v-list-item__content > :nth-child(3) > [data-cy=shift-list-item-tag-0]"
      ).should("be.visible");
      cy.get(
        "[data-cy=shift-list-item-2] > .v-list-item__content > :nth-child(3)  > [data-cy=shift-list-item-tag-1]"
      ).should("be.visible");
    });

    it("sorts shift by start date in descending order", () => {
      cy.get('[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group]')
        .find(".v-list-item__content")
        .as("novemberShifts");

      cy.get("@novemberShifts")
        .eq(0)
        .should("contain", "Wednesday, 27th");
      cy.get("@novemberShifts")
        .eq(1)
        .should("contain", "Tuesday, 26th");
      cy.get("@novemberShifts")
        .eq(2)
        .should("contain", "Monday, 25th");
    });

    it("shows the edit mode button", () => {
      cy.get("[data-cy=shift-list-delete-button]").should("not.be.visible");
      cy.get("[data-cy=shift-list-edit-mode-button]");
    });

    it("enabled edit mode when clicking the button", () => {
      cy.get("[data-cy=shift-list-edit-mode-button]").click();
      cy.get("[data-cy=shift-list-delete-button]").should("be.visible");
      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete")
        .should("have.attr", "disabled");
    });

    it("shows unticked checkboxes in when in edit mode", () => {
      cy.get('[data-cy="shift-list-toggle-all"]').should("have.length", 2);
      cy.get('[data-cy="shift-lists"]')
        .find("input")
        .should("have.length", 7)
        .each($el => {
          cy.wrap($el).should("have.attr", "value", "false");
        });
    });

    it("toggles all shifts when clicking the checkbox", () => {
      cy.get(
        '[data-cy="shift-list-2019 11"] > .v-subheader > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple'
      ).click();

      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete (3 shifts)")
        .should("not.have.attr", "disabled");
    });

    it("untoggles shifts when clicking checkbox separately", () => {
      cy.get(
        '[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group] > [data-cy=shift-list-item-1] > .v-list-item__action > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple'
      ).click();

      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete (2 shifts)")
        .should("not.have.attr", "disabled");
    });

    it("untoggles shifts when clicking shift item separately", () => {
      cy.get(
        '[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group] > [data-cy=shift-list-item-0]'
      ).click();

      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete (1 shift)")
        .should("not.have.attr", "disabled");
    });

    it("can toggle and combine with different month", () => {
      cy.get(
        '[data-cy="shift-list-2019 10"] > .v-subheader > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple'
      ).click();

      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete (3 shifts)")
        .should("not.have.attr", "disabled");
    });

    it("will first select all remaining, then deselect all on click", () => {
      cy.get('[data-cy="shift-list-2019 10"] > [data-cy=shift-list-group]')
        .find("input")
        .as("checkboxes");

      cy.get(
        '[data-cy="shift-list-2019 10"] > [data-cy=shift-list-group] > [data-cy=shift-list-item-1] > .v-list-item__action > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple'
      ).click();
      cy.get("@checkboxes")
        .first()
        .should("have.attr", "value", "true");
      cy.get("@checkboxes")
        .last()
        .should("have.attr", "value", "false");
      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete (2 shifts)")
        .should("not.have.attr", "disabled");

      cy.get(
        '[data-cy="shift-list-2019 10"] > .v-subheader > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple'
      ).click();
      cy.get("@checkboxes")
        .first()
        .should("have.attr", "value", "true");
      cy.get("@checkboxes")
        .last()
        .should("have.attr", "value", "true");
      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete (3 shifts)")
        .should("not.have.attr", "disabled");

      cy.get(
        '[data-cy="shift-list-2019 10"] > .v-subheader > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple'
      ).click();
      cy.get("@checkboxes")
        .first()
        .should("have.attr", "value", "false");
      cy.get("@checkboxes")
        .last()
        .should("have.attr", "value", "false");
      cy.get("[data-cy=shift-list-delete-button]")
        .should("contain", "Delete (1 shift)")
        .should("not.have.attr", "disabled");
    });

    it("shows a confirm dialog when trying to delete", () => {
      cy.get("[data-cy=shift-list-delete-button]").click();
      cy.get("[data-cy=delete-dialog]", { timeout: 1000 }).should(
        "contain",
        "Are you sure you want to delete the selected shifts? This action is permanent."
      );
      cy.get("[data-cy=delete-dialog]").should("be.visible");
    });

    it("can cancel the delete dialog", () => {
      cy.get("[data-cy=delete-cancel]").click();
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
    });

    it("can cancel the delete dialog with escape key", () => {
      cy.get("[data-cy=shift-list-delete-button]").click();
      cy.focused().type("{esc}");
      cy.get("[data-cy=delete-dialog]").should("not.be.visible");
    });

    it("can delete a shift", () => {
      cy.server();
      cy.route("GET", "/shifts/", "fixture:shifts.json").as("shifts");

      cy.login();
      cy.selectContract();

      cy.visit("http://localhost:8080/shifts");

      cy.fixture("shifts.json").then(shifts => {
        cy.wait("@shifts");

        const remainingShifts = shifts.slice(1);
        cy.route("GET", "/shifts/", remainingShifts);
        cy.route("DELETE", "/shifts/**", {});

        cy.get("[data-cy=shift-list-edit-mode-button]").click();
        cy.get(
          '[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group] > [data-cy=shift-list-item-0] > .v-list-item__action > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple'
        ).click();

        cy.get("[data-cy=shift-list-delete-button]").click();
        cy.get("[data-cy=delete-confirm]").click();
        cy.get("[data-cy=delete-dialog]").should("not.be.visible");

        cy.get('[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group]')
          .children()
          .should("have.length", 2);

        cy.get('[data-cy="shift-list-2019 10"] > [data-cy=shift-list-group]')
          .children()
          .should("have.length", 2);
        cy.get("[data-cy=shift-list-delete-button]").should("not.be.visible");
      });
    });

    it("redirects to shift form when clicking a shift list item", () => {
      cy.get(
        '[data-cy="shift-list-2019 11"] > [data-cy=shift-list-group] > [data-cy=shift-list-item-0] > .v-list-item__content'
      ).click();
      cy.url().should("contain", "7d08fa88-8ab3-489f-b20f-06055a1cf939/edit");
    });
  });
});
