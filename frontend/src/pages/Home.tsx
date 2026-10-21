import { Hero } from "@/components/app/home/Hero";
import { SecaoPanfletos } from "@/components/app/home/SecaoPanfletos";
import { SecaoVideos } from "@/components/app/home/SecaoVideos";
import { SecaoMateriais } from "@/components/app/home/SecaoMateriais";
import { SecaoDesafios } from "@/components/app/home/SecaoDesafios";

export function Home() {
    return (
        <>
            <Hero />
            <SecaoPanfletos />
            <SecaoVideos />
            <SecaoMateriais />
            <SecaoDesafios />
        </>
    );
}
