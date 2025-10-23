import { Webhook } from "svix";
import User from "../model/user.js";

const clerkwebhooks = async(req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // 1. Get the raw body. 
        // Thanks to express.raw(), req.body is now a Buffer/raw string.
        const rawBody = req.body;

        // 2. Verify the payload using the raw body (Buffer)
        // This is where the original error occurred.
        await whook.verify(rawBody, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // 3. Manually parse the body *AFTER* verification is successful.
        // Convert Buffer to string, then parse the JSON.
        const body = JSON.parse(rawBody.toString('utf8'));

        const { data, type } = body; // Use the newly parsed 'body' object

        switch (type) {
            case "user.created":
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                return res.json({ success: true, message: "User created" });

            case "user.updated":
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                return res.json({ success: true, message: "User updated" });

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true, message: "User deleted" });

            default:
                return res.json({ success: true, message: `Unhandled event type: ${type}` });
        }

    } catch (error) {
        console.error("Clerk Webhook Error:", error);
        // Return a 400 Bad Request if verification or processing fails
        return res.status(400).json({ success: false, message: error.message });
    }
};

export { clerkwebhooks };