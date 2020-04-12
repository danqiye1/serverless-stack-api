import stripePackage from "stripe";
import handler from "./libs/handler";
import { calculateCost } from "./libs/calculator";

export const main = handler(async (event, context) => {
    const { storage, source } = JSON.parse(event.body);
    const amount  = calculateCost(storage);
    const description = "Scratch charge";

    // Load our secret key from the environment variable
    const stripe = stripePackage(process.env.stripeSecretKey);

    await stripe.charges.create({
        source,
        amount,
        description,
        currency: "sgd"
    });

    return { status: true };
});