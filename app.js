const axios = require("axios"),
  cheerio = require("cheerio"),
  ora = require("ora");

const Prices = {};

const SomeFunction = (newPrice) => {
  console.log("wew! go buy nowwww.... the new price is", newPrice);
};

const FetchPrice = (productUrl) => {
  const spinner = ora("Loading....").start();
  axios
    .get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
      },
    })
    .then(({ data }) => {
      const $ = cheerio.load(data);
      let gotThePrice = $("#priceblock_ourprice").text();
      if (!gotThePrice) {
        gotThePrice = $("#priceblock_dealprice").text();
      }
      const priceList = gotThePrice.match(/\d+/g);
      if (priceList) {
      }
      priceList.splice(priceList.length - 1, 1);
      const price = Number(priceList.join(""));
      if (Prices[productUrl]) {
        if (Prices[productUrl] > price) {
          SomeFunction(price);
        }
      }
      Prices[productUrl] = price;
      spinner.succeed(
        `Fetched price for ${$("title").text().substr(0, 80)}...: ${price}`
      );
    });
};

const PRODUCTS = [
  "https://www.amazon.in/dp/B0838XC3RJ",
  "https://www.amazon.in/Canon-1500D-Digital-Camera-S18-55/dp/B07BS4TJ43",
];

const Track = () => {
  PRODUCTS.map((prod) => {
    FetchPrice(prod);
  });
  setTimeout(Track, 300000);
};

Track();
