"use server";

import { ID, Query, InputFile } from "node-appwrite";
import {
    databases,
    PROJECT_ID,
    storage,
    users,
} from "@/app/lib/appwrite.config";

import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
    try {
        // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
        const newuser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        );

        return newuser;
    } catch (error: any) {
        // Check existing user
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email]),
            ]);

            return existingUser.users[0];
        }
        console.error("An error occurred while creating a new user:", error);
    }
};

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);
    } catch (error) {
        console.log(error);
    }
};

export const registerPatient = async ({
    identificationDocument,
    ...patient
}: RegisterUserParams) => {
    try {
        // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
        let file;

        if (identificationDocument) {
            const inputFile =
                identificationDocument &&
                InputFile.fromBlob(
                    identificationDocument?.get("blobFile") as Blob,
                    identificationDocument?.get("fileName") as string
                );
        }
        const newPatient = await databases.createDocument(
            PROJECT_ID!,
            "66a402f20037c5c6b03b",
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                indentificationDocumentUrl: `https://cloud.appwrite.io/v1/storage/buckets/66a40399003ccda5cb78/files/${file?.$id}/view?project=66a40259000db4d54f98`,
                ...patient,
            }
        );
        return parseStringify(newPatient);
    } catch (error) {
        console.log(error);
    }
};

export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            "66a402d9003db0bc6324",
            "66a402f20037c5c6b03b",
            [Query.equal("userId", userId)]
        );
        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log(error);
    }
};
