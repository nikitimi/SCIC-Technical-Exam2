"use client";
import type { Review } from "@/hooks/food-review/useReviews";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

export type EditModalProps = { 
	isOpen: boolean
	closeModal: () => void, 
	review: Review, 
	updateReview: (id: string, image:File|null,text:string) => Promise<void>
}

export default function EditModal({ isOpen, closeModal, review, updateReview }:EditModalProps) {
	const [newReviewText, setNewReviewText] = useState(review.review_text);
	const [newImage, setNewImage] = useState<File | null>(null);
	const [displayedImage, setDisplayedImage] = useState<string | null>(null);

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return
		const file = e.target.files[0];
		if (file) {
			setNewImage(file);
			setDisplayedImage(URL.createObjectURL(file));
			console.log(newImage);
		}
	};

	const handleSaveEditClick = async () => {
		await updateReview(review.id, newImage, newReviewText);
		closeModal();
	};

	return (
		isOpen && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
				<div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
					<h2 className="text-xl font-semibold mb-4 text-center">Edit Review</h2>

					<textarea
						className="w-full p-2 mb-4 text-base bg-gray-700 text-white resize-none rounded-md"
						value={newReviewText}
						rows={5}
						onChange={(e) => setNewReviewText(e.target.value)}
					/>

					<div className="mb-4">
						{displayedImage ? (
							<Image
								src={displayedImage}
								alt="New Image Preview"
								className="w-full h-auto rounded-md mb-2"
							/>
						) : (
							<Image
								src={review.photo_url}
								alt="Current Review Image"
								className="w-full h-auto rounded-md mb-2"
							/>
						)}
					</div>

					<input type="file" className="mb-4" accept="image/*" onChange={handleImageChange} />

					<div className="flex justify-end space-x-4">
						<button className="bg-red-600 py-2 px-4 rounded-sm hover:bg-red-700" onClick={closeModal}>
							Cancel
						</button>
						<button
							className="bg-green-600 py-2 px-4 rounded-sm hover:bg-green-700"
							onClick={handleSaveEditClick}>
							Save
						</button>
					</div>
				</div>
			</div>
		)
	);
}
