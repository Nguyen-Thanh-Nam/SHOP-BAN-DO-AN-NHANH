import { Afacad } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import "leaflet/dist/leaflet.css";

const afacad = Afacad({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-afacad",
});

export const metadata = {
    title: "Crispc",
    description: "Crispc App",
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi" className={afacad.className}>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
