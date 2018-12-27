const seedHelpers = require('../db/seed-helpers')


describe('randPrice', () => {

  test('Creates an object with a random price if a positive refPrice is provided and the maxChangeFactor is >0', () => {
    var price = seedHelpers.randPrice(undefined, new Date, 10, 0.5);
    expect(price.price).not.toEqual(10);
  });

  test('Creates an object with the correct shape if a priceType is provided', () => {
    var price = seedHelpers.randPrice("Pre-Market", new Date, 10, 0.5);
    expect(price).toEqual(expect.objectContaining({
      priceType: "Pre-Market",
      datetime: expect.anything(),
      price: expect.anything()
    }));
  });

  test('Creates an object with the correct shape if a priceType is NOT provided', () => {
    var price = seedHelpers.randPrice(undefined, new Date, 10, 0.5);
    expect(price).toEqual(expect.objectContaining({
      datetime: expect.anything(),
      price: expect.anything()
    }));
    expect(price.priceType).not.toBeDefined();
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

  var date = new Date('2018-12-21T09:30:00');
  var stock = seedHelpers.createRandomStock('RAND', 'Random Company Inc', 0.55, 350000, 120.25, date);

  test('Creates an object with the correct shape', () => {
    expect(stock).toEqual(expect.objectContaining({
      ticker: 'RAND',
      name: 'Random Company Inc',
      analystBuy: 0.55,
      platformOwners: 350000,
      last1dPrices: expect.any(Object),
      last1wPrices: expect.any(Object),
      last1yPrices: expect.any(Object),
      last5yPrices: expect.any(Object),
    }));
  });

  test('Latest price data point should be within business hours if the provided latestDateTime is outside business hours', () => {
    expect(stock.last1dPrices[0].datetime).toEqual(date);
  });

  test('last5y prices should contain a reasonable number of price objects', () => {
    expect(stock.last5yPrices.length).toBeGreaterThan(200);
  });

  test('last5y prices should span approximately 5 years', () => {
    var lastDate = stock.last5yPrices.slice(-1)[0].datetime;
    expect((date - lastDate) / (1000 * 60 * 60 * 24)).toBeGreaterThan(365 * 4.5);
  });

  test('last1y prices should contain a reasonable number of price objects', () => {
    expect(stock.last1yPrices.length).toBeGreaterThan(350);
  });

  test('last1y prices should span approximately 1y', () => {
    var lastDate = stock.last5yPrices.slice(-1)[0].datetime;
    expect((date - lastDate) / (1000 * 60 * 60 * 24)).toBeGreaterThan(350);
  });

  test('last1w prices should contain a reasonable number of price objects', () => {
    expect(stock.last1wPrices.length).toBeGreaterThan(150);
  });

  test('last1w prices should span approximately 1w', () => {
    var lastDate = stock.last5yPrices.slice(-1)[0].datetime;
    expect((date - lastDate) / (1000 * 60 * 60 * 24)).toBeGreaterThan(5);
  });

});


describe('generateTicker', () => {
  test('Generates "ABOP" for "Apple Banana Orange Pineapple Cucumber"', () => {
    expect(seedHelpers.generateTicker('Apple Banana Orange Pineapple Cucumber')).toEqual('ABOP');
  });
});


describe('createRandomCompany', () => {
  test('Creates a company with random data', () => {
    expect(seedHelpers.createRandomCompany()).toEqual(expect.objectContaining({
      name: expect.anything(),
      ticker: expect.anything(),
    }));
  });
});


describe('createRandomStocks', () => {

  var date = new Date('2018-12-21T09:30:00');
  var stocks = seedHelpers.createRandomStocks(20, date)

  test('Output array should contain "num" numbers of stocks', () => {
    expect(stocks.length).toEqual(20);
  });

  test('Stocks should have lastestDateTime for the latest price', () => {
    expect(stocks[0].last5yPrices[0].datetime).toEqual(date);
  });

  test('No stock tickers should be repeated', () => {
    var tickers = new Set;
    stocks.forEach( stock => {tickers.add(stock.ticker)} );
    expect(tickers.size).toEqual(20);
  });

});