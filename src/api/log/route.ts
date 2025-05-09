import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    const body = await req.json();
    const { signature } = body;
    console.log(`Transaction signature: ${signature}`);
    return NextResponse.json({ message: "Logged" }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
