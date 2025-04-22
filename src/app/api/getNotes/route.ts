import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../server/server";  
import Note from "../../../../server/note";
import User from "../../../../server/User";

interface JwtPayload {
        id: string;
    }

const verifyToken = (request: NextRequest): JwtPayload | null => {
    try {
        const token = request.cookies.get("token")?.value;
        const authHeader = request.headers.get("authorization");

        if (!token && (!authHeader || !authHeader.startsWith("Bearer "))) {
            return null;
        }

        const tokenToVerify = token || authHeader!.split(" ")[1];
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }
        return jwt.verify(tokenToVerify, process.env.JWT_SECRET) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.error("Invalid token:", error.message);
        } else if (error instanceof jwt.TokenExpiredError) {
            console.error("Token expired");
        } else {
            console.error("Token verification failed:", error);
        }
        return null;
    }
};

export async function GET(request:NextRequest) {
    try {
        await connectDB();
        const decodedToken = verifyToken(request);
        if (!decodedToken) {
            return NextResponse.json(
                { error: "Invalid or expired authentication token" },
                { status: 401 }
            );
        }
        const userId = decodedToken.id;
        
        const user = await User.findById(userId)

        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const notes = user.Notes
        if (!notes) {
          return NextResponse.json({ error: "No notes found" }, { status: 404 });
        }
       const  Notes= await Note.find({ _id: { $in: notes } });

        return NextResponse.json({ Notes }, { status: 200 });

    } catch (error:any) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}