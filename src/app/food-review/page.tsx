"use client";
import { useState } from "react";
import AddReviewButton from "./components/AddReviewButton";
import Modal from "./components/Modal";
import useReviews from "@/hooks/food-review/useReviews";
import ReviewCard from "./components/ReviewCard";
import useFetchUserClient from "@/hooks/useFetchUserClient";
import SortBy from "./components/SortBy";

export default function Page() {
  const {
    reviews,
    loading,
    addReview,
    deleteReview,
    updateReview,

    setSortBy,
  } = useReviews();
  const [showModal, setShowModal] = useState(false);
  const { user } = useFetchUserClient();

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="h-screen overflow-y-scroll w-full relative ">
      <div className=" sticky top-0 left-0 z-10 flex justify-between p-2">
        <AddReviewButton onClick={handleButtonClick} />
        <SortBy setSortBy={setSortBy} />
      </div>

      {showModal && <Modal onClose={handleCloseModal} addReview={addReview} />}

      <div className="mt-4 flex flex-col items-center">
        {loading && <p>Loading reviews...</p>}
        {!loading && reviews.length === 0 && (
          <p>No reviews found. Please add a review.</p>
        )}
        {!loading &&
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isCreator={review.user_id === user?.id}
              deleteReview={deleteReview}
              updateReview={updateReview}
            />
          ))}
      </div>
    </div>
  );
}
