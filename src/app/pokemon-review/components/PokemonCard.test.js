import { render, screen } from "@testing-library/react";
import PokemonCard from "./PokemonCard";

test("does not show the review input box if user already has a review", () => {
	const userReview = { review_text: "Great Pokémon!" };

	render(
		<PokemonCard
			pokemon={{ name: "pikachu", id: 25 }}
			onClose={jest.fn()}
			userReview={userReview} // Mock user has a review
			reviews={[]} // Empty reviews list
			addReview={jest.fn()}
			reviewText=""
			setReviewText={jest.fn()}
			deleteReview={jest.fn()}
			editReview={jest.fn()}
			typeColors={{ electric: "yellow" }}
		/>
	);

	// Ensure the existing review is displayed
	expect(screen.getByText(/your review: Great Pokémon!/i)).toBeInTheDocument();

	// Ensure edit and delete buttons are visible
	expect(screen.getByLabelText("Edit Review")).toBeInTheDocument();
	expect(screen.getByLabelText("Delete Review")).toBeInTheDocument();

	// Ensure the review input box does not exist
	expect(screen.queryByPlaceholderText(/write your review/i)).toBeNull();
});

const mockPokemon = {
	name: "pikachu",
	id: 25,
	types: [{ slot: 1, type: { name: "electric" } }],
};

test("displays the correct Pokémon types", async () => {
	render(<PokemonCard pokemon={mockPokemon} onClose={jest.fn()} typeColors={{ electric: "#F8D030" }} />);

	// Debug: Log the full rendered output
	screen.debug();

	// Look for "electric" in the document
	const typeBadge = await screen.findByText(/electric/i);
	expect(typeBadge).toBeInTheDocument();
});
