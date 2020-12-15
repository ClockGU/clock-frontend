let accessToken;
let contractUUID;

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:8000/auth/jwt/create/",
    body: {
      email: "cypress@example.com",
      password: "cypress"
    }
  }).then((response) => {
    accessToken = response.body.access;

    window.localStorage.setItem(
      "vuex",
      JSON.stringify({
        auth: {
          authenticating: false,
          authenticationErrorCode: null,
          authenticationError: null,
          refreshTokenPromise: null,
          accessToken: response.body.access,
          refreshToken: response.body.refresh
        }
      })
    );
  });
});

Cypress.Commands.add("progressContractForm", () => {
  cy.get("[data-cy=continue-step-one]", { timeout: 5000 }).click();
  cy.get("[data-cy=continue-step-two]", { timeout: 5000 }).click();
  cy.get("[data-cy=continue-step-three]", { timeout: 5000 }).click();
  cy.get("[data-cy=continue-step-four]", { timeout: 5000 }).click();
});

Cypress.Commands.add("createContract", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:8000/contracts/",
    auth: {
      bearer: accessToken
    },
    body: {
      created_at: "2019-11-23T15:08:00.313462+01:00",
      end_date: "2019-11-30",
      hours: 40,
      modified_at: "2019-11-23T15:08:00.313530+01:00",
      name: "ABC",
      start_date: "2019-11-01"
    }
  }).then((response) => {
    contractUUID = response.body.id;
  });
});

Cypress.Commands.add("deleteContract", () => {
  cy.request({
    method: "DELETE",
    url: `http://localhost:8000/contracts/${contractUUID}/`,
    auth: {
      bearer: accessToken
    }
  });
});

Cypress.Commands.add("selectContract", () => {
  const vuex = window.localStorage.getItem("vuex");
  const newVuex = Object.assign(JSON.parse(vuex), {
    user: {
      first_name: "Cy"
    },
    selectedContract: {
      date: {
        start: "2019-10-01",
        end: "2020-03-31"
      },
      hours: 20,
      uuid: "178bc9a6-132e-46ab-8fa2-df8e22c229b6",
      name: "Cypress"
    }
  });

  window.localStorage.setItem("vuex", JSON.stringify(newVuex));
});
