import { useEffect } from 'react';

export function useSeo({ title, description, image }: { title?: string; description?: string; image?: string }) {
  useEffect(() => {
    document.title = title ? `${title} | Genç Hayat` : 'Genç Hayat';

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (title) setMeta('og:title', `${title} | Genç Hayat`);
    if (description) setMeta('og:description', description);
    if (image) setMeta('og:image', image);
  }, [title, description, image]);
}
