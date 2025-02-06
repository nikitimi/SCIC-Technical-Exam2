import { useEffect, useState } from "react";
import useFetchUserClient from "../useFetchUserClient";
import { createClient } from "@/utils/supabase/client";
import useStorage from "@/hooks/useStorage";

type ReviewProfile = {
	first_name: string;
	last_name: string;
	username: string;
}
export type Review = {
	id: string;
    review_text: string;
    photo_url: string;
    photo_path: string;
    photo_name: string;
    user_id: string;
    created_at: number;
    profiles: ReviewProfile[];
}

export default function useReviews() {
	const { uploadPhoto, deletePhoto } = useStorage();
	const supabase = createClient();
	const [reviews, setReviews] = useState<Review[]>([]);
	const [sortBy, setSortBy] = useState("created_at");
	const { user } = useFetchUserClient();
	const [loading, setLoading] = useState(true);

	const updateReview = async (reviewId:string, newImage:File|null, newReviewText:string) => {
		if (!user) return
		if (!newImage) return
		const photoData = await uploadPhoto("food-reviews", newImage, user.id)
		if (!photoData) return
		const { photoPath, publicUrl, photoName } = photoData
		const { error } = await supabase
			.from("reviews")
			.update({
				review_text: newReviewText,
				photo_url: publicUrl,
				photo_path: photoPath,
				photo_name: photoName,
			})
			.eq("id", reviewId);
		if (error) {
			console.error("Error updating review:", error);
		}
		setReviews((prevReviews) =>
			prevReviews.map((review) =>
				review.id === reviewId
					? {
							...review,
							review_text: newReviewText || review.review_text,
							photo_url: publicUrl || review.photo_url,
							photo_path: photoPath || review.photo_path,
							photo_name: photoName || review.photo_path,
					  }
					: review
			)
		);
	};

	const fetchReviews = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("reviews").select(`
			id,
			review_text, 
			photo_url,
			photo_path,
			photo_name, 
			user_id,
			created_at,
			profiles(first_name, last_name, username)
		`);

		if (error) {
			console.error("Error fetching reviews:", error);
			return;
		}
		sortReviews(data);
		setLoading(false);
	};

	const sortReviews = (data:Review[]) => {
		if (!data) return;

		const sorted = [...data];

		if (sortBy === "photo_name") {
			sorted.sort((a, b) => {
				return a.photo_name.localeCompare(b.photo_name);
			});
		} else if (sortBy === "created_at") {
			sorted.sort((a, b) => {
				const time = b.created_at - a.created_at
				return new Date(time).getTime()
			});
		}

		setReviews(sorted);
	};

	const addReview = async (reviewText:string, reviewPhoto:File|null) => {
		if (!user) return;
		if (!reviewPhoto) return;

		const result = await uploadPhoto("food-reviews", reviewPhoto, user.id);
		if (!result) return

		const { data: insertedData, error: insertError } = await supabase.from("reviews").insert([
			{
				user_id: user.id,
				photo_url: result.publicUrl,
				review_text: reviewText,
				photo_path: result.photoPath,
				photo_name: result.photoName,
			},
		]).select(`
			id,
			review_text, 
			photo_url,
			photo_path,
			photo_name, 
			user_id,
			created_at,
			profiles(first_name, last_name, username)
		`);

		if (insertError) {
			console.error("Error inserting review:", insertError);
			return;
		}

		alert("Review submitted");

		setReviews((prevState) => [insertedData[0] as Review, ...prevState]);
	};

	const deleteReview = async (reviewId:string, photoPath:string) => {
		const { error: delReview } = await supabase.from("reviews").delete().eq("id", reviewId);

		if (delReview) {
			console.error("Error deleting the review:", delReview);
			return;
		}

		await deletePhoto("food-reviews", photoPath);

		setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
	};

	useEffect(() => {
		fetchReviews();
	}, []); //eslint-disable-line
	useEffect(() => {
		sortReviews([...reviews]);
	}, [sortBy]);//eslint-disable-line

	return {
		reviews,
		loading,
		sortBy,
		addReview,
		deleteReview,
		fetchReviews,
		updateReview,
		sortReviews,
		setSortBy,
	};
}
