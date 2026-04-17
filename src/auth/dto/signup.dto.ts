import { GenderEnum, ProvidersEnum, RoleEnum } from "src/common/enums/user.enum";
import z from "zod";

export const signupSchema = z
.strictObject({
firstName: z.string().min(2).max(20),
lastName: z.string().min(2).max(20),
username: z.string() .min(2) .max(45),
email: z.email(),
password: z.string(), 
confirmPassword: z.string(),
role: z.enum(RoleEnum) .optional() .default(RoleEnum.USER),
gender: z. enum (GenderEnum).optional().default (GenderEnum.MALE), 
provider: z.enum(ProvidersEnum) .optional().default(ProvidersEnum.SYSTEM),
phone: z.string() .refine(
(val) => {
const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
return phoneRegex.test(val);
},
{

    message: "Phone number is not valid",

} 
).optional(),
})
.refine((data)=>data.password === data.confirmPassword,{
    message:'password and confirm password must match',
    path:["confirmPassword"],
});
export type SignUpDTO = z.infer<typeof signupSchema>;

export const resendOtpSchema = z
.strictObject({
email: z.email(),
});
export type ResendDTO = z.infer<typeof resendOtpSchema>;

export const confirmEmailSchema = z
.strictObject({
email: z.email(),
otp: z.string().regex(/^\d{6}$/),
});
export type ConfirmEmailDTO = z.infer<typeof confirmEmailSchema>;


export const loginSchema = z
.strictObject({
email: z.email(),
password: z.string(),
});
export type LoginDTO = z.infer<typeof loginSchema>;