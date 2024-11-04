const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  // #1
  test('Viewing one stock: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body['stockData'], 'stock', 'GOOG');
        done();
      });
  });
  // #2
  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body['stockData'], 'stock', 'GOOG');
        assert.property(res.body['stockData'], 'likes', 1);
        done();
      });
  });
  // #3
  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body['stockData'], 'stock', 'GOOG');
        assert.property(res.body['stockData'], 'likes', 1);
        done();
      });
  });
  // #4
  test('Viewing two stocks: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body['stockData'][0], 'stock', 'GOOG');
        assert.property(res.body['stockData'][1], 'stock', 'MSFT');
        done();
      });
  });
  // #5
  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body['stockData'][0], 'stock', 'GOOG');
        assert.property(res.body['stockData'][1], 'stock', 'MSFT');
        assert.hasAllKeys(res.body['stockData'][0], [
          'stock',
          'price',
          'rel_likes',
        ]);
        done();
      });
  });
});
