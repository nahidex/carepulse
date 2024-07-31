"use client";
//gahofa1063@mfunza.com
//Abcd!234

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/app/lib/validation";
import { createUser } from "@/app/lib/actions/patient.actions";

export enum FormFieldTypes {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneinput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePiker",
    SELECT = "select",
    SKELETON = "skeleton",
}

const PatientForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // 1. Define your fo1rm.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    async function onSubmit({
        name,
        email,
        phone,
    }: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);

        try {
            const userData = {
                name,
                email,
                phone,
            };

            const user = await createUser(userData);

            console.log(user);

            router.push(`/patients/${user.$id}/register`);
        } catch (error: any) {
            console.log(error);
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 flex-1"
            >
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p>Schedule your first appontment.</p>
                </section>

                <CustomFormField
                    fieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="Habib Nahid"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <CustomFormField
                    fieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="example@email.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />

                <CustomFormField
                    fieldType={FormFieldTypes.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    );
};

export default PatientForm;
