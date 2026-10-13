import { Globe, Home, Mail, BookOpen, Fingerprint, GraduationCap, Github } from 'lucide-react';
import {
  SiAcademia, SiArxiv, SiBitbucket, SiBluesky, SiDiscord, SiDoi,
  SiElsevier, SiFacebook, SiFigshare, SiGithub, SiGitlab,
  SiGooglescholar, SiInstagram, SiKaggle, SiLinkedin, SiLoop,
  SiMastodon, SiMedium, SiMendeley, SiOpenaccess, SiOrcid, SiOsf,
  SiPublons, SiPubmed, SiReddit, SiResearchgate, SiScopus,
  SiSemanticscholar, SiStackoverflow, SiSubstack, SiTelegram,
  SiThreads, SiTiktok, SiVimeo, SiWhatsapp, SiX, SiYoutube, SiZotero, SiZenodo,
} from 'react-icons/si';

export const socialIcons = {
  github: SiGithub, linkedin: SiLinkedin, linkedln: SiLinkedin,
  twitter: SiX, x: SiX, orcid: SiOrcid, googlescholar: SiGooglescholar,
  scholar: SiGooglescholar, researchgate: SiResearchgate, pubmed: SiPubmed,
  scopus: SiScopus, academia: SiAcademia, academiaedu: SiAcademia,
  semanticscholar: SiSemanticscholar, publons: SiPublons, researcherid: SiPublons,
  mendeley: SiMendeley, zotero: SiZotero, figshare: SiFigshare,
  zenodo: SiZenodo, osf: SiOsf, openscienceframework: SiOsf,
  arxiv: SiArxiv, doi: SiDoi, openaccess: SiOpenaccess, elsevier: SiElsevier,
  loop: SiLoop, frontiersloop: SiLoop,
  facebook: SiFacebook, instagram: SiInstagram, youtube: SiYoutube,
  bluesky: SiBluesky, mastodon: SiMastodon, threads: SiThreads, tiktok: SiTiktok,
  medium: SiMedium, substack: SiSubstack, stackoverflow: SiStackoverflow,
  kaggle: SiKaggle, gitlab: SiGitlab, bitbucket: SiBitbucket,
  whatsapp: SiWhatsapp, telegram: SiTelegram, discord: SiDiscord,
  reddit: SiReddit, vimeo: SiVimeo,
  webofscience: BookOpen, bookopen: BookOpen, fingerprint: Fingerprint,
  graduationcap: GraduationCap, school: GraduationCap, code: Github,
  globe: Globe, language: Globe, website: Globe, personalwebsite: Globe,
  home: Home, homepage: Home, email: Mail, mail: Mail,
};

const normalize = value => String(value || '').toLowerCase().replace(/[\s_.-]/g, '');
export function getLinkIcon(name = '', icon = '') {
  return socialIcons[normalize(icon)] || socialIcons[normalize(name)] || Globe;
}
