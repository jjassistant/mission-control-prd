import { NextResponse } from "next/server";
import { getTasks } from "@/app/lib/things-db";

// M1: raw read endpoint — proves the DB layer end to end.
// GET /api/tasks?today=1 to filter to today's list.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const todayOnly = searchParams.get("today") === "1";
  try {
    const tasks = getTasks({ todayOnly });
    return NextResponse.json({ count: tasks.length, tasks });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 }
    );
  }
}
