import { useEffect, useState } from 'react';

export type mediaTypes = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'unknown';

const useMedia = () => {
  const [mediaType, setMediaType] = useState<mediaTypes>('unknown');
  const QUERIES = [
    '(max-width: 640px)',
    '(min-width: 640px)',
    '(min-width: 1024px)',
    '(min-width: 1280px)',
    '(min-width: 1536px)',
  ];

  const mediaQueryList = QUERIES.map(query => window.matchMedia(query));
  const getValue = (): mediaTypes => {
    const index = mediaQueryList.findIndex(mql => mql.matches);
    switch (index) {
      case 0:
        return 'sm';
      case 1:
        return 'md';
      case 2:
        return 'lg';
      case 3:
        return 'xl';
      case 4:
        return '2xl';
      default:
        return 'unknown';
    }
  };
  useEffect(() => {
    const handler = () => setMediaType(getValue);
    mediaQueryList.forEach(mql => mql.addEventListener('change', handler));
    setMediaType(getValue);
    return () => {
      mediaQueryList.forEach(mql => mql.removeEventListener('change', handler));
    };
  }, []);
  return mediaType;
};

export default useMedia;
