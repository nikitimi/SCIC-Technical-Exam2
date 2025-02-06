"use client";
import Image from "next/image";
import { useState, useEffect, type SetStateAction } from "react";

type Pokemon = {
	name: string
	url: string
}
export type ParsedPokemon = (Pick<Pokemon, 'name'> & {id:number})
export type SearchBarProps = {
	setSelectedPokemon: (value: SetStateAction<Pokemon | null | string>) => void //TODO: Correct type.

}

const SearchBar = ({ setSelectedPokemon }:SearchBarProps) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<ParsedPokemon[]>([]);
	const [allPokemon, setAllPokemon] = useState<ParsedPokemon[]>([]);

	useEffect(() => {
		const fetchPokemon = async () => {
			const res = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1304");
			const data = await res.json()
			setAllPokemon(
				data.results.map((pokemon: Pokemon) => {
					const id = pokemon.url.split("/").filter(Boolean).pop();
					if (!id) {
						return {
							name: '',
							id: 2
						}
					}
					return {
						name: pokemon.name,
						id: parseInt(id, 10),
					};
				})
			);
		};
		fetchPokemon();
	}, []);

	useEffect(() => {
		if (query.trim() === "") {
			setResults([]);
			return;
		}
		const filtered = allPokemon.filter((pokemon) => pokemon.name.includes(query.toLowerCase())).slice(0, 10);
		setResults(filtered);
	}, [query, allPokemon]);

	const handleSelectPokemon = (name:string) => {
		setQuery("");
		setResults([]);
		setSelectedPokemon(name);
	};

	return (
		<div className="relative w-full">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search Pokémon..."
				className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			{results.length > 0 && (
				<ul className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg text-white">
					{results.map((pokemon:ParsedPokemon) => (
						<li
							key={pokemon.id}
							className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700"
							onClick={() => handleSelectPokemon(pokemon.name)}>
							<span>{pokemon.name}</span>
							<Image
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
								alt={pokemon.name}
								className="w-8 h-8"
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchBar;
