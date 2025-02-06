import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function useFetchUserClient() {
	const [user, setUser] = useState<User | null>(null);
	const supabase = createClient();
	const fetchUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		setUser(user);
	};
	useEffect(() => {
		fetchUser();
	}, []);//eslint-disable-line
	return { user };
}
