import { useEffect } from "react";

import {
    SITE_NAME,
    SITE_LOGO_URL,
    SITE_STRUCTURED_DATA,
    SITE_URL,
    getAbsoluteSiteUrl,
} from "../config/seo";

function setMeta(attribute, value, content) {
    let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

function setCanonical(url) {
    let element = document.head.querySelector('link[rel="canonical"]');
    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
    }
    element.setAttribute("href", url);
}

function setJsonLd(id, value) {
    let element = document.head.querySelector(`#${id}`);
    if (!element) {
        element = document.createElement("script");
        element.id = id;
        element.type = "application/ld+json";
        document.head.appendChild(element);
    }
    element.textContent = JSON.stringify(value);
}

function removeJsonLd(id) {
    document.head.querySelector(`#${id}`)?.remove();
}

export default function Seo({
    title,
    description,
    path = "/",
    image = SITE_LOGO_URL,
    type = "website",
    noindex = false,
    structuredData = [],
    faqItems = [],
}) {
    const canonicalUrl = getAbsoluteSiteUrl(path);
    const imageUrl = getAbsoluteSiteUrl(image);
    const serializedStructuredData = JSON.stringify(structuredData);
    const serializedFaqItems = JSON.stringify(faqItems);

    useEffect(() => {
        document.title = title;
        setCanonical(canonicalUrl);
        setMeta("name", "description", description);
        setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
        setMeta("name", "author", SITE_NAME);
        setMeta("property", "og:title", title);
        setMeta("property", "og:description", description);
        setMeta("property", "og:url", canonicalUrl);
        setMeta("property", "og:type", type);
        setMeta("property", "og:site_name", SITE_NAME);
        setMeta("property", "og:locale", "en_AE");
        setMeta("property", "og:image", imageUrl);
        setMeta("property", "og:image:alt", title);
        setMeta("name", "twitter:card", "summary_large_image");
        setMeta("name", "twitter:title", title);
        setMeta("name", "twitter:description", description);
        setMeta("name", "twitter:image", imageUrl);

        const webPage = {
            "@type": "WebPage",
            "@id": `${canonicalUrl}#webpage`,
            url: canonicalUrl,
            name: title,
            description,
            isPartOf: { "@id": `${SITE_URL}/#website` },
        };
        setJsonLd("seo-site-schema", SITE_STRUCTURED_DATA);
        setJsonLd("seo-page-schema", {
            "@context": "https://schema.org",
            "@graph": [webPage, ...JSON.parse(serializedStructuredData)],
        });

        const parsedFaqItems = JSON.parse(serializedFaqItems);
        if (parsedFaqItems.length) {
            setJsonLd("seo-faq-schema", {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: parsedFaqItems.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: { "@type": "Answer", text: item.answer },
                })),
            });
        } else {
            removeJsonLd("seo-faq-schema");
        }
    }, [canonicalUrl, description, imageUrl, noindex, serializedFaqItems, serializedStructuredData, title, type]);

    return null;
}
