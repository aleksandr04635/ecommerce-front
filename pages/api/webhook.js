import { mongooseConnect } from "@/lib/mongoose";
const stripe = require("stripe")(process.env.STRIPE_SK);
import { buffer } from "micro";
import { Order } from "@/models/Order";

//const endpointSecret = "whsec_634d3142fd2755bd61adaef74ce0504bd2044848c8aac301ffdb56339a0ca78d";
const endpointSecret =
  "whsec_f9fefc06cea95fd693bcfa0f2f3ad84de060155803646b770a6c27c2b47c7691";

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const data = event.data.object;
      /*   console.log(
        `event.data.object for event checkout.session.completed in webhook.js: `,
        data
      ); */
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === "paid";
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("ok");
}

export const config = {
  api: { bodyParser: false },
};
//MY bless-faster-sleek-admire
//The Stripe CLI is configured for your account with account id acct_1MKbplGUOgNDiozT

// bright-thrift-cajole-lean
// acct_1Lj5ADIUXXMmgk2a
