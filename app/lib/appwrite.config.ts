import * as sdk from "node-appwrite";

export const {
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new sdk.Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66a40259000db4d54f98")
    .setKey(
        "2b56f06167d39b6ee8bd2e95d001bc9dd6bdfd33a7b5195fe16517bb2bed57c20a3d31155516893b60ef9e8d389a257091b03cd4cc44540f6d833fb21634e1dd00c4f8b167c4e3155a5c880fe7990e75fb7cb4ac786e6dc87f795ab2d33f29c351889473bc9641ceedae1a86dc411d2106d3fda11ab2fcf62b369362d9423eb5"
    );

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
