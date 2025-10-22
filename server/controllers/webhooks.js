import { Webhook } from "svix";
import User from "../model/user.js"; // Capitalized for clarity, but must match file

const clerkwebhooks = async(req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            // "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

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
        console.error(error); // log for debugging
        return res.json({ success: false, message: error.message });
    }
};

export { clerkwebhooks };