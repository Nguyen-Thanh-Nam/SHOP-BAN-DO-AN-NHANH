import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/shared/SearchBar";
import ProductSection from "@/components/home/ProductSection";

export default function HomePage() {
    return (
        <main className="bg-white font-sans text-gray-800">
            <HeroSection />
            <SearchBar />
            <ProductSection />
        </main>
    );
}
