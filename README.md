# lineGraph-feature

> A clone of the stock price line graph component on Robinhood.

## Related Projects

  - https://github.com/FEC-socrates/buySell-feature
  - https://github.com/FEC-socrates/AboutAndNews-feature
  - https://github.com/FEC-socrates/proxy-adrian

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

If running for the first time:
  - First run 'npm install' on the repo directory to install all dependencies.
  - Start your mongoDB server if neeeded
  - Run 'npm run configDB' to create the required database in Mongo
  - Then run 'npm run seed' to seed the DB with fake data.

To start the server:
  - Run 'npm run start'

To view the component in your browser:
  - Go to localhost:3456 in your browser

Code is served from a bundle.js produced by Webpack. If you are making changes to the code, you will need to rebundle. 
  - Rebundle by running 'npm run build'. Webpack will automatically watch for changes and rebundle on file change.

Unit tests are conducted by Jest and Enzyme. To run unit tests, run 'npm run test'. (Make sure your server is also running).

## Requirements

This project is primarily built with React, Node and MongoDB / Mongoose. Highcharts is used as the charting library.
See package.json for full dependencies.

## Development

### Installing Dependencies

From within the root directory, just run npm install.
