import "./globals.css";
import MainLayout, { type Children } from "@/components/Layout";
export const metadata = {
	title: "Multiple Activities App",
	description: "SCIC Technical Exam",
};

export default function RootLayout({ children }:Children) {
	return (
		<html lang="en">
			<body>
				<MainLayout>{children}</MainLayout>
			</body>
		</html>
	);
}
