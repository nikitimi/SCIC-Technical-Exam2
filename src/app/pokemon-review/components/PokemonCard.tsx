"use client";

import Image from "next/image";
import type { Pokemon } from "./ReviewEntry";
import type { Review } from "@/hooks/food-review/useReviews";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaTrashAlt, FaEdit, FaSave, FaRegTimesCircle } from "react-icons/fa";

export type PokemonCardProps = {
	pokemon: Pokemon
	onClose: () => void
	reviews: (Review & Pokemon)[],
	typeColors: Record<string, string>
	userReview: {
		review_text: string
		user_id: string
		review_id: string
	},
	addReview: () => void,
	reviewText: string,
	setReviewText: (reviewText:string) => void,
	deleteReview: () => void,
	editReview: () => void,
}

const PokemonCard = ({
	pokemon,
	onClose,
	reviews,
	typeColors,
	userReview,
	addReview,
	reviewText,
	setReviewText,
	deleteReview,
	editReview,
}:PokemonCardProps) => {
	const [isEditing, setIsEditing] = useState(false);
	if (!pokemon) return null;
	if (!reviews) reviews = [];

	const hdImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="flex relative space-x-1">
				<button
					className="absolute z-10 top-[-10px] right-[-10px] bg-gray-500 text-white hover:bg-red-600 rounded-full p-1 shadow-lg transform hover:scale-110"
					onClick={onClose}>
					<FaTimes size={20} />
				</button>

				<div className="bg-gray-900 text-white p-6 rounded-md w-96 shadow-lg relative">
					<div className="flex flex-col items-center">
						<div className="flex flex-row justify-between w-full">
							<h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
							<div className="flex gap-2">
								{pokemon.types?.map((type, index) => (
									<span
										key={index}
										className="px-3 py-1 rounded-full text-sm font-semibold"
										style={{
											backgroundColor: typeColors[type.type.name] || "#ffffff",
											color: typeColors[type.type.name] ? "#fff" : "#000",
										}}>
										{type.type.name}
									</span>
								))}
							</div>
						</div>

						<Image src={hdImageUrl} alt={pokemon.name} className="w-60 h-60 mt-4" />
					</div>
				</div>

				<div className="w-96 bg-gray-800 p-6 relative flex flex-col rounded-md">
					<div className="space-y-4 flex-grow overflow-y-auto max-h-[200px] scroll-hidden relative">
						{reviews?.map((review, index) => {
							console.log(review)
							return <div key={index} className="border border-gray-700 p-4 rounded-lg">
								<p className="text-sm text-gray-300">&quot;{review.review_text}&quot;</p>
								<div className="flex items-center mt-2">
									{/* <span className="text-sm text-gray-500">By @{review.user_id}</span> */}
								</div>
							</div>
						})}
					</div>

					<div className="mt-4">
						{userReview ? (
							isEditing ? (
								<div className="relative pr-4 flex bg-gray-700 text-white rounded-lg border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300">
									<input
										className="scroll-hidden w-full text-sm p-4 bg-transparent focus:outline-none "
										placeholder="Write your review..."
										value={reviewText}
										onChange={(e) => setReviewText(e.target.value)}
									/>
									<div className="  flex space-x-3">
										<button
											className="   text-gray-400 hover:text-green-600"
											onClick={() => {
												editReview();
												setIsEditing(false);
											}}>
											<FaSave size={15} />
										</button>
										<button
											className="   text-gray-400 hover:text-red-600"
											onClick={() => setIsEditing(false)}>
											<FaRegTimesCircle size={15} />
										</button>
									</div>
								</div>
							) : (
								<div className="border border-gray-700 p-4 rounded-lg bg-gray-900 flex flex-row justify-between items-center">
									<p className="text-sm  text-gray-300 text-wrap">
										Your review: {userReview.review_text}
									</p>
									<div className="space-x-3  flex">
										<button
											aria-label="Edit Review"
											className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
											onClick={() => {
												setIsEditing(true);
												setReviewText(userReview.review_text);
											}}>
											<FaEdit size={15} />
										</button>

										<button
											aria-label="Delete Review"
											className="text-gray-400 hover:text-red-600 transition-colors duration-200"
											onClick={deleteReview}>
											<FaTrashAlt size={15} />
										</button>
									</div>
								</div>
							)
						) : (
							<div className="relative pr-4 flex bg-gray-700 text-white rounded-lg border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300">
								<input
									className="scroll-hidden w-full text-sm p-4 bg-transparent focus:outline-none"
									placeholder="Write your review..."
									value={reviewText}
									onChange={(e) => setReviewText(e.target.value)}
								/>
								<button className="   text-gray-400 hover:text-green-600" onClick={addReview}>
									<FaSave size={15} />
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PokemonCard;
