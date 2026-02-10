"use client";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { UseCaseTicker } from "@/components/landing/UseCaseTicker";
import { Features } from "@/components/landing/Features";
import { AIDemo } from "@/components/landing/AIDemo";
import { Comparison } from "@/components/landing/Comparison";
import { Metrics } from "@/components/landing/Metrics";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { SecurityBadges } from "@/components/landing/SecurityBadges";
import { CTASection } from "@/components/landing/CTASection";
import { DemoForm } from "@/components/landing/DemoForm";
import { Footer } from "@/components/landing/Footer";
import { ScrollProgress } from "@/components/landing/ScrollProgress";

export default function LandingPage() {
  return (
    <div
      id="landing-scroll"
      className="bg-jack-base text-jack-silver h-screen overflow-y-auto overflow-x-hidden"
    >
      <ScrollProgress />
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
        <Comparison />
        <section id="metrics">
          <Metrics />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <FAQ />
        <SecurityBadges />
        <CTASection />
        <DemoForm />
      </main>
      <Footer />
    </div>
  );
}
