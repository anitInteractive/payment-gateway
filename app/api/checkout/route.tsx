import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    // ✅ Read the request body only once
    const body = await req.json();

    // ✅ Destructure values safely
    const { amount, currency } = body || {};

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
