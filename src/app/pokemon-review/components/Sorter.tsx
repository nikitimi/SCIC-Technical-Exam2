"use client";

import {type ChangeEvent } from "react";

type SorterProps = {
	setSortBy: (sortBy: string) => void
	sortBy: string
}

export default function Sorter({ setSortBy, sortBy }:SorterProps) {
	const handleSortChange = (e:ChangeEvent<HTMLSelectElement>) => {
		setSortBy(e.target.value);
	};

	return (
		<div className="mb-4 flex items-center space-x-2">
			<label className="text-gray-300 text-sm">Sort by:</label>
			<select
				value={sortBy}
				onChange={handleSortChange}
				className="bg-gray-700 text-white py-1 px-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
				<option value="latest">Latest</option>
				<option value="name">Name</option>
			</select>
		</div>
	);
}
