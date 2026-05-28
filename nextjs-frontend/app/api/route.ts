import { getData } from "@/utils/fetchData";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getData();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
