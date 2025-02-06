"use client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUser() {
	const [user, setUser] = useState<User | null>(null);
	const supabase = createClient();

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error) return console.error("error fetching current user", error);
			setUser(user);
		};
		fetchUser();
	}, []);//eslint-disable-line
	return { user };
}
