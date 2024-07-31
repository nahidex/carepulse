"use server";

import { ID, Query } from "node-appwrite";
import { databases } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (
    appointment: CreateAppointmentParams
) => {
    try {
        const newAppointment = await databases.createDocument(
            "66a402d9003db0bc6324",
            "66a40366003026bced9f",
            ID.unique(),
            appointment
        );
        console.log(newAppointment);

        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
};

export const getAppointment = async (appointmentId: string) => {
    try {
        const patients = await databases.getDocument(
            "66a402d9003db0bc6324",
            "66a40366003026bced9f",
            appointmentId
        );
        return parseStringify(patients);
    } catch (error) {
        console.log(error);
    }
};
