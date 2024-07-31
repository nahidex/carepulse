"use client";
//gahofa1063@mfunza.com
//Abcd!234

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/app/lib/validation";
import { registerPatient } from "@/app/lib/actions/patient.actions";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
    Doctors,
    GenderOptions,
    IdentificationTypes,
    PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "@/components/ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

export enum FormFieldTypes {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneinput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePiker",
    SELECT = "select",
    SKELETON = "skeleton",
}

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // 1. Define your fo1rm.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    });

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);

        let formData;

        if (
            values.identificationDocument &&
            values.identificationDocument?.length > 0
        ) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            });

            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", values.identificationDocument[0].name);
        }

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: values.identificationDocument
                    ? formData
                    : undefined,
                identificationType: values.identificationType,
                privacyConsent: values.privacyConsent,
            };

            const patient = await registerPatient(patientData);

            if (patient) router.push(`/patients/${user.$id}/new-appointment`);
            //
        } catch (error: any) {
            console.log(error);
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-12 flex-1"
            >
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p>Let us know more about yourself.</p>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Habib Nahid"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
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
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of Birth"
                    />

                    <CustomFormField
                        fieldType={FormFieldTypes.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option) => (
                                        <div
                                            key={option}
                                            className="radio-group"
                                        >
                                            <RadioGroupItem
                                                value={option}
                                                id={option}
                                            />
                                            <Label
                                                htmlFor={option}
                                                className="cursor-pointer"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="Mirpur-14, Dhaka, BD"
                    />

                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Guardian's Name"
                    />

                    <CustomFormField
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="emergency Contact Number"
                        placeholder="(555) 123-4567"
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldTypes.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary care physician"
                    placeholder="Select a physician"
                >
                    {Doctors.map((doctor, i) => (
                        <SelectItem key={doctor.name + i} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                    src={doctor.image}
                                    width={32}
                                    height={32}
                                    alt="doctor"
                                    className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="BlueCross BlueShield"
                    />

                    <CustomFormField
                        fieldType={FormFieldTypes.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="ABCD152433"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, Pencillin, Pollen"
                    />

                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current Medication (if any)"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="Mother had braind cancer, Father ahd heart Deisease"
                    />

                    <CustomFormField
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendectomy, Tonsillectomy"
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">
                            Identification and Verification
                        </h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldTypes.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification Type"
                    placeholder="Select Identification Type"
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldTypes.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="1324569879"
                />
                <CustomFormField
                    fieldType={FormFieldTypes.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned Copy of Indentification Document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader
                                files={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                    )}
                />

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I Consent to treatment"
                />
                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I Consent to disclosure of information"
                />
                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I Consent to privacy policy"
                />

                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    );
};

export default RegisterForm;
