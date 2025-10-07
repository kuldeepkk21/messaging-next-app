
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string, 
    username: string, 
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'myApp Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' };
    }

}