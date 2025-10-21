import { Webhook } from "svix";
import user from "../model/user.js";

//api clerk 

const clerkwebhooks = async(requestAnimationFrame, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const { data, type } = req.body

        switch (type) {
            case 'user.created':
                {
                    const userdata = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        imageUrl: data.image_url,
                    }
                    await user.create(userdata)
                    res.json({})
                    break;
                }
            case 'user.updated':
                {
                    const userdata = {
                        email: data.email_addresses[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        imageUrl: data.image_url,
                    }
                    await user.findByIdAndUpdate(data.id, userdata)
                    res.json({})
                    break;
                }
            case 'user.deleted':
                {
                    await user.findByIdAndDelete(data.id)
                    res.json({})
                    break;
                }
            default:
                break;
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}