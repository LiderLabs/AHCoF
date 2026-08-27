import { z } from "zod";

export const signupFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
});

export const loginFormSchema = z.object({
  identifier: z.string().min(1, "Enter your email or phone number"),
  password: z.string().min(1, "Password is required"),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;