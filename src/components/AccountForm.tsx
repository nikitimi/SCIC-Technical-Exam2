"use client";
import { useState } from "react";
import React from "react";
import Login from "./Login";
import Register from "./Register";

function AccountForm() {
	const [showLogin, setShowLogin] = useState(true);

	const toggleForm = () => {
		setShowLogin(!showLogin);
	};

	return (
		<div>
			{showLogin ? (
				<Login toggleForm={toggleForm} />
			) : (
				<Register toggleForm={toggleForm} />
			)}
		</div>
	);
}

export default AccountForm;
