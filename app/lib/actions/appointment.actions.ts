"use server";

import { ID, Query } from "node-appwrite";
import { databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { log } from "console";
import { NEXT_CACHE_REVALIDATED_TAGS_HEADER } from "next/dist/lib/constants";
import { revalidatePath } from "next/cache";

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

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            "66a402d9003db0bc6324",
            "66a40366003026bced9f",
            [Query.orderDesc("$createdAt")]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };
        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                if (appointment.status === "scheduled") {
                    acc.scheduledCount += 1;
                } else if (appointment.status === "pending") {
                    acc.pendingCount += 1;
                } else if (appointment.status === "cancelled") {
                    acc.cancelledCount += 1;
                }
                return acc;
            },
            initialCounts
        );
        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        };

        return parseStringify(data);
    } catch (error) {}
};

export const updateAppointment = async ({
    appointmentId,
    userId,
    appointment,
    type,
}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            "66a402d9003db0bc6324",
            "66a40366003026bced9f",
            appointmentId,
            appointment
        );
        if (!updatedAppointment) {
            throw new Error("Appointment Not Found.");
        }

        //TODO: sms notification

        revalidatePath("/admin");
        return parseStringify(updatedAppointment);
    } catch (error) {
        console.log(error);
    }
};
