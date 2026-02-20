import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_COURSE_ID = "15";
const COURSE_IDS = ["1", "15"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/course\/([^/]+)$/);
  if (match) {
    const segment = match[1];
    if (!COURSE_IDS.includes(segment)) {
      return NextResponse.redirect(new URL(`/course/${DEFAULT_COURSE_ID}/${segment}`, request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/course/:segment",
};
