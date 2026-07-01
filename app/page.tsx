import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { CaseStudies } from "@/components/CaseStudies";
import { Team } from "@/components/Team";
import { WhyUs } from "@/components/WhyUs";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Services />
        <Process />
        <CaseStudies />
        <Team />
        <WhyUs />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
