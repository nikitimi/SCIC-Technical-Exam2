"use client";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";

export interface Bucket {
	id: string
	name: string
	owner: string
	file_size_limit?: number
	allowed_mime_types?: string[]
	created_at: string
	updated_at: string
	public: boolean
}

export interface FileObject {
	name: string
	bucket_id: string
	owner: string
	id: string
	updated_at: string
	created_at: string
	last_accessed_at: string
	metadata: Record<string, any> //eslint-disable-line
	buckets: Bucket
  }

export default function GDriveLite() {
	const supabase = createClient();
	const [photos, setPhotos] = useState<FileObject[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [userId, setUserId] = useState<null | string>(null);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("name");
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e:ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const selectedFile = e.target.files[0];
		if(!selectedFile) return

		if (!selectedFile.type.startsWith("image/")) {
			alert("Only image files are allowed!");
			e.target.value = "";
			return;
		}
		setFile(selectedFile);
	};
	const fetchUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) setUserId(user.id);
	};

	useEffect(() => {
		fetchUser();
	}, []); //eslint-disable-line

	useEffect(() => {
		if (userId) fetchPhotos();
	}, [userId]); //eslint-disable-line

	async function fetchPhotos() {
		if (!userId) return;
		const { data, error } = await supabase.storage.from("gdrive-lite").list(userId + "/");
		console.log(data);

		if (error) console.error("Error fetching photos", error);
		else setPhotos(data || []);
	}

	async function uploadPhoto() {
		if (!file || !userId) return;
		setUploading(true);
		const filePath = `${userId}/${Date.now()}_${file.name}`;
		const { error } = await supabase.storage.from("gdrive-lite").upload(filePath, file);
		setUploading(false);
		if (error) console.error("Upload error", error);
		else fetchPhotos();
		setFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	async function deletePhoto(photoName:string) {
		if (!userId) return;
		const { error } = await supabase.storage.from("gdrive-lite").remove([`${userId}/${photoName}`]);
		if (error) console.error("Delete error", error);
		else fetchPhotos();
	}

	const filteredPhotos = photos
		.filter((photo) => photo.name.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			const defaultStringNum = '0'
			if (sortBy === "name") return a.name.localeCompare(b.name);
			if (sortBy === "date") return parseInt(b.name.split("_")[0] ?? defaultStringNum) - parseInt(a.name.split("_")[0] ?? defaultStringNum);
			return 0;
		});

	return (
		<div className="min-h-screen w-full  bg-gray-900 text-white flex flex-col items-center p-6">
			<div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
				<h1 className="text-xl font-bold mb-4 text-center">GDrive Lite</h1>
				<input
					ref={fileInputRef}
					aria-label="upload"
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded-md"
				/>
				<button
					onClick={uploadPhoto}
					className={`p-2 mt-2 w-full rounded-md text-white transition-all ${
						uploading ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
					}`}
					disabled={uploading}>
					{uploading ? "Uploading..." : "Upload"}
				</button>
			</div>

			<div className="w-full max-w-4xl mt-4 flex gap-4">
				<input
					type="text"
					placeholder="Search by name"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="p-2 bg-gray-800 border border-gray-700 rounded-md w-full text-white"
				/>
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="p-2 bg-gray-800 border border-gray-700 rounded-md text-white">
					<option value="name">Sort by Name</option>
					<option value="date">Sort by Upload Date</option>
				</select>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full max-w-4xl">
				{filteredPhotos.map((photo) => (
					<div
						key={photo.name}
						className="relative border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-800">
						<Image
							src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gdrive-lite/${userId}/${photo.name}`}
							alt={photo.name}
							className="w-full h-48 object-cover"
						/>
						<button
							onClick={() => deletePhoto(photo.name)}
							className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
							<FaTimes size={15} />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
