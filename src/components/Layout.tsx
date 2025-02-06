import { createClient } from "@/utils/supabase/server";
import AccountForm from "@/components/AccountForm";
import {type ReactNode, Suspense } from "react";
import Loading from "@/app/loading";
import NavBar from "@/components/NavBar";

export type Children = {children: Readonly<ReactNode>}

export default async function MainLayout({ children }:Children) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data: profile, error } = await supabase
			.from("profiles")
			.select()
			.eq("id", user.id)
			.single();

		if (error) {
			console.error("Error fetching profile:", error);
		}
		if (profile) {
			return (
				<Suspense fallback={<Loading />}>
					<div className="relative flex flex-row min-h-screen bg-gray-900 text-white">
						<NavBar
							firstName={profile.first_name}
							userName={profile.username}
							lastName={profile.last_name}
						/>
						<div className="flex flex-col  items-center justify-center w-full">
							{children}
						</div>
					</div>
				</Suspense>
			);
		}
	}

	return <AccountForm />;
}
