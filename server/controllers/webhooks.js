import { Webhook } from "svix";
import user from "../model/User.js";

// api clerk
const clerkwebhooks = async(req, res) => { // fixed parameter name
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // verify the webhook
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created':
                {
                    const userdata = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        imageUrl: data.image_url,
                    };
                    await user.create(userdata);
                    res.json({ success: true }); // added success flag
                    break;
                }
            case 'user.updated':
                {
                    const userdata = {
                        email: data.email_address[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        imageUrl: data.image_url,
                    };
                    await user.findByIdAndUpdate(data.id, userdata);
                    res.json({ success: true });
                    break;
                }
            case 'user.deleted':
                {
                    await user.findByIdAndDelete(data.id);
                    res.json({ success: true });
                    break;
                }
            default:
                res.json({ success: true, message: "Unhandled event" }); // added default response
                break;
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export { clerkwebhooks };