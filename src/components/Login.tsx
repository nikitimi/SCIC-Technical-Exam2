"use client";

import type { AuthError } from "@supabase/supabase-js";
import { type FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Login({ toggleForm }:{ toggleForm: () => void }) {
	const supabase = createClient();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<AuthError | null>(null);

	const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			setError(error);
		} else {
			window.location.reload();
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900 ">
			<div className="max-w-lg p-6 bg-gray-800 text-white rounded-lg shadow-lg w-full">
				<h1 className="text-3xl font-semibold text-center mb-6 text-gray-100">Login to Your Account</h1>
				<form onSubmit={handleSubmit} className="space-y-5">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
					/>
					{error && <span className="text-red-400  block text-center">{error?.message}</span>}
					<button
						type="submit"
						className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
						Login
					</button>
				</form>

				<p
					className="mt-4 text-center text-sm text-gray-600 hover:text-blue-500 cursor-pointer"
					onClick={toggleForm}>
					I don&apos;t have an account
				</p>
			</div>
		</div>
	);
}
