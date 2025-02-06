import { updateSession } from "@/utils/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request:NextRequest) {
	const url = request.nextUrl;
	if (url.pathname === "/") {
		return NextResponse.next();
	}

	return await updateSession(request);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
		"/about",
		"/todo-list",
		"/food-review",
		"/pokemon-review",
		"/markdown-note",
	],
};
