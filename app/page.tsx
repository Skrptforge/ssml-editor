import { Feature } from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import { HeroText } from "@/components/landing/hero-text";
import { LandingNavbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import React from "react";

const Home = () => {
  return (
    <div className="relative w-full">
      <LandingNavbar />
      <BackgroundRippleEffect />
      <HeroText />
      <Feature />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Home;
