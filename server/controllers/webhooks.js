import { Webhook } from "svix";
import User from "../model/user.js"; // Ensure this path is correct

const clerkwebhooks = async(req, res) => {
    // req.body is a raw Buffer because of express.raw() middleware in server.js
    const rawBody = req.body;

    // Determine if we are in a development environment
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

    try {
        if (isDevelopment) {
            // 🛑 Bypass Svix verification in local environment
            console.warn("--- ⚠️ WEBHOOK VERIFICATION SKIPPED (NODE_ENV=development) ⚠️ ---");
        } else {
            // Production/Staging: Perform mandatory Svix verification
            const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

            await whook.verify(rawBody, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            });
        }

        // --- Process the Body (Parsed after potential verification/skip) ---
        // Convert the raw Buffer body to a string, then parse the JSON
        const body = JSON.parse(rawBody.toString('utf8'));
        const { data, type } = body;

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
                // In Clerk, data is null for user.deleted, but data.id is available at the top level of the payload.
                // We use body.id or fall back to data.id for safety.
                const userIdToDelete = data.id || body.data ? .id;
                if (userIdToDelete) {
                    await User.findByIdAndDelete(userIdToDelete);
                }
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