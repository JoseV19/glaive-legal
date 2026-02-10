"use client";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { UseCaseTicker } from "@/components/landing/UseCaseTicker";
import { Features } from "@/components/landing/Features";
import { AIDemo } from "@/components/landing/AIDemo";
import { Metrics } from "@/components/landing/Metrics";
import { Testimonials } from "@/components/landing/Testimonials";
import { SecurityBadges } from "@/components/landing/SecurityBadges";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div
      id="landing-scroll"
      className="bg-jack-base text-jack-silver h-screen overflow-y-auto overflow-x-hidden"
    >
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <UseCaseTicker />
        <section id="features">
          <Features />
        </section>
        <section id="demo">
          <AIDemo />
        </section>
        <section id="metrics">
          <Metrics />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <SecurityBadges />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
