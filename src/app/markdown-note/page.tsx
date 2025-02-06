"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import useMarkdown from "@/hooks/markdown-note/useMarkdown";
import { FaTrash } from "react-icons/fa";

export default function MarkdownNotes() {
	const [showPreview, setShowPreview] = useState(false);
	const { notes, content, setSelectedNote, addNote, deleteNote, setContent } = useMarkdown();

	return (
		<div className="flex w-full h-screen">
			<div className="w-[30%] p-2 overflow-auto h-full">
				<h2 className="text-lg font-bold">Notes</h2>
				<ul>
					{notes.map((note) => (
						<li key={note.id} className="flex justify-between p-2 border-b">
							<button
								onClick={() => {
									setSelectedNote(note);
									setContent(note.content?? '');
								}}>
								{note.content.substring(0, 20)}...
							</button>
							<button onClick={() => deleteNote(note.id)} className=" text-gray-400 hover:text-red-500">
								<FaTrash size={15} />
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="flex-1 p-5  flex flex-col h-full">
				{showPreview ? (
					<div className="w-full flex-1 p-2  bg-gray-800 rounded-md">
						<ReactMarkdown>{content}</ReactMarkdown>
					</div>
				) : (
					<textarea
						className="w-full flex-1 p-2 bg-gray-600 text-white border rounded resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Write in Markdown..."></textarea>
				)}

				<div className="mt-2 flex space-x-4">
					<button
						className="p-2 hover:bg-blue-800 text-white flex-grow border rounded-md border-blue-900 "
						onClick={addNote}>
						Save Note
					</button>
					<button
						className="p-2 hover:bg-blue-500 text-white flex-grow border rounded-md border-blue-900"
						onClick={() => setShowPreview(!showPreview)}>
						Preview
					</button>
				</div>
			</div>
		</div>
	);
}
