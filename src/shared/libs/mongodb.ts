import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalForMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

export async function connectDB() {
  if (cache.connection) {
    return cache.connection;
  }

  cache.promise ??= mongoose.connect(MONGODB_URI || '');

  cache.connection = await cache.promise;

  return cache.connection;
}