"use client";
import SearchBar from "./components/SearchBar";
import usePokemon from "@/hooks/pokemon-review/usePokemon";
import PokemonCard from "./components/PokemonCard";
import ReviewEntry from "./components/ReviewEntry";
import Sorter from "./components/Sorter";

export default function PokemonReviewPage() {
	const {
		selectedPokemon,
		setSelectedPokemon,
		reviews,
		addReview,
		userReview,
		pokemonData,
		reviewText,
		setReviewText,
		deleteReview,
		editReview,
		typeColors,
		allPokemonReviews,
		setSortBy,
		sortBy,
	} = usePokemon();
	const defaultUserReview =  {review_id: '',review_text: '',user_id: ''}
	return (
		<div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center p-6">
			{selectedPokemon && (
				<PokemonCard
					pokemon={pokemonData!}
					onClose={() => {
						setSelectedPokemon(null);
						setReviewText("");
					}}
					reviews={reviews}
					addReview={addReview}
					userReview={userReview ?? defaultUserReview}
					reviewText={reviewText}
					setReviewText={setReviewText}
					deleteReview={deleteReview}
					editReview={editReview}
					typeColors={typeColors}
				/>
			)}

			<div className="w-full max-w-2xl mt-6">
				<SearchBar setSelectedPokemon={() => setSelectedPokemon} />
			</div>

			<div className="w-full max-w-6xl mt-6">
				<div className=" items-center flex justify-between">
					<h2 className="text-xl font-semibold text-gray-200 mb-4 ">Pokémon List</h2>
					<Sorter setSortBy={setSortBy} sortBy={sortBy} />
				</div>

				<div className="grid grid-cols-4 gap-6">
					{allPokemonReviews.map((pokemon) => (
						<ReviewEntry
							pokemon={pokemon}
							key={pokemon.pokemon_id}
							setSelectedPokemon={() => setSelectedPokemon}
							userReview={userReview ?? defaultUserReview}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
