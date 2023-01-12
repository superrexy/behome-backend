let tokenValueAdmin;
let newsId;

describe("News Testing", () => {
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

  it("Create News", () => {
    cy.fixture("image.jpg", "binary").then((fileContent) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, "image/jpeg");
      const formData = new FormData();
      formData.append("news_image", blob, "image.jpg");
      formData.append(
        "description",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      );

      cy.request({
        method: "POST",
        url: "http://localhost:3000/api/v1/news/create",
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

        newsId = body.data.id;
        expect(response.status).to.eq(201);
        expect(body.status).to.eq(true);
      });
    });
  });

  it("Get All News", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/v1/news",
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

  it("Get News By ID", () => {
    cy.request({
      method: "GET",
      url: `http://localhost:3000/api/v1/news/${newsId}`,
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

  it("Update News Description without Image", () => {
    cy.request({
      method: "PUT",
      url: `http://localhost:3000/api/v1/news/${newsId}/update`,
      body: {
        description: "Descripton Updated",
      },
      headers: {
        Authorization: "Bearer " + tokenValueAdmin,
        Accept: "application/json",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
      expect(response.body.data.description).to.eq("Descripton Updated");
    });
  });

  it("Delete News By ID", () => {
    cy.request({
      method: "DELETE",
      url: `http://localhost:3000/api/v1/news/${newsId}/delete`,
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
});
