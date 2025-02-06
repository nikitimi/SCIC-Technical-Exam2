import React, { useState } from "react";

type AddTaskProps = {
	addTask: (task:string) => void
}

export default function AddTask({ addTask }:AddTaskProps) {
	const [task, setTask] = useState("");
	return (
		<div className="flex gap-2 mb-4">
			<input
				type="text"
				placeholder="Add a new task..."
				className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={task}
				onChange={(e) => setTask(e.target.value)}
			/>
			<button
				data-testid="add-task-button"
				onClick={() => {
					addTask(task);
					setTask("");
				}}
				className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
				Add
			</button>
		</div>
	);
}
