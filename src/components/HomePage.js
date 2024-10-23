import React from "react";
import HomeSlider from "./HomeSlider";
import CollaboratorsSection from './CollaboratorsSection';
import FundingSection from "./FundingSection";
import HeroSection from "./HeroSection";
import DigitalInitiatives from "./DigitalInitiatives";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
        <HomeSlider />
        <HeroSection/>
        <CollaboratorsSection/>
        <FundingSection/>
        <DigitalInitiatives/>
    </div>
  );
}

export default HomePage;