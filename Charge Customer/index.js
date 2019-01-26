const app = require('express')();
const http = require('http').Server(app);
const stripe = require('stripe')(
  "your_stripe_key" || process.env.STRIPE_KEY
);
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//initiate a one-off charge for a customer
exports.chargeCustomer = app.post(
  "/charge",
  function chargeCustomer(req, res) {
    const { product, price, price_text, currency, from, stripeToken } = req.body;
    console.log('Request:', { product, price, price_text, currency, from })
    stripe.charges.create(
      {
        source: stripeToken,
        currency: currency,
        amount: price
      },
      function(err, charge) {
        if (err) {
          return res.status(406).send(JSON.stringify(err));
        }
        res.status(200).send(JSON.stringify(charge));
      }
    );
  }
);
