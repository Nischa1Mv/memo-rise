import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../server/server";
import Note from "../../../../server/note";

interface JwtPayload {
        id: string;
    }

    interface NoteInput {
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

export  async function DELETE (request:NextRequest) {
    try {
        await connectDB();
        const decodedToken = verifyToken(request);
        if (!decodedToken) {
            return NextResponse.json(
                { error: "Invalid or expired authentication token" },
                { status: 401 }
            );
        }
        const body = await request.json().catch(() => ({}));
        const { id }:NoteInput = body;
        if (!id || typeof id !== 'string') {
            return NextResponse.json(
                { error: "Invalid note ID provided" },
                { status: 400 }
            );
        }
        const note = await Note.findOne({ id });
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
        await Note.deleteOne({ id });
        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
        
    }
}