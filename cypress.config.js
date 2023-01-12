const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "app/api/**/*.spec.js",

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
