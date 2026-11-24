import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  mobile: z
    .string()
    .min(1, "Please enter your mobile number")
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
});

const addressFields = {
  firstName: z.string().min(1, "Please enter your first name"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(1, "Please enter your city"),
  state: z.string().min(1, "Please select your state"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
};

export const addressSchema = z
  .object({
    email: z
      .string()
      .min(1, "Please enter your email")
      .email("Please enter a valid email"),
    ...addressFields,
    pincode: z
      .string()
      .regex(/^[1-9]\d{5}$/, "Please enter a valid 6-digit pincode"),

    billing: z.enum(["same", "different"]),
    billingDetails: z.object(addressFields).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.billing === "different") {
      if (!data.billingDetails) {
        ctx.addIssue({
          code: "custom",
          path: ["billingDetails"],
          message: "Please enter billing details",
        });
        return;
      }

      const result = z.object(addressFields).safeParse(data.billingDetails);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ["billingDetails", ...issue.path],
          });
        });
      }
    }
  });

export const transactionSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(12, "Transaction ID / UTR must be exactly 12 digits")
    .max(12, "Transaction ID / UTR must be exactly 12 digits")
    .regex(/^\d+$/, "Transaction ID / UTR must contain only numbers"),

  nameOfSender: z
    .string()
    .trim()
    .min(2, "Enter your name exactly as it appears in your UPI app"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
