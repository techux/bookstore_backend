import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`[INFO] MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`[ERROR] Error in Connecting Database : ${error.stack || error.message}`)
    }
}

export default dbConnect