import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from './components/About';
import People from './components/People';
import Projects from './components/Projects';
import News from './components/News';
import Talks from "./components/Talks";
import Publications from './components/Publications';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/people" element={<People />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<News />} />
        <Route path="/output/talks" element={<Talks />} />
        <Route path="/output/publications" element={<Publications />} />
      </Routes>
    </Router>
  );
}

export default App;
