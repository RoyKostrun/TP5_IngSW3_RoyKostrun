const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "",
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
