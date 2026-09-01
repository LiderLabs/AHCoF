import { z } from "zod";

const passwordRule = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number");

export const signupFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    emailAddress: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.email({ message: "Enter a valid email" }).optional()
    ),
    phoneNumber: z.string().regex(/^0(2[0-8]|5[0-9])\d{7}$/, "Enter a valid phone number"),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  identifier: z
    .string()
    .min(1, "Enter your email or phone number")
    .refine(
      (value) => {
        const looksLikeEmail = value.includes("@");
        if (looksLikeEmail) {
          return z.email().safeParse(value).success;
        }
        // if it doesn't look like an email, treat it as a phone number
        return value.length >= 10;
      },
      { message: "Enter a valid email or phone number" }
    ),
  password: z.string().min(1, "Password is required"),
});

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"), // adjust length if backend uses a different code length
});

export const completeProfileSchema = z.object({
  gender: z.enum(["male", "female"], { message: "Select a gender" }),
  churchBranch: z.string().min(1, "Church branch is required"),
  conference: z.string().min(1, "Conference is required"),
  gpsAddress: z.string().min(1, "GPS address is required"),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;