import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TodoList from "./page";

jest.mock("@/utils/supabase/client", () => ({
	createClient: jest.fn().mockReturnValue({
		auth: {
			getUser: jest.fn().mockResolvedValue({
				data: { user: { id: "user-123" } },
			}),
		},
		from: jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				eq: jest.fn().mockResolvedValue({
					data: [
						{ id: "1", title: "Task 1", completed: false },
						{ id: "2", title: "Task 2", completed: false },
						{ id: "3", title: "Task 3", completed: false },
					],
					error: null,
				}),
			}),
			delete: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnValue({
				data: [],
				error: null,
			}),
			insert: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnValue({
					single: jest.fn().mockReturnValue({
						data: { id: "4", title: "Task 4", completed: false },
					}),
				}),
			}),
			update: jest.fn().mockReturnValue({
				eq: jest.fn().mockReturnValue({
					data: [],
					error: null,
				}),
			}),
		}),
	}),
}));

test("add task is working and is rendered", async () => {
	render(<TodoList />);
	await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());
	await waitFor(() => expect(screen.getByText("Task 2")).toBeInTheDocument());
	await waitFor(() => expect(screen.getByText("Task 3")).toBeInTheDocument());
	expect(screen.getByText("3 tasks remaining")).toBeInTheDocument();
	const inputElement = screen.getByPlaceholderText(/Add a new task.../i);
	fireEvent.change(inputElement, { target: { value: "New task" } });
	const addTaskBtn = screen.getByTestId("add-task-button");
	fireEvent.click(addTaskBtn);
	await waitFor(() => expect(screen.getByText("Task 4")).toBeInTheDocument());
});

test("delete task will delete the task and remove it from render", async () => {
	render(<TodoList />);
	await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

	const deleteButton = screen.getByTestId("delete-button-1");

	fireEvent.click(deleteButton);

	await waitFor(() => expect(screen.queryByText("Task 1")).not.toBeInTheDocument());
});

test("update task when its saved and render it", async () => {
	const mockEditTask = jest.fn();
	const mockDeleteTask = jest.fn();

	const initialTasks = [
		{ id: 1, title: "Task 1" },
		{ id: 2, title: "Task 2" },
	];

	render(<TodoList tasks={initialTasks} isLoading={false} deleteTask={mockDeleteTask} editTask={mockEditTask} />);

	await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

	const editButton = screen.getAllByText("✏️")[0];
	fireEvent.click(editButton);

	const inputElement = screen.getByDisplayValue("Task 1");
	fireEvent.change(inputElement, { target: { value: "Updated Task 1" } });

	const saveButton = screen.getByText("Save");
	fireEvent.click(saveButton);

	await waitFor(() => {
		expect(screen.getByText("Updated Task 1")).toBeInTheDocument();
	});

	expect(screen.queryByDisplayValue("Updated Task 1")).toBeNull();
});
