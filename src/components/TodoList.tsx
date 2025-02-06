"use client";
import React from "react";

export default function TodoList() {
	return (
		<div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg text-zinc-300">
			<h1 className="text-2xl font-bold text-center mb-4">
				Todo List
			</h1>
			<div className="flex gap-2 mb-4">
				<input
					type="text"
					placeholder="Add a new task..."
					className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
					Add
				</button>
			</div>
			<ul className="space-y-3">
				{[1, 2, 3].map((task) => (
					<li
						key={task}
						className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								className="w-5 h-5 accent-blue-500"
							/>
							<span className="text-lg">
								Task {task}
							</span>
						</div>
						<button className="text-red-500 hover:text-red-400">
							✖
						</button>
					</li>
				))}
			</ul>
			<div className="mt-4 flex justify-between text-gray-400 text-sm">
				<span>3 tasks remaining</span>
				<button className="hover:underline">
					Clear Completed
				</button>
			</div>
		</div>
	);
}
