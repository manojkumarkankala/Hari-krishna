import { type ReactNode, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';

export function PublicLayout({ children }: { children: ReactNode }) {
  const { seo, settings } = usePortfolio();

  useEffect(() => {
    if (seo?.meta_title) {
      document.title = seo.meta_title;
    } else if (settings?.website_title) {
      document.title = settings.website_title;
    }

    const setMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (seo?.meta_description) setMetaTag('description', seo.meta_description);
    if (seo?.keywords) setMetaTag('keywords', seo.keywords);
    if (seo?.og_title) setMetaTag('og:title', seo.og_title, 'property');
    if (seo?.og_description) setMetaTag('og:description', seo.og_description, 'property');
    if (seo?.og_image) setMetaTag('og:image', seo.og_image, 'property');
    if (seo?.twitter_card) setMetaTag('twitter:card', seo.twitter_card);
    if (seo?.canonical_url) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', seo.canonical_url);
    }
    if (seo?.robots) setMetaTag('robots', seo.robots);

    // JSON-LD structured data
    if (seo?.json_ld && Object.keys(seo.json_ld).length > 0) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(seo.json_ld);
    }
  }, [seo, settings]);

  return <>{children}</>;
}
