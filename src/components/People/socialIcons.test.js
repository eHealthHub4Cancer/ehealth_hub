import { getLinkIcon, socialIcons } from './socialIcons';
import { Globe } from 'lucide-react';
import { SiGithub, SiLinkedin, SiGooglescholar, SiBluesky } from 'react-icons/si';

test('uses brand icons with normalized keys and platform name fallbacks', () => {
  expect(getLinkIcon('GitHub')).toBe(SiGithub);
  expect(getLinkIcon('LinkedIn', 'linkedin')).toBe(SiLinkedin);
  expect(getLinkIcon('Google Scholar', 'google-scholar')).toBe(SiGooglescholar);
  expect(getLinkIcon('Bluesky', 'unknown')).toBe(SiBluesky);
  expect(getLinkIcon('Unknown Network')).toBe(Globe);
});
test('all configured icon identifiers resolve to components', () => {
  for (const [key, icon] of Object.entries(socialIcons)) expect(getLinkIcon('', key)).toBe(icon);
});
