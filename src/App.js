import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import About from './components/About';
import People from './components/People';
import Projects from './components/Projects';
import News from './components/News';
import Talks from "./components/Talks";
import Publications from './components/Publications';
import Shirin from "./components/People/Shirin";
import Aedin from "./components/People/Aedin";
import Mark from "./components/People/Mark";
import Ruth from "./components/People/Ruth";
import Katie from "./components/People/Katie";
import Ian from "./components/People/Ian";
import Nina from "./components/People/Nina";
import Simon from "./components/People/Simeon";
import Bill from "./components/People/Bill";
import GenderInequalityStudy from "./components/News/GenderInequalityStudy";
import GoodFridayCancerLegacy from "./components/News/GoodFridayCancerLegacy";
import PhDOpportunity from "./components/News/PhDOpportunity";
import BelfastAgreement25 from "./components/News/BelfastAgreement25";
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/people" element={<People />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/people/shirin" element={<Shirin />} />
            <Route path="/people/aedin" element={<Aedin />} />
            <Route path="/people/mark" element={<Mark />} />
            <Route path="/people/ruth" element={<Ruth />} />
            <Route path="/people/katie" element={<Katie />} />
            <Route path="/people/ian" element={<Ian />} />
            <Route path="/people/nina" element={<Nina />} />
            <Route path="/people/simon" element={<Simon />} />
            <Route path="/people/bill" element={<Bill />} />
            <Route path="/news" element={<News />} />
            <Route path="news/gender-inequality-study" element={<GenderInequalityStudy />} />
            <Route path="news/good-friday-cancer-legacy" element={<GoodFridayCancerLegacy />} />
            <Route path="news/phd-opportunity" element={<PhDOpportunity />} />
            <Route path="news/belfast-agreement-showcase" element={<BelfastAgreement25 />} />
            
            <Route path="/output/talks" element={<Talks />} />
            <Route path="/output/publications" element={<Publications />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;