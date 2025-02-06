import React, { useState } from "react";
import type { Task } from "../page";

type TaskListProps = { 
	tasks: Task[]
	isLoading: boolean, 
	deleteTask: (taskId: string) => void, 
	editTask: (taskId: string, title: string) => Promise<void>, 
}

export default function TaskList({ tasks, isLoading, deleteTask, editTask }:TaskListProps) {
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [editedTitle, setEditedTitle] = useState("");

	const handleEditClick = (task:Task) => {
		setEditingTask(task);
		setEditedTitle(task.title);
	};

	const handleSaveClick = async (taskId:string) => {
		await editTask(taskId, editedTitle);
		setEditingTask(null);
		setEditedTitle("");
	};

	const handleCancelClick = () => {
		setEditingTask(null);
		setEditedTitle("");
	};

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return (
		<ul className="space-y-3">
			{tasks.map((task) => (
				<li key={task.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
					<div className="flex items-center gap-2">
						{editingTask?.id === task.id ? (
							<input
								type="text"
								value={editedTitle}
								onChange={(e) => setEditedTitle(e.target.value)}
								className="text-lg bg-transparent border-b border-gray-500 focus:outline-none"
							/>
						) : (
							<span className="text-lg">{task.title}</span>
						)}
					</div>
					<div className="flex gap-2">
						{editingTask?.id === task.id ? (
							<>
								<button
									className="text-green-500 hover:text-green-400"
									onClick={() => handleSaveClick(task.id)}>
									Save
								</button>
								<button className="text-gray-500 hover:text-gray-400" onClick={handleCancelClick}>
									Cancel
								</button>
							</>
						) : (
							<button
								className="text-yellow-500 hover:text-yellow-400"
								onClick={() => handleEditClick(task)}>
								✏️
							</button>
						)}
						<button
							data-testid={`delete-button-${task.id}`}
							className="text-red-500 hover:text-red-400"
							onClick={() => deleteTask(task.id)}>
							✖
						</button>
					</div>
				</li>
			))}
		</ul>
	);
}
