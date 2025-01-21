import { connectDB } from "../../../../server/server";
import { NextRequest, NextResponse } from "next/server";
import  Note  from "../../../../server/note";

connectDB();

export async  function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {title,content} = await requestBody;
        const note = await Note.create({title,content});
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}