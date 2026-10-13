import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import PageMetadata from "./seo/PageMetadata";
import SiteMap from "./components/SiteMap";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import About from './components/About';
import People from './components/People';
import Projects from './components/Projects';
import { NewsProvider } from "./NewsContext";
// import News from './components/News';
import Talks from "./components/Talks";
import Publications from './components/Publications';
import Resources from './components/Resources';
import Index from "./components/People/index";
import GoogleSheetNews from "./components/GoogleSheetNews";
import NewsArticle from "./components/News/NewsArticle";
import AdminOHDSISeminars from "./components/AdminOHDSISeminars";

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

// New calendar components
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AdminCalendar from "./components/AdminCalendar";
import PublicCalendar from "./components/PublicCalendar";

import BlogEditor from "./components/BlogEditor";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PublicBlogPage from "./components/PublicBlogPage";
import BlogPostView from "./components/BlogPostView";

// Import OHDSI Ireland components
import OHDSIIreland from "./components/OHDSIIreland";
import SeminarSeries from "./components/SeminarSeries";

// Import Forum components
import AllIslandForum from "./components/AllIslandForum";
import AdminForum from "./components/AdminForum";

// Import News Admin component
import AdminNews from "./components/AdminNews";

// Import Firebase News components (new)
import FirebaseNews from "./components/FirebaseNews";
import FirebaseNewsArticle from "./components/FirebaseNewsArticle";
import MigrateNews from "./components/MigrateNews";

import './App.css'; 

// Error redirect handler component to prevent navigation to not-found people
const ErrorRedirectHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Check if we're on a person detail page
    if (location.pathname.startsWith('/people/') && location.pathname !== '/people') {
      const slug = location.pathname.split('/').pop();
      
      // Check if this slug is in our "not found" list in sessionStorage
      const notFoundSlugs = JSON.parse(sessionStorage.getItem('notFoundSlugs') || '[]');
      
      if (notFoundSlugs.includes(slug)) {
        console.log(`Found ${slug} in not-found list, redirecting to /people`);
        navigate('/people', { replace: true });
      }
    }
  }, [location, navigate]);
  
  return children;
};

// Wrapper for the app with the router
const LegacyNewsRedirect = () => {
  const { pathname, search, hash } = useLocation();
  return <Navigate replace to={`${pathname.replace(/^\/news-new/, '/news')}${search}${hash}`} />;
};

const AppWithRouter = () => {
  return (
    <Router basename="/">
      <ScrollToTop />
      <PageMetadata />
      <ErrorRedirectHandler>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sitemap" element={<SiteMap />} />
              <Route path="/about" element={<About />} />
              <Route path="/people" element={<People />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/news" element={<FirebaseNews />} />
              <Route path="/news-archive" element={<GoogleSheetNews />} />
              <Route path="/news/:slug" element={<FirebaseNewsArticle />} />
              <Route path="/news-archive/:slug" element={<NewsArticle />} />
              <Route path="/people/:slug" element={<Index />} />
              <Route path="/news-archive/gender-inequality-study" element={<GenderInequalityStudy />} />
              <Route path="/news-archive/good-friday-cancer-legacy" element={<GoodFridayCancerLegacy />} />
              <Route path="/news-archive/phd-opportunity" element={<PhDOpportunity />} />
              <Route path="/news-archive/belfast-agreement-showcase" element={<BelfastAgreement25 />} />
              <Route path="/news-archive/ldcrc-building-together" element={<LDCRCBuildingTogether />} />
              <Route path="/news-archive/dell-technologies-presentation" element={<DellTechnologiesPresentation />} />
              <Route path="/news-archive/aicri-launch" element={<AICRILaunch />} />
              <Route path="/news-archive/ohdsi-meeting" element={<OHDSIMeeting />} />
              <Route path="/news-archive/hrb-conference" element={<HRBConference />} />
              <Route path="/news-archive/bcni-talk" element={<BCNITalk />} />
              <Route path="/news-archive/rte-brainstorm" element={<RTEBrainstorm />} />
              <Route path="/news-archive/postdoctoral-application" element={<Postdoc />} />
              <Route path="/news-archive/limerick-post" element={<LimerickPost />} />
              <Route path="/output/talks" element={<Talks />} />
              <Route path="/output/publications" element={<Publications />} />
              <Route path="/resources" element={<Resources />} />

              {/* OHDSI Ireland Routes */}
              <Route path="/ohdsi-ireland" element={<OHDSIIreland />} />
              <Route path="/ohdsi-ireland/seminars" element={<SeminarSeries />} />
              
              {/* Blog routes */}
              <Route path="/blog-editor" element={<PrivateRoute><BlogEditor /></PrivateRoute>} />
              <Route path="/blog-editor/:id" element={<PrivateRoute><BlogEditor /></PrivateRoute>} />
              <Route path="/blog-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />     
              <Route path="/blog-admin" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
              <Route path="/blog" element={<PublicBlogPage />} />
              <Route path="/blog/:id" element={<BlogPostView />} />

              {/* OHDSI Admin Route */}
              <Route 
                path="/admin/ohdsi-seminars" 
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminOHDSISeminars />
                  </PrivateRoute>
                } 
              />
              
              {/* Calendar routes */}
              <Route path="/calendar" element={<PublicCalendar />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin/calendar" 
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminCalendar />
                  </PrivateRoute>
                } 
              />
              
              {/* Forum routes */}
              <Route path="/forum" element={<AllIslandForum />} />
              <Route path="/all-island-forum" element={<AllIslandForum />} />
              <Route
                path="/admin/forum"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminForum />
                  </PrivateRoute>
                }
              />

              {/* News Admin route */}
              <Route
                path="/admin/news"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminNews />
                  </PrivateRoute>
                }
              />

              {/* Firebase News routes (new - for testing) */}
              <Route path="/news-new/*" element={<LegacyNewsRedirect />} />

              {/* News Migration Tool (one-time use) */}
              <Route
                path="/admin/migrate-news"
                element={
                  <PrivateRoute requiredRole="admin">
                    <MigrateNews />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorRedirectHandler>
    </Router>
  );
};

// Main App component
function App() {
  return (
    <GlobalDataProvider>
      <NewsProvider> 
        <AppWithRouter />
      </NewsProvider>
    </GlobalDataProvider>
  );
}

export default App;