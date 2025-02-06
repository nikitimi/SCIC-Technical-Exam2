import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import SearchBar from "./SearchBar";

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () =>
			Promise.resolve({
				results: [
					{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
					{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
				],
			}),
	})
);

test("displays filtered results based on search query", async () => {
	render(<SearchBar setSelectedPokemon={jest.fn()} />);

	// Wrap the state update inside `act()`
	await act(async () => {
		// Trigger a state update by simulating typing into the input field
		const inputElement = screen.getByPlaceholderText(/search pokémon/i);
		fireEvent.change(inputElement, { target: { value: "pi" } });
	});

	// Wait for the filtered results to appear
	const pikachuElement = await screen.findByText("pikachu");
	expect(pikachuElement).toBeInTheDocument();

	// Ensure "bulbasaur" is not in the list after the filter
	expect(screen.queryByText("bulbasaur")).toBeNull();
});

test("calls setSelectedPokemon and clears query when a Pokémon is selected", async () => {
	const setSelectedPokemonMock = jest.fn();
	render(<SearchBar setSelectedPokemon={setSelectedPokemonMock} />);

	// Simulate typing into the search input
	const inputElement = screen.getByPlaceholderText(/search pokémon/i);
	fireEvent.change(inputElement, { target: { value: "pikachu" } });

	// Wait for the results to appear
	const pikachuElement = await screen.findByText("pikachu");
	expect(pikachuElement).toBeInTheDocument();

	// Click on Pikachu
	fireEvent.click(pikachuElement);

	// Expect `setSelectedPokemon` to have been called with "pikachu"
	expect(setSelectedPokemonMock).toHaveBeenCalledWith("pikachu");

	// Check if the input field is cleared
	expect(inputElement.value).toBe("");

	// Ensure the results list is cleared
	await waitFor(() => expect(screen.queryByText("pikachu")).toBeNull());
});
