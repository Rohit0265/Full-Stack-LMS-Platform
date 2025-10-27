// import { clerkClient } from "@clerk/express";

// export const protextEducator = async(req, res, next) => {
//     try {
//         const userId = req.auth.userId;
//         const response = await clerkClient.users.getUser(userId)
//         if (response.publicMetadata.role !== 'educator') {
//             return res.json({ success: false, message: 'Unauthorize Access' })
//         }
//         next()
//     } catch (error) {
//         res.json({
//             success: false,
//             message: error.message
//         })
//     }
// }
import { clerkClient, getAuth } from "@clerk/express";

export const protextEducator = async(req, res, next) => {
    try {
        // ✅ Get auth manually (req.auth won't exist here)
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access — Missing or invalid token",
            });
        }

        const response = await clerkClient.users.getUser(userId);

        if (response.publicMetadata.role !== "educator") {
            return res.status(403).json({
                success: false,
                message: "Access Denied — Educator role required",
            });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({
            success: false,
            message: error.message || "Authentication Failed",
        });
    }
};