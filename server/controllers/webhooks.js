import { Webhook } from "svix";
import User from "../model/user.js";
import bodyParser from "body-parser";
import express from "express";

const app = express();

// Use raw body parser only for webhook route
app.post("/api/webhooks/clerk", bodyParser.raw({ type: "application/json" }), async(req, res) => {
    try {
        let payload;

        // Skip signature verification locally
        if (process.env.NODE_ENV === "development") {
            payload = JSON.parse(req.body.toString());
            console.log("Skipping Svix verification in local environment");
            console.log("Webhook payload:", payload);
        } else {
            const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
            payload = whook.verify(req.body, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            });
        }

        const { data, type } = payload;

        switch (type) {
            case "user.created":
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                return res.json({ success: true });

            case "user.updated":
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                return res.json({ success: true });

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });

            default:
                return res.json({ success: true, message: "Unhandled event" });
        }

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
});

export { app };