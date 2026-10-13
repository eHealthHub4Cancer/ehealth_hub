import React, { useState } from 'react';
import API_ENDPOINTS from '../api/config';

export const getInitials = (name = '') => {
  const parts = name.trim().replace(/^(?:(?:prof(?:essor)?|dr|mr|mrs|ms|miss)\.?\s+)+/i, '').split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export default function PersonPortrait({ person, profile = false }) {
  const [failedImage, setFailedImage] = useState(null);
  const name = person.full_name || person.full_title_name || '';
  let imageUrl = null;
  if (person.image) {
    try {
      const url = new URL(person.image, new URL(API_ENDPOINTS.PEOPLE).origin);
      const isSampleAvatar = /\/people_images\/samples\/sample-[^/]+\.png$/i.test(url.pathname);
      if (['http:', 'https:'].includes(url.protocol) && !isSampleAvatar) imageUrl = url.href;
    } catch { /* Invalid image paths use the same initials fallback. */ }
  }
  return (
    <div className={profile ? "person-profile-photo" : "card-image-container"}>
      {imageUrl && failedImage !== imageUrl ? (
        <img src={imageUrl} alt={name || 'Portrait'} className={profile ? "person-profile-image" : "card-image"} loading="lazy" onError={() => setFailedImage(imageUrl)} />
      ) : (
        <div className={profile ? "profile-photo-fallback" : "person-initials"} role="img" aria-label={name ? `Initials for ${name}` : 'Photo unavailable'}>
          <span aria-hidden="true">{getInitials(name)}</span>
        </div>
      )}
    </div>
  );
}
