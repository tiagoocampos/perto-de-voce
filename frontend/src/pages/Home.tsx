import { Hero } from "@/components/app/home/Hero";
import { InstallCard } from "@/components/pwa/InstallCard";
import { SecaoPanfletos } from "@/components/app/home/SecaoPanfletos";
import { SecaoVideos } from "@/components/app/home/SecaoVideos";
import { SecaoMateriais } from "@/components/app/home/SecaoMateriais";
import { SecaoDesafios } from "@/components/app/home/SecaoDesafios";

export function Home() {
    return (
        <>
            <Hero />
            <InstallCard />
            <SecaoPanfletos />
            <SecaoVideos />
            <SecaoMateriais />
            <SecaoDesafios />
        </>
    );
}
