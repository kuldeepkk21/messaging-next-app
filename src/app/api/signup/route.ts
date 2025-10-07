import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { log } from "console";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne(
            {
                username,
                isVerified: true 
            }
        );
        if (existingUserVerifiedByUsername) {
            return Response.json(
                { success: false, message: "Username already taken" },
                { status: 400 }
            );
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserByEmail = await UserModel.findOne({ email });

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    { success: false, message: "Email already registered and verified" },
                    { status: 400 }
                );
            } 
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.isVerified = true;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: "Failed to send verification email", details: emailResponse.message },
                { status: 500 }
            );
        }
        return Response.json(
            { success: true, message: "Verification email sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error during signup:", error);
        return Response.json(
            { success: false, message: "Error during signup" },
            { status: 500 }
        );
    }
}
