const seedHelpers = require('../seed-helpers')


describe('randPrice', () => {

  xtest('Creates an object with a random price if a positive refPrice is provided and the maxChangeFactor is >0', () => {
    expect(false).toEqual(true);
  });

  xtest('Creates an object with the correct shape if a priceType is provided', () => {
    expect(false).toEqual(true);
  });

  xtest('Creates an object with the correct shape if a priceType is NOT provided', () => {
    expect(false).toEqual(true);
  });

});


describe('hoursType', () => {

  test('Returns "Normal" for a datetime of 930am', () => {
    var date = new Date('2018-12-21T09:30:00');
    expect(seedHelpers.hoursType(date)).toEqual('Normal');
  });

  test('Returns "Pre-Market" for a datetime of 925am', () => {
    var date = new Date('2018-12-21T09:25:00');
    expect(seedHelpers.hoursType(date)).toEqual('Pre-Market');
  });

  test('Returns "After Hours" for a datetime of 405pm', () => {
    var date = new Date('2018-12-21T16:05:00');
    expect(seedHelpers.hoursType(date)).toEqual('After Hours');
  });

});

describe('createRandomStock', () => {

  xtest('Creates an object with the correct shape', () => {
    expect(false).toEqual(true);
  });

  xtest('Latest price data point should be within business hours if the provided latestDateTime is outside business hours', () => {
    expect(false).toEqual(true);
  });

  xtest('last5y prices should contain a reasonable number of price objects', () => {
    expect(false).toEqual(true);
  });

  xtest('last5y prices should span approximately 5 years', () => {
    expect(false).toEqual(true);
  });

  xtest('last1y prices should contain a reasonable number of price objects', () => {
    expect(false).toEqual(true);
  });

  xtest('last1y prices should span approximately 5 years', () => {
    expect(false).toEqual(true);
  });

  xtest('last1w prices should contain a reasonable number of price objects', () => {
    expect(false).toEqual(true);
  });

  xtest('last1w prices should span approximately 5 years', () => {
    expect(false).toEqual(true);
  });

  xtest('last1d prices should contain a reasonable number of price objects', () => {
    expect(false).toEqual(true);
  });

});


describe('generateTicker', () => {
  xtest('Generates "ABOP" for "Apple Banana Orange Pineapple Cucumber"', () => {
    expect(false).toEqual(true);
  });
});


describe('createRandomCompany', () => {
  xtest('Creates a company with random data', () => {
    expect(false).toEqual(true);
  });
});


describe('createRandomStocks', () => {

  xtest('Output array should contain "num" numbers of stocks', () => {
    expect(false).toEqual(true);
  });

  xtest('Stocks should have lastestDateTime for the latest price', () => {
    expect(false).toEqual(true);
  });

  xtest('No stock tickers should be repeated', () => {
    expect(false).toEqual(true);
  });

});