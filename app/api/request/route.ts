// executes the request and writes analytics to the database
// Click ‘Send Request’ must log analytics to DB; request executed from server
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "Request API GET works!" });
}
