import { v2 as cloudinary } from 'cloudinary'
const connectClodinary = async() => {
    cloudinary.config({
        cloud_name: process.env.CLOUDNARY_NAME,
        api_key: process.env.CLOUDNARY_KEY,
        api_secret: process.env.CLOUDNARY_SECRET
    })
}


export default connectClodinary;