import { connectDB } from "../../../../server/server";
import { NextRequest, NextResponse } from "next/server";
import Note from "../../../../server/note";
import User from "../../../../server/User";
import jwt from "jsonwebtoken";


interface NoteInput {
    id: string;
    title: string;
    content: string;
}
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

export async function POST(request: NextRequest) {
    let connection = false;
    try {
        await connectDB();
        connection = true;

        const decodedToken = verifyToken(request);
        if (!decodedToken) {
            return NextResponse.json(
                { error: "Invalid or expired authentication token" },
                { status: 401 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const { id, title, content }: NoteInput = body;

        // Input validation
        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        if (!id || typeof id !== 'string') {
            return NextResponse.json(
                { error: "Invalid note ID format" },
                { status: 400 }
            );
        }

        const titleTrimmed = title?.trim();
        const contentTrimmed = content?.trim();

        if (!titleTrimmed || !contentTrimmed) {
            return NextResponse.json(
                { error: "Title and content are required and cannot be empty" },
                { status: 400 }
            );
        }

        if (titleTrimmed.length > 200) {
            return NextResponse.json(
                { error: "Title exceeds maximum length of 200 characters" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        let note = await Note.findOne({ id });
        if (note) {
            note = await Note.findByIdAndUpdate(
                id,
                {
                    title: titleTrimmed,
                    content: contentTrimmed,
                },
                { new: true, runValidators: true }
            );
        } else {
            note = await Note.create({
                id: id,
                title: titleTrimmed,
                content: contentTrimmed,
            });
        }

        await User.findByIdAndUpdate(
            decodedToken.id,
            {
                $addToSet: { Notes: note._id },
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            {
                message: "Note saved successfully",
                note,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error saving note:", error);

        if (!connection) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 503 }
            );
        }

        if (error.name === "ValidationError") {
            return NextResponse.json(
                { error: "Invalid note data: " + error.message },
                { status: 400 }
            );
        }

        if (error.name === "MongoError" || error.name === "MongoServerError") {
            if (error.code === 11000) {
                return NextResponse.json(
                    { error: "Note ID already exists" },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: "Database error" },
                { status: 500 }
            );
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: "Invalid authentication token" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
