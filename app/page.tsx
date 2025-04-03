"use client";
import CheckoutForm from "./components/CheckoutForm";
// import styles from "./page.module.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Home() {
  return (
    <Elements stripe={stripePromise}>
      <div>
        {/* <h1>Stripe Payment Gateway</h1> */}
        <CheckoutForm />
      </div>
    </Elements>
  );
}
