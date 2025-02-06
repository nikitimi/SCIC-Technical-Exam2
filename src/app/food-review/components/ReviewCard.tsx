"use client";
import type { Review } from "@/hooks/food-review/useReviews";
import React, { useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import EditModal, { type EditModalProps } from "./EditModal";
import Image from "next/image";

type ReviewCardProps = {
	review: Review
	isCreator: boolean
	deleteReview: (id:string, path:string) => void,
	updateReview: EditModalProps['updateReview']
}

export default function ReviewCard({ review, isCreator, deleteReview, updateReview }:ReviewCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleEditClick = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="bg-gray-800 text-white max-w-2xl w-full p-4 rounded-lg shadow-lg mb-4 hover:shadow-2xl transition-shadow duration-300 relative">
			{isCreator && (
				<div className="absolute top-4 right-4 flex space-x-2">
					<button
						className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
						onClick={handleEditClick}>
						<FaEdit size={20} />
					</button>

					<button
						className="text-gray-400 hover:text-red-600 transition-colors duration-200"
						onClick={() => deleteReview(review.id, review.photo_path)}>
						<FaTrashAlt size={20} />
					</button>
				</div>
			)}

			<div className="flex items-center mb-4">
				<div className="mr-3">
					<Image
						src={`https://ui-avatars.com/api/?name=${review.profiles[0]?.first_name}+${review.profiles[0]?.last_name}&background=random&size=35`}
						alt={`${review.profiles[0]?.first_name} ${review.profiles[0]?.last_name}`}
						className="rounded-full w-8 h-8"
					/>
				</div>
				<div>
					<h3 className="text-base font-semibold">{isCreator ? "You" : review.profiles[0]?.username}</h3>
					<p className="text-sm text-gray-400">
						{review.profiles[0]?.first_name} {review.profiles[0]?.last_name}
					</p>
				</div>
			</div>

			<p className="px-6 mb-3 text-base whitespace-pre-line ">{review.review_text}</p>

			{review.photo_url && (
				<Image src={review.photo_url} alt="Review" className="w-96 h-auto rounded-lg shadow-md mb-3 mx-auto" />
			)}

			<div className="flex justify-between items-center">
				<span className="text-xs text-gray-500">
					Posted on{" "}
					{new Date(review.created_at).toLocaleString("en-US", {
						month: "2-digit",
						day: "2-digit",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						hour12: true,
					})}
				</span>
			</div>

			<EditModal isOpen={isModalOpen} closeModal={closeModal} review={review} updateReview={updateReview} />
		</div>
	);
}
