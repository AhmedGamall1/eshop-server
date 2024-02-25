import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import axios from "axios";
// Handle payment creation
export const createPayment = CatchAsyncError(async (req, res) => {
  try {
    // Use your PayMob API keys
    const PAYMOB_API_KEY =
      "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RVMU9ETXhMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuTmZNRVY4cEhrUUlQbTlRZGR4UjBPVm84Wjg0YTVtYTNNcnRFZzhieGtsN3RqNEJsRlRHYWxiMG9TUk1nRktUclRncEdiSjMydzNFem04Sy1NMEZaeXc=";

    // Set up payment request
    const paymentRequest = {
      auth_token: PAYMOB_API_KEY,
      amount_cents: req.body.amount * 100, // PayMob expects the amount in cents
      currency: "EGP", // Adjust based on your currency
      integration_id: 4448367,
      order_id: 19822,
      billing_data: {
        email: req.body.email,
      },
    };

    // Send request to PayMob
    const response = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      paymentRequest,
    );

    // Return payment URL to the client
    res.json({ payment_url: response.data.payment_key });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
