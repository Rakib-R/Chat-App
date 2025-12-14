import mongoose from 'mongoose';

export const connectTODB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
            // Recommended options for modern Mongoose (no longer strictly necessary but good practice)
            serverSelectionTimeoutMS: 5000, // Timeout after 5s for the initial connection handshake
             // The default is 10000. Set low once connection is verified.
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
        // Exit process with failure
        process.exit(1);
    }
};

connectTODB();