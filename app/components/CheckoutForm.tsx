"use client";
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // setLoading(true);
    setMessage(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000, currency: "usd" }),
    });

    // ✅ Ensure response is checked before reading JSON
    if (!response.ok) {
      console.error("Error response from API:", response.status);
      setMessage("Payment initialization failed.");
      setLoading(false);
      return;
    }

    // ✅ Read response JSON only once
    const jsonResponse = await response.json();

    if (!jsonResponse.clientSecret) {
      setMessage("Payment initialization failed.");
      setLoading(false);
      return;
    }

    if (!jsonResponse.clientSecret) {
      setMessage("Failed to initialize payment");
      setLoading(false);
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      jsonResponse.clientSecret,
      {
        payment_method: { card: elements.getElement(CardElement)! },
      }
    );

    if (error) {
      setMessage(error.message || "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      setMessage("Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CheckoutForm;
