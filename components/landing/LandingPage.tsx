"use client";

import { useState } from "react";
import LandingHero from "./LandingHero";
import LandingScreenshots from "./LandingScreenshots";
import LandingFeatures from "./LandingFeatures";
import LandingHowToInstall from "./LandingHowToInstall";
import LandingFAQ from "./LandingFAQ";
import LandingFooter from "./LandingFooter";
import LoginModal from "../LoginModal";

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <LandingHero onGetStarted={() => setIsLoginOpen(true)} />
      <LandingScreenshots />
      <LandingFeatures />
      <LandingHowToInstall />
      <LandingFAQ />
      <LandingFooter />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}