import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "../useUser";

export type Note = {
	id: string
	content: string
}

export default function useMarkdown() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [selectedNote, setSelectedNote] = useState<{id: string} | null>(null);
	const [content, setContent] = useState("");
	const supabase = createClient();
	const { user } = useUser();

	const fetchNotes = async () => {
		if (!user) return
		const { data, error } = await supabase.from("notes").select().eq("user_id", user.id);
		if (error) return console.error("Error fetching notes", error);
		setNotes(data ?? []);
	};
	
	const addNote = async () => {
		if (!user) return
		if (selectedNote) return updateNote();
		const { error } = await supabase.from("notes").insert({ content, user_id: user.id });
		if (error) return console.error("Error adding note", error);
		setContent("");
		await fetchNotes();
	};

	const updateNote = async () => {
		if (!selectedNote) return
		const { error } = await supabase.from("notes").update({ content }).eq("id", selectedNote.id);
		if (error) return console.error("Error updating note", error);
		setContent("");
		setSelectedNote(null);
		await fetchNotes();
	};

	const deleteNote = async (id:string) => {
		const { error } = await supabase.from("notes").delete().eq("id", id);
		if (error) return console.error("Error deleting note", error);
		fetchNotes();
	};

	useEffect(() => {
		if (user) fetchNotes();
	}, [user]);//eslint-disable-line

	return { notes, fetchNotes, selectedNote, setSelectedNote, addNote, deleteNote, content, setContent };
}
