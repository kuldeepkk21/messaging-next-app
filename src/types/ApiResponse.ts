import { Message } from "@/model/user";

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: Message[];
    isAcceptingMessages?: boolean;
}