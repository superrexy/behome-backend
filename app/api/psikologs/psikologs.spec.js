let tokenValueAdmin;

describe("Psikolog Testing", () => {
  it("Login with role Admin", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/auth/login",
      body: {
        email: "admin@behome.com",
        password: "password",
      },
    }).then((response) => {
      tokenValueAdmin = response.body.data.token;

      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
    });
  });

  it("Update Psikolog Image Only", () => {
    cy.fixture("image.jpg", "binary").then((fileContent) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, "image/jpeg");
      const formData = new FormData();
      formData.append("psikologs_image", blob, "image.jpg");

      cy.request({
        method: "PUT",
        url: "http://localhost:3000/api/v1/psikologs/update",
        headers: {
          Authorization: "Bearer " + tokenValueAdmin,
          Accept: "application/json",
          ContentType: "multipart/form-data",
        },
        body: formData,
      }).then((response) => {
        const bodyString = Cypress.Blob.arrayBufferToBinaryString(
          response.body
        );
        const body = JSON.parse(bodyString);
        cy.log(JSON.stringify(body));

        expect(response.status).to.eq(200);
        expect(body.status).to.eq(true);
      });
    });
  });

  it("Get Psikolog", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/v1/psikologs",
      headers: {
        Authorization: "Bearer " + tokenValueAdmin,
        Accept: "application/json",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
    });
  });

  it("Update Psikolog without Image", () => {
    cy.request({
      method: "PUT",
      url: `http://localhost:3000/api/v1/psikologs/update`,
      body: {
        name: "Psikolog Updated",
        skill: "Skill Updated",
        virtual_account_payment: "+62 813 333 444 555",
        schedules: [
          {
            id: 1,
            is_selected: true,
          },
          {
            id: 2,
            is_selected: true,
          },
        ],
      },
      headers: {
        Authorization: "Bearer " + tokenValueAdmin,
        Accept: "application/json",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
      expect(response.body.data.name).to.eq("Psikolog Updated");
    });
  });
});
