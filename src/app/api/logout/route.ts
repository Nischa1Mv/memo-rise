import { connectDB } from "../../../../server/server";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(request: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "Logout success",
            success: true,
        });
        //token is removed from the cookies
        response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
        return response;
        //response is sent and user is logged out
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}