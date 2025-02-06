"use client";
import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type UserProps = { 
	firstName:string, 
	lastName: string, 
	userName: string 
}

const LeftSidebar = ({ firstName, lastName, userName }:UserProps) => {
	const supabase = createClient();

	const deleteAccount = async () => {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();
		if (error) {
			console.log("Error fetching user:", error.message);
			return;
		}
		if (!user) return
		const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
		if (deleteError) {
			console.log("Error deleting account:", deleteError.message);
		} else {
			console.log("Account deleted successfully");
			window.location.reload();
		}
	};
	const logout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.log("Error logging out:", error.message);
		} else {
			window.location.reload();
		}
	};

	return (
		<div className="sticky top-0 left-0 w-64 h-screen p-6 flex flex-col justify-between bg-gray-200 dark:bg-gray-800">
			<div className="text-center">
				<span className="text-xl block font-semibold text-gray-900 dark:text-white">
					{firstName} {lastName}
				</span>
				<span className="text-sm text-gray-500 dark:text-gray-400">@{userName}</span>
			</div>

			<hr className="my-6 border-gray-300 dark:border-gray-600" />

			<div className="flex flex-col space-y-4">
				<Link href={"/"}>
					<button className="text-lg text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
						Home
					</button>
				</Link>

				<Link href={"/todo-list"}>
					<button className="text-lg text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
						Todo List
					</button>
				</Link>
				<Link href={"/gdrive-lite"}>
					<button className="text-lg text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
						Google Drive Lite
					</button>
				</Link>
				<Link href={"/food-review"}>
					<button className="text-lg text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
						Food Reviews
					</button>
				</Link>
				<Link href={"/pokemon-review"}>
					<button className="text-lg text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
						Pokemon Reviews
					</button>
				</Link>
				<Link href={"/markdown-note"}>
					<button className="text-lg text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
						Markdown Note
					</button>
				</Link>
			</div>

			<div className="mt-auto flex flex-col space-y-4">
				<button
					onClick={logout}
					className="text-sm text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 p-2 rounded">
					Logout
				</button>
				<button
					onClick={deleteAccount}
					className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 p-2 rounded border border-red-500 dark:border-red-400">
					Delete Account
				</button>
			</div>
		</div>
	);
};

export default LeftSidebar;
