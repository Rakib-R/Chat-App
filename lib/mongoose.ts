  import mongoose from 'mongoose';

  interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  /* Usse a global variable to store the connection so it 
     persists across hot-reloads in development.
   */
  let cached: MongooseCache = (global as any).mongoose;

  if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
  }

  export const connectTODB = async () => {
    // If we already have a connection, return it immediately
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      const opts = {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10, // ✅ Add connection pooling
        minPoolSize: 1,
        bufferCommands: false, // Turn off buffering for faster error reporting
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("=> New MongoDB Connection Established");
        return mongoose;
      });
    }
        try {
          cached.conn = await cached.promise;
        } catch (e) {
          cached.promise = null;
          throw e;
        }

    return cached.conn;
  };