'use strict';

module.exports = function (app) {
  const stock_likes_ip = {};
  app.route('/api/stock-prices').get(async function (req, res) {
    // https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote
    // https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/goog/quote
    // console.log(req.query);
    // { stock: 'GOOG', like: 'true' }
    // { stock: [ 'GOOG', 'MSFT' ], like: 'true' }

    let stocks = convertStringToArray(req.query.stock);
    let like = req.query.like === 'true' ? true : false;
    let ip_addr = req.ip;
    //let isIpExists = stock_likes_ip.indexOf(ip_addr) > -1;

    let stock1 = {
      stock: '',
      price: 0,
    };

    let stock2 = {
      stock: '',
      price: 0,
    };

    let stockname = stocks[0].toLowerCase();
    //console.log(stock_likes_ip[stockname]);
    if (!stock_likes_ip[`${stockname}`]) {
      stock_likes_ip[`${stockname}`] = [];
    }

    let url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockname}/quote`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    stock1.stock = data.symbol;
    stock1.price = data.latestPrice;

    if (stocks.length == 2) {
      let stockname2 = stocks[1].toLowerCase();
      //console.log(stock_likes_ip[stockname]);
      if (!stock_likes_ip[`${stockname2}`]) {
        stock_likes_ip[`${stockname2}`] = [];
      }
      let url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockname2}/quote`;
      let response = await fetch(url);
      let data = await response.json();
      // console.log(data);
      stock2.stock = data.symbol;
      stock2.price = data.latestPrice;

      // console.log(stock_likes_ip);

      let like_count1 = stock_likes_ip[`${stockname}`].length;
      let like_count2 = stock_likes_ip[`${stockname2}`].length;
      stock1['rel_likes'] = -like_count1;
      stock2['rel_likes'] = like_count2;

      return res.json({
        stockData: [stock1, stock2],
      });
    }

    if (like) {
      if (stock_likes_ip[`${stockname}`].indexOf(ip_addr) < 0) {
        stock_likes_ip[`${stockname}`].push(ip_addr);
      }
    }

    let like_count = stock_likes_ip[`${stockname}`].length;
    stock1['likes'] = like_count;

    return res.json({
      stockData: stock1,
    });

    // {"stockData":{"stock":"GOOG","price":786.90,"likes":1}}
    // {"stockData":[{"stock":"MSFT","price":62.30,"rel_likes":-1},{"stock":"GOOG","price":786.90,"rel_likes":1}]}
  });

  const convertStringToArray = (object) => {
    return typeof object === 'string' ? Array(object) : object;
  };
};
