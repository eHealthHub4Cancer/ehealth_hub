import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Home,
  Mail,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { biographyHtml } from "./biographyHtml";
import { useGlobalData } from "../globaldatacontext";
import Loader from "../loader";
import "./Profile.css";
import ExpandableList from "./ExpandableList";
import ResearchOutputs from "./ResearchOutputs";
import PersonPortrait from "./PersonPortrait";

import { getLinkIcon } from "./socialIcons";
import { prerenderedHtml, PrerenderedContent } from "../../seo/prerendered";

const qualificationParts = (text) => {
  const match = String(text).match(/^(.+?)(?:\s[-–—]\s|,\s+)(.+)$/);
  return match ? [match[1], match[2]] : [text];
};

const Index = () => {
  const { slug } = useParams();
  const {
    people,
    personInformation,
    personLoading,
    error,
    fetchPersonInformation,
    resetPersonInformation,
  } = useGlobalData();

  useEffect(() => {
    if (slug) {
      fetchPersonInformation(slug);
    }
  }, [slug, fetchPersonInformation]);

  useEffect(() => {
    return () => {
      if (resetPersonInformation) {
        resetPersonInformation();
      }
    };
  }, [resetPersonInformation]);

  // Until the profile arrives, or if it can't be fetched, show its pre-rendered bio (when this page was opened directly).
  const prerendered = prerenderedHtml();
  if (prerendered && (error || personLoading || !personInformation)) return <PrerenderedContent html={prerendered} />;

  // Use personLoading instead of general loading
  if (personLoading) return <Loader dataName="person" />;
  if (error) return <p>Error: {error}</p>;

  const fullName = personInformation?.full_name || "Profile Not Found";
  const image = personInformation?.image || people?.find(person => person.slug === slug)?.image;


  return (
    <div className="profile-container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>{fullName}</span>
      </nav>

      {!personInformation ? (
        <p>No data available for this person.</p>
      ) : (
        <>
          <div className="profile-hero">
            <div className="person-profile-layout">
              <PersonPortrait key={slug} profile person={{ full_name: fullName, image }} />
              <div className="person-profile-details">
                <h1>{fullName}</h1>
                {personInformation.role_badge && (
                  <div className="role-badges">
                    {personInformation.role_badge.map((badge, index) => (
                      <span
                        key={index}
                        className={`role-badge ${badge
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                {personInformation.institution && (
                  <div className="institution-info">
                    <h2>Institution</h2>
                    <p>{personInformation.institution}</p>
                  </div>
                )}
                <div className="contact-actions">
                  {personInformation.homepage_url && (
                    <a
                      href={personInformation.homepage_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button homepage"
                    >
                      <Home size={20} />
                      <span>Homepage</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {personInformation.email && (
                    <a
                      href={`mailto:${personInformation.email.replace(/^(?:mailto:|https?:\/\/)/i, "")}`}
                      className="action-button email"
                    >
                      <Mail size={20} />
                      <span>Email</span>
                    </a>
                  )}
                </div>

            {(personInformation.social_links || []).some(link => /^https?:\/\//i.test(link.url)) && (
              <div className="profile-header-links" key={slug}>
                <ExpandableList as="div" className="profile-links-grid" label="profile links" limit={14} mobileLimit={8}>
                  {personInformation.social_links.filter(link => /^https?:\/\//i.test(link.url)).map((link, index) => {
                    const Icon = getLinkIcon(link.name, link.icon);
                    return (
                      <a key={`${link.url}-${index}`} href={link.url} target="_blank" rel="noopener noreferrer" className="profile-link-card">
                        <span className="profile-link-icon"><Icon size={22} aria-hidden="true" /></span>
                        <span>{link.name || "Research profile"}</span>
                        <ExternalLink size={16} aria-hidden="true" />
                      </a>
                    );
                  })}
                </ExpandableList>
              </div>
            )}              </div>
            </div>
          </div>
          <div className="profile-sections" key={slug}>
            <section className="content-section about-section">
              <div className="person-section-heading">
                <h2>About</h2>
              </div>
              <div className="section-content">
                {personInformation.about_user ? (
                  <div
                    className="bio-paragraph"
                    dangerouslySetInnerHTML={{
                      __html: biographyHtml(personInformation.about_user),
                    }}
                  />
                ) : (
                  <p>No additional information available.</p>
                )}
              </div>
              <div className="person-about-details">
              {personInformation.areas_of_expertise &&
                personInformation.areas_of_expertise.length > 0 && (
                  <div className="expertise-section">
                    <h3>Areas of Expertise</h3>
                    <ExpandableList as="ul" className="expertise-list" label="areas of expertise" limit={14} mobileLimit={8}>
                      {personInformation.areas_of_expertise.map((item, index) => (
                        <li key={index} className="expertise-item">
                          {item}
                        </li>
                      ))}
                    </ExpandableList>
                  </div>
                )}
              {personInformation.research_areas &&
                personInformation.research_areas.length > 0 && (
                  <div className="research-areas-section">
                    <h3>Key Research Areas</h3>
                    <ExpandableList as="div" className="research-areas-grid" label="research areas" limit={7} mobileLimit={5}>
                      {personInformation.research_areas.map((area, index) => (
                        <div key={index} className="research-area-card">
                          <h4>{area.name || area.title}</h4>
                          <p>{area.description}</p>
                        </div>
                      ))}
                    </ExpandableList>
                  </div>
                )}
              {personInformation.key_initiatives &&
                personInformation.key_initiatives.length > 0 && (
                  <div className="key-initiatives">
                    <h3>Key Initiatives</h3>
                    <ExpandableList className="initiatives-grid" label="key initiatives" limit={7} mobileLimit={5}>
                      {personInformation.key_initiatives.map((initiative, index) => (
                        <a
                          key={index}
                          href={initiative.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="initiative-card"
                        >
                          <span className="initiative-title">
                            {initiative.name || initiative.title}
                          </span>
                          <ExternalLink size={16} />
                        </a>
                      ))}
                    </ExpandableList>
                  </div>
                )}
              <div className="credentials-section">
                {personInformation.qualifications &&
                  personInformation.qualifications.length > 0 && (
                    <div className="qualifications">
                      <h3 className="profile-list-heading"><GraduationCap size={20} aria-hidden="true" />Qualifications</h3>
                      <ExpandableList as="ul" className="credentials-list" label="qualifications" limit={7} mobileLimit={5}>
                        {personInformation.qualifications.map((qual, index) => (
                          <li key={index} className="credential-item">
                            <span className="credential-title">{qualificationParts(qual)[0]}</span>
                            {qualificationParts(qual).length > 1 && <span className="credential-description">{qualificationParts(qual)[1]}</span>}
                          </li>
                        ))}
                      </ExpandableList>
                    </div>
                  )}
                {personInformation.memberships &&
                  personInformation.memberships.length > 0 && (
                    <div className="memberships">
                      <h3 className="profile-list-heading"><UsersRound size={20} aria-hidden="true" />Professional Memberships</h3>
                      <ExpandableList as="ul" className="credentials-list" label="professional memberships" limit={7} mobileLimit={5}>
                        {personInformation.memberships.map((membership, index) => (
                          <li key={index} className="credential-item">
                            {membership}
                          </li>
                        ))}
                      </ExpandableList>
                    </div>
                  )}
              </div>
              </div>
            </section>
            <ResearchOutputs links={personInformation.research_links || []} />
            {personInformation.research_interests &&
              personInformation.research_interests.length > 0 && (
                <section className="content-section interests-section">
                  <div className="person-section-heading">
                    <h2>Research Interests</h2>
                      </div>
                  <ExpandableList as="ul" className="interests-grid" label="research interests" limit={14} mobileLimit={8}>
                    {personInformation.research_interests.map((interest, index) => (
                      <li
                        key={index}
                        className="interest-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="interest-content">
                          <span className="interest-number">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                          <span className="interest-text">{interest}</span>
                        </div>
                      </li>
                    ))}
                  </ExpandableList>
                </section>
              )}
          </div>
          <div className="profile-footer">
            <Link to="/people" className="back-to-directory">
              ← Back to Directory
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;