describe("Auth Testing", () => {
  it("Register a new user", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/auth/register",
      body: {
        name: "Test User",
        email: "test@behome.com",
        password: "password",
        address: "Jalan Testing",
        phone: "081234567890",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(201);
      expect(response.body.status).to.eq(true);
    });
  });

  it("Login with the new user", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/auth/login",
      body: {
        email: "test@behome.com",
        password: "password",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq(true);
    });
  });
});
