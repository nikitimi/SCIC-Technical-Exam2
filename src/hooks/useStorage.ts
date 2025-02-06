import { createClient } from "@/utils/supabase/client";

type FileBody =  
	| ArrayBuffer
	| ArrayBufferView
	| Blob
	| Buffer
	| File
	| FormData
	| NodeJS.ReadableStream
	| ReadableStream<Uint8Array>
	| URLSearchParams
	| string

export default function useStorage() {
	const supabase = createClient();

	const uploadPhoto = async (bucket:string, photo:FileBody, userId:string) => {
		const fileExtension = photo instanceof File ? photo.name.split(".").pop() : photo;
		const photoName = `${photo instanceof File  ? photo.name.split(".").slice(0, -1).join(".") : photo}_${Date.now()}.${fileExtension}`;

		const photoPath = `${userId}/${photoName}`;
		const { data: uploadedPhoto, error: uploadError } = await supabase.storage
			.from(bucket)
			.upload(photoPath, photo);
		if (uploadError) {
			console.error("Error uploading photo:", uploadError);
			return;
		}

		const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadedPhoto.path);
		// if (urlError) {
		// 	console.error("Error getting Url Data:", urlError);
		// }
		return {
			photoPath: uploadedPhoto.path,
			publicUrl: urlData.publicUrl,
			photoName,
		};
	};

	const deletePhoto = async (bucket:string, path:string) => {
		const { error } = await supabase.storage.from(bucket).remove([path]);
		if (error) {
			console.error("Error deleting image", error);
		}
	};

	return { uploadPhoto, deletePhoto };
}
