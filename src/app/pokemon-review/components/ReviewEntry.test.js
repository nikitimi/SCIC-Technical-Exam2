import { render, screen } from "@testing-library/react";
import ReviewEntry from "./ReviewEntry";
import useFetchUserClient from "@/hooks/useFetchUserClient";

jest.mock("@/hooks/useFetchUserClient");

describe("ReviewEntry", () => {
	it("shows 'REVIEWED' if the user has reviewed the Pokémon", () => {
		useFetchUserClient.mockReturnValue({ user: { id: "user123" } });

		const pokemon = {
			pokemon_id: 25,
			pokemon_name: "Pikachu",
			reviews: [{ user_id: "user123" }],
			pokemon_updated_at: "2024-02-05T12:34:56Z",
		};

		render(<ReviewEntry pokemon={pokemon} setSelectedPokemon={() => {}} />);

		expect(screen.getByText("REVIEWED")).toBeInTheDocument();
	});

	it("does not show 'REVIEWED' if the user has not reviewed the Pokémon", () => {
		useFetchUserClient.mockReturnValue({ user: { id: "user123" } });

		const pokemon = {
			pokemon_id: 25,
			pokemon_name: "Pikachu",
			reviews: [{ user_id: "another_user" }],
			pokemon_updated_at: "2024-02-05T12:34:56Z",
		};

		render(<ReviewEntry pokemon={pokemon} setSelectedPokemon={() => {}} />);

		expect(screen.queryByText("REVIEWED")).not.toBeInTheDocument();
	});
});
