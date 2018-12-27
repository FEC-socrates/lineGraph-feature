// setup file
var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });


// REFLECTION - ENZYME SETUP 
// Jest setup was straight forward because it didn't test JSX
// Enzyme setup was more difficult because React code contains JSX but Jest does not understand JSX by default
// (0) What special things can Enzyme do? Consider if you want to render a component with certain props and states and ensure certain assertions are true. How would you do that?
// (1) install Jest if not yet installed: https://jestjs.io/docs/en/getting-started
// (2) install enzyme: https://airbnb.io/enzyme/docs/installation/
// (3) Enzyme does not know by default what version of React it should test for. You will need to tell it.
  // Create a setupTests.js file which configures Enzyme with appropriate version of React: https://airbnb.io/enzyme/docs/installation/
  // Then, configure jest to run the setup file prior to every test: https://airbnb.io/enzyme/docs/guides/jest.html
    // Optional reading: https://jestjs.io/docs/en/configuration#setuptestframeworkscriptfile-string
// (4) Jest does not understand JSX by default. It needs to be setup to transpile JSX through babel. Check your package.json file to determine what version of babel you are using and follow the instructions for the relevant version: https://jestjs.io/docs/en/getting-started#using-babel
  // Make sure the 'presets' property in your .babelrc file references the correct preset files. For me it was '@babel/preset-env' and 'babel-preset-react', not 'env' and 'react'.
// (5) Write your first tests!
  // Sample Jest tests: https://jestjs.io/docs/en/using-matchers
  // Sample Enzyme tests: https://github.com/vjwilson/enzyme-example-jest/blob/master/src/__tests__/Foo-test.js