import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import About from './components/About';
import People from './components/People';
import Projects from './components/Projects';
// import News from './components/News';
import Talks from "./components/Talks";
import Publications from './components/Publications';
import Index from "./components/People/index";
import GoogleSheetNews from "./components/GoogleSheetNews";
import NewsArticle from "./components/News/NewsArticle";

import GenderInequalityStudy from "./components/News/GenderInequalityStudy";
import GoodFridayCancerLegacy from "./components/News/GoodFridayCancerLegacy";
import PhDOpportunity from "./components/News/PhDOpportunity";
import BelfastAgreement25 from "./components/News/BelfastAgreement25";
import LDCRCBuildingTogether from "./components/News/LDCRCBuildingTogether";
import DellTechnologiesPresentation from "./components/News/DellTechnologiesPresentation";
import HRBConference from "./components/News/HRBConference";
import OHDSIMeeting from "./components/News/OHDSIMeeting";
import AICRILaunch from "./components/News/AICRILaunch";
import BCNITalk from "./components/News/BCNITalk";
import RTEBrainstorm from "./components/News/RTEBrainstorm";
import LimerickPost from "./components/News/LimerickPost";
import Postdoc from "./components/News/Postdoc";
import ScrollToTop from "./components/ScrollToTop Component";
import { GlobalDataProvider } from "./components/globaldatacontext";

import './App.css'; 

function App() {
  return (
    <GlobalDataProvider>
    <Router basename="/">
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/people" element={<People />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/news" element={<GoogleSheetNews />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
            <Route path="/people/:slug" element={<Index />} />
            <Route path="/news/gender-inequality-study" element={<GenderInequalityStudy />} />
            <Route path="/news/good-friday-cancer-legacy" element={<GoodFridayCancerLegacy />} />
            <Route path="/news/phd-opportunity" element={<PhDOpportunity />} />
            <Route path="/news/belfast-agreement-showcase" element={<BelfastAgreement25 />} />
            <Route path="/news/ldcrc-building-together" element={<LDCRCBuildingTogether />} />
            <Route path="/news/dell-technologies-presentation" element={<DellTechnologiesPresentation />} />
            <Route path="/news/aicri-launch" element={<AICRILaunch />} />
            <Route path="/news/ohdsi-meeting" element={<OHDSIMeeting />} />
            <Route path="/news/hrb-conference" element={<HRBConference />} />
            <Route path="/news/bcni-talk" element={<BCNITalk />} />
            <Route path="/news/rte-brainstorm" element={<RTEBrainstorm />} />
            <Route path="/news/postdoctoral-application" element={<Postdoc />} />
            <Route path="/news/limerick-post" element={<LimerickPost />} />
            <Route path="/output/talks" element={<Talks />} />
            <Route path="/output/publications" element={<Publications />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </GlobalDataProvider>
  );
}

export default App;