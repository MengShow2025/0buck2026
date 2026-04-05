import React from 'react';

export const PLACEHOLDER_AVATARS = {
  user1: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
  user2: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara',
  user3: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  user4: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Talia',
  user5: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
};

export const PLACEHOLDER_PRODUCT = 'https://via.placeholder.com/400x400/FF5C28/FFFFFF?text=Product';

export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.target as HTMLImageElement;
  target.src = PLACEHOLDER_AVATARS.default;
  target.onerror = null;
}
