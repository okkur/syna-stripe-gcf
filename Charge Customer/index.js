const app = require('express')();
const stripe = require('stripe')(
  process.env.STRIPE_KEY || "your_stripe_key"
);
const cors = require('cors');
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//initiate a one-off charge for a customer
exports.chargeCustomer = app.post(
  "/charge",
  function chargeCustomer(req, res) {
    const { currency, custom_value, email, from, price, price_text, product, stripeToken } = req.body;
    console.log('Request:', { currency, custom_value, email, from, price, price_text, product, stripeToken });
    const stripeRequestData = {
      source: stripeToken,
      currency: currency,
      amount: price
    };

    if (email) {
      stripeRequestData.receipt_email = email;
    }

    stripe.charges.create(
      stripeRequestData,
      function(err, charge) {
        if (err) {
          return res.status(406).send(JSON.stringify(err));
        }
        res.status(200).send(JSON.stringify(charge));
      }
    );
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
