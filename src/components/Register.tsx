"use client";

import {type FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Register({ toggleForm }: {toggleForm: () => void}) {
	const supabase = createClient();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = async (e:FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const {
				data: { user },
				error,
			} = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) {
				console.log(error);
				return;
			}

			const { error: profileError } = await supabase
				.from("profiles")
				.insert([
					{
						id: user?.id,
						first_name: firstName,
						last_name: lastName,
						username: username,
					},
				]);
			if (profileError) {
				console.log(profileError);
				return;
			}
			alert("Registration successful!");
			setFirstName("");
			setLastName("");
			setUsername("");
			setEmail("");
			setPassword("");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900">
			<div className="max-w-lg p-6 bg-gray-800 text-white rounded-lg shadow-lg w-full">
				<h1 className="text-3xl font-semibold text-center mb-6 text-gray-100">
					Create Account
				</h1>
				<form onSubmit={handleRegister} className="space-y-5">
					<div className="grid grid-cols-2 gap-5">
						<input
							type="text"
							placeholder="First Name"
							value={firstName}
							onChange={(e) =>
								setFirstName(e.target.value)
							}
							required
							className="p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
						/>
						<input
							type="text"
							placeholder="Last Name"
							value={lastName}
							onChange={(e) =>
								setLastName(e.target.value)
							}
							required
							className="p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
						/>
					</div>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
					/>
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

					<button
						type="submit"
						className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
						Register
					</button>
				</form>

				<p
					className="mt-4 text-center text-sm text-gray-600 hover:text-blue-500 cursor-pointer"
					onClick={toggleForm}>
					I already have an account
				</p>
			</div>
		</div>
	);
}
