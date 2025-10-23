import { Webhook } from "svix";
import User from "../model/user.js"; // Ensure this path is correct

const clerkwebhooks = async(req, res) => {
    // req.body is a raw Buffer because of express.raw() middleware in server.js
    const rawBody = req.body;

    // Determine if we are in a development environment
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

    try {
        if (isDevelopment) {
            console.warn("--- ⚠️ WEBHOOK VERIFICATION SKIPPED (NODE_ENV=development) ⚠️ ---");
        } else {
            const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

            await whook.verify(rawBody, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            });
        }

        // --- Parse the body after verification/skip ---
        const body = JSON.parse(rawBody.toString('utf8'));
        const { data, type } = body;

        // Helper function for safe name construction (handles null first/last names)
        const getSafeName = (firstName, lastName) => {
            return [firstName || '', lastName || ''].join(' ').trim();
        };

        switch (type) {
            case "user.created":
                console.log(`➡️ Processing: ${type} for ID: ${data.id}`);
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: getSafeName(data.first_name, data.last_name),
                    imageUrl: data.image_url
                });
                return res.json({ success: true, message: "User created" });

            case "user.updated":
                console.log(`➡️ Processing: ${type} for ID: ${data.id}`);
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: getSafeName(data.first_name, data.last_name),
                    imageUrl: data.image_url
                });
                return res.json({ success: true, message: "User updated" });

            case "user.deleted":
                const userIdToDelete = data.id || body.data ? .id;
                console.log(`➡️ Processing: ${type}. Deleting ID: ${userIdToDelete}`);
                if (userIdToDelete) {
                    await User.findByIdAndDelete(userIdToDelete);
                }
                return res.json({ success: true, message: "User deleted" });

            default:
                return res.json({ success: true, message: `Unhandled event type: ${type}` });
        }

    } catch (error) {
        // If the error happens during JSON.parse, Mongoose operation, or svix verification,
        // we log it and return a 400 Bad Request (or 500 if the database failed).
        console.error("Clerk Webhook Handler Error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export { clerkwebhooks };