import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GDriveLite from "./page";
import { createClient } from "@/utils/supabase/client";

jest.mock("@/hooks/useFetchUserClient");

jest.mock("@/utils/supabase/client", () => ({
	createClient: jest.fn().mockReturnValue({
		storage: {
			from: jest.fn().mockReturnValue({
				upload: jest.fn().mockResolvedValue({}),
				list: jest.fn().mockResolvedValue({ data: [{ name: "photo_1.png" }, { name: "photo_2.png" }] }),
			}),
		},
		auth: {
			getUser: jest.fn().mockResolvedValue({ data: { user: { id: "user_123" } } }),
		},
	}),
}));

describe("GDriveLite", () => {
	test("make sure input box and submit button is rendered", () => {
		render(<GDriveLite />);

		const fileInput = screen.getByLabelText(/upload/i);
		expect(fileInput).toBeInTheDocument();
		expect(fileInput).toHaveAttribute("accept", "image/*");
	});

	test("ensure duplicate photos have different filename", async () => {
		render(<GDriveLite />);

		const fileInput = screen.getByLabelText(/upload/i);
		const imageFile = new File(["image"], "photo_1.png", { type: "image/png" });

		fireEvent.change(fileInput, { target: { files: [imageFile] } });
		await waitFor(() => screen.getByRole("button", { name: /upload/i }));
		fireEvent.click(screen.getByRole("button", { name: /upload/i }));

		await waitFor(() => screen.getAllByRole("img"));

		const firstUploadedImage = screen.getAllByRole("img")[0];
		const firstUploadedFileName = firstUploadedImage?.getAttribute("alt");

		fireEvent.change(fileInput, { target: { files: [imageFile] } });
		fireEvent.click(screen.getByRole("button", { name: /upload/i }));

		await waitFor(() => screen.getAllByRole("img"));

		const secondUploadedImage = screen.getAllByRole("img")[1];
		const secondUploadedFileName = secondUploadedImage?.getAttribute("alt");

		expect(firstUploadedFileName).not.toBe(secondUploadedFileName);

		const uploadedPhotos = screen.getAllByRole("img");
		expect(uploadedPhotos).toHaveLength(2);
	});

	test("only allows image file uploads", () => {
		jest.spyOn(window, "alert").mockImplementation(() => {});

		render(<GDriveLite />);

		const fileInput = screen.getByLabelText(/upload/i);
		const imageFile = new File(["image"], "photo.png", { type: "image/png" });
		const nonImageFile = new File(["text"], "file.txt", { type: "text/plain" });

		fireEvent.change(fileInput, { target: { files: [imageFile] } });
		expect((fileInput as HTMLInputElement).files?.[0]).toEqual(imageFile);

		fireEvent.change(fileInput, { target: { files: [nonImageFile] } });
		expect((fileInput as HTMLInputElement).value).toBe("");
	});

	test("fetches and displays only the logged-in user's photos", async () => {
		const mockSupabase = createClient();

		render(<GDriveLite />);

		await waitFor(() => expect(mockSupabase.auth.getUser).toHaveBeenCalled());
		await waitFor(() => expect(mockSupabase.storage.from("user_123").list).toHaveBeenCalledWith("user_123/"));

		expect(screen.getByAltText("photo_1.png")).toBeInTheDocument();
		expect(screen.getByAltText("photo_2.png")).toBeInTheDocument();
		expect(screen.queryByAltText("another_user_photo.png")).not.toBeInTheDocument();
	});
});
