"use client";
import React, { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { createClient } from "@/utils/supabase/client";

export type Task = {
	id: string
	title: string
}

export default function TodoList() {
	const supabase = createClient();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return user?.id;
	};

	const editTask = async (taskId:string, newTitle:string) => {
		const { error } = await supabase.from("tasks").update({ title: newTitle }).eq("id", taskId);
		console.log("debug ran");
		if (error) return console.log("Error updating task:", error);

		setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task)));
	};

	const deleteTask = async (taskId:string) => {
		const { error } = await supabase.from("tasks").delete().eq("id", taskId);

		if (error) return console.log("Error deleting task:", error);

		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
	};

	const addTask = async (task:string) => {
		if (!task.trim()) return;

		const userId = await fetchUser();
		const { data, error } = await supabase
			.from("tasks")
			.insert([
				{
					user_id: userId,
					title: task,
					completed: false,
				},
			])
			.select()
			.single();
		if (error) {
			console.log("Error inserting task:", error);
			return;
		}
		setTasks((prevTasks) => [...prevTasks, data]);
	};

	const fetchTasks = async () => {
		setIsLoading(true);
		const userId = await fetchUser();
		const { data, error } = await supabase.from("tasks").select("title, id, completed").eq("user_id", userId);

		if (error) {
			console.log(error);
		} else {
			setTasks(data);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []); //eslint-disable-line

	return (
		<div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg text-zinc-300">
			<h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>
			<AddTask addTask={addTask} />

			<TaskList tasks={tasks} isLoading={isLoading} deleteTask={deleteTask} editTask={editTask} />

			<div className="mt-4 flex justify-between text-gray-400 text-sm">
				<span>{tasks.length} tasks remaining</span>
			</div>
		</div>
	);
}
