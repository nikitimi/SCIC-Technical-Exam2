export const supabase = {
	auth: {
		getUser: jest.fn(() => Promise.resolve({ data: { user: { id: "123" } } })),
	},
	from: jest.fn(() => ({
		select: jest.fn(() => Promise.resolve({ data: [], error: null })),
	})),
};
