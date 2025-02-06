"use client";
import type { Review } from "../food-review/useReviews";
import type { Pokemon } from "@/app/pokemon-review/components/ReviewEntry";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import useFetchUserClient from "../useFetchUserClient";
import { PokemonCardProps } from "@/app/pokemon-review/components/PokemonCard";


export default function usePokemon() {
	const supabase = createClient();
	const { user } = useFetchUserClient();
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon|null|string>(null);
	const [pokemonData, setPokemonData] = useState<Pokemon|null>(null);
	const [reviews, setReviews] = useState<(Review & Pokemon)[]>([]);
	const [reviewText, setReviewText] = useState("");
	const [userReview, setUserReview] = useState<PokemonCardProps['userReview'] | null>(null);
	const [allPokemonReviews, setAllPokemonReviews] = useState<(Review & Pokemon)[]>([]);
	const [sortBy, setSortBy] = useState("name");

	useEffect(() => {
		if (!selectedPokemon) {
			setPokemonData(null);
			setReviews([]);
			setUserReview(null);
			return;
		}

		const fetchPokemonData = async () => {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
			const data = await res.json();
			console.log(data);
			setPokemonData(data);
		};

		fetchPokemonData();
	}, [selectedPokemon]);

	const fetchReviews = async () => {
		const { data, error } = await supabase
			.from("pokemon_with_reviews")
			.select("*")
			.eq("pokemon_id", pokemonData?.id);

		if (error) return console.error("Error fetching reviews:", error);

		const fetchedReviews = data?.[0]?.reviews || [];
		setReviews(fetchedReviews);

		setUserReview(fetchedReviews.find((review:Review) => review.user_id === user?.id));
	};

	const sortReviews = (data:(Review & Pokemon)[] | null) => {
		if (!data) return [];
		const sorted = [...data];

		if (sortBy === "name") {
			sorted.sort((a, b) => {
				return a.pokemon_name.localeCompare(b.pokemon_name);
			});
		} else if (sortBy === "latest") {
			sorted.sort((a, b) => {
				const time = b.pokemon_updated_at - a.pokemon_updated_at
				return new Date(time).getTime()
			});
		}
		return sorted;
	};

	const fetchAll = async () => {
		const { data, } = await supabase.from("pokemon_with_reviews").select("*");
		setAllPokemonReviews(sortReviews(data as typeof allPokemonReviews));
	};
	useEffect(() => {
		fetchAll();
	}, [sortBy]);//eslint-disable-line

	useEffect(() => {
		if (!pokemonData) return;

		fetchReviews();
	}, [pokemonData]);//eslint-disable-line

	const addReview = async () => {
		if (!reviewText) return;
		if (!pokemonData) return
		if (!user) return
		const { error: errorUpsert } = await supabase.from("pokemons").upsert([
			{
				id: pokemonData.id,
				name: pokemonData.name,
			},
		]);

		if (errorUpsert) return console.error("error updating or creating pokemon entry", errorUpsert);

		const { error } = await supabase
			.from("pokemon_reviews")
			.insert({
				review_text: reviewText,
				pokemon_id: pokemonData.id,
				user_id: user.id,
			})
			.select()
			.single();

		if (error) return console.error("error adding review", error);
		setReviewText("");
		await fetchReviews();
		await fetchAll();
	};

	const deleteReview = async () => {
		if (!pokemonData) return
		const { error: errorUpsert } = await supabase.from("pokemons").upsert([
			{
				id: pokemonData.id,
				name: pokemonData.name,
			},
		]);

		if (errorUpsert) return console.error("error updating or creating pokemon entry", errorUpsert);
		const { error } = await supabase.from("pokemon_reviews").delete().eq("review_id", userReview?.review_id);
		if (error) return console.error("error deleting review", error);
		setUserReview(null);
		setReviewText("");
		await fetchReviews();
		await fetchAll();
	};

	const editReview = async () => {
		if (!pokemonData) return
		if (!userReview) return
		const { } = await supabase.from("pokemons_with_reviews").upsert([
			{
				id: pokemonData.id,
				name: pokemonData.name,
			},
		]);

		const {  } = await supabase
			.from("pokemon_reviews")
			.update({
				review_text: reviewText,
			})
			.eq("review_id", userReview.review_id);
		await fetchReviews();
		await fetchAll();
	};

	const typeColors = {
		normal: "#A8A77A",
		fire: "#EE8130",
		water: "#6390F0",
		electric: "#F7D02C",
		grass: "#7AC74C",
		ice: "#96D9D6",
		fighting: "#C22E28",
		poison: "#A33EA1",
		ground: "#E2BF65",
		flying: "#A98FF3",
		psychic: "#F95587",
		bug: "#A6B91A",
		rock: "#B6A136",
		ghost: "#735797",
		dragon: "#6F35FC",
		dark: "#705746",
		steel: "#B7B7CE",
		fairy: "#D685AD",
	};

	return {
		selectedPokemon,
		setSelectedPokemon,
		reviews,
		pokemonData,
		userReview,
		addReview,
		reviewText,
		setReviewText,
		setUserReview,
		deleteReview,
		editReview,
		typeColors,
		allPokemonReviews,
		setSortBy,
		sortBy,
	};
}
