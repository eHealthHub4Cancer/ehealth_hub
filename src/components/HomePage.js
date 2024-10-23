import React from "react";
import HomeSlider from "./HomeSlider";
import CollaboratorsSection from './CollaboratorsSection';
import FundingSection from "./FundingSection";
import HeroSection from "./HeroSection";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
        <HomeSlider />
        <HeroSection/>
        <CollaboratorsSection/>
        <FundingSection/>
    </div>
  );
}

export default HomePage;