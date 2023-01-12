let tokenValue;

describe("Users Testing", () => {
  it("Login with the new user", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/auth/login",
      body: {
        email: "test@behome.com",
        password: "password",
      },
    }).then((response) => {
      tokenValue = response.body.data.token;

      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
    });
  });

  it("Get Users Profile", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/v1/users/profile",
      headers: {
        Authorization: "Bearer " + tokenValue,
        Accept: "application/json",
        ContentType: "application/json",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
    });
  });

  it("Update Users Profile", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:3000/api/v1/users/profile",
      headers: {
        Authorization: "Bearer " + tokenValue,
        Accept: "application/json",
        ContentType: "application/json",
      },
      body: {
        name: "Test User Updated",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
      expect(response.body.data.name).to.eq("Test User Updated");
    });
  });

  it("Update Profile Image of Users", () => {
    cy.fixture("image.jpg", "binary").then((fileContent) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, "image/jpeg");
      const formData = new FormData();
      formData.append("user_image", blob, "image.jpg");
      formData.append("name", "Test User Updated");

      cy.request({
        method: "PUT",
        url: "http://localhost:3000/api/v1/users/profile",
        headers: {
          Authorization: "Bearer " + tokenValue,
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
        expect(body.data.name).to.eq("Test User Updated");
      });
    });
  });
});
