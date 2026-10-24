import {
    BUSINESS_EMAIL,
    BUSINESS_PHONE_NUMBERS,
    BUSINESS_WEBSITE,
} from "./business";

export const SITE_URL = BUSINESS_WEBSITE.replace(/\/$/, "");
export const SITE_NAME = "Jamal Rafeeq Auto Parts Trading LLC";
export const SITE_LOGO_URL = `${SITE_URL}/tab-logo.png`;

export const FAQ_ITEMS = [
    {
        question: "What does Jamal Rafeeq Auto Parts Trading LLC supply?",
        answer: "Jamal Rafeeq sources, imports, and exports dependable automotive spare parts, accessories, and vehicle solutions for customers, importers, distributors, and market partners.",
    },
    {
        question: "Which markets does Jamal Rafeeq serve?",
        answer: "The business serves customers in Dubai and the UAE, GCC markets including Oman, Qatar, Bahrain, and Saudi Arabia, and partners across Africa and other international markets.",
    },
    {
        question: "How can I enquire about a product?",
        answer: "Open a product in the catalogue and use the Enquire on WhatsApp button to send the product details directly to the business.",
    },
    {
        question: "Where is Jamal Rafeeq Auto Parts Trading LLC located?",
        answer: "The business is located at Bin Thani Building, Shop No: 21, Deira, Dubai, United Arab Emirates.",
    },
];

export function getAbsoluteSiteUrl(path = "/") {
    const value = String(path || "/");
    if (/^https?:\/\//i.test(value)) return value;
    const normalizedPath = value === "/" ? "/" : `/${value.replace(/^\/+/, "").replace(/\/+$/, "")}`;
    return `${SITE_URL}${normalizedPath}`;
}

function getBrandName(product) {
    return typeof product?.brand === "object" ? product.brand?.name : product?.brand || product?.brand_name;
}

function compactObject(value) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== ""));
}

export function getProductStructuredData(product, { url, imageUrl, price, inStock } = {}) {
    const brandName = getBrandName(product);
    const numericPrice = Number(price);
    const properties = [
        product?.vehicle && { "@type": "PropertyValue", name: "Vehicle", value: product.vehicle },
        product?.vehicle_year && { "@type": "PropertyValue", name: "Manufacturing year", value: product.vehicle_year },
    ].filter(Boolean);

    return compactObject({
        "@type": "Product",
        "@id": `${url}#product`,
        name: product?.name,
        url,
        description: String(product?.description || "").trim() || undefined,
        image: imageUrl ? [imageUrl] : undefined,
        category: "Automotive spare parts",
        brand: brandName ? { "@type": "Brand", name: brandName } : undefined,
        additionalProperty: properties.length ? properties : undefined,
        offers: Number.isFinite(numericPrice) && numericPrice >= 0 ? compactObject({
            "@type": "Offer",
            url,
            priceCurrency: "AED",
            price: numericPrice.toFixed(2),
            availability: inStock ? "https://schema.org/InStock" : undefined,
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${SITE_URL}/#business` },
        }) : undefined,
    });
}

export const SITE_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "AutoPartsStore",
            "@id": `${SITE_URL}/#business`,
            name: SITE_NAME,
            url: SITE_URL,
            logo: SITE_LOGO_URL,
            image: SITE_LOGO_URL,
            telephone: BUSINESS_PHONE_NUMBERS[0]?.display,
            email: BUSINESS_EMAIL,
            priceRange: "AED",
            address: {
                "@type": "PostalAddress",
                streetAddress: "Bin Thani Building, Shop No: 21, Deira",
                addressLocality: "Dubai",
                addressCountry: "AE",
            },
            areaServed: ["United Arab Emirates", "Oman", "Qatar", "Bahrain", "Saudi Arabia", "Africa"],
            openingHoursSpecification: [
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "20:00" },
                { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "18:00" },
            ],
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            publisher: { "@id": `${SITE_URL}/#business` },
            potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/find-products?product={search_term_string}`,
                "query-input": "required name=search_term_string",
            },
        },
        {
            "@type": "ContactPage",
            "@id": `${SITE_URL}/contact#contact-page`,
            url: `${SITE_URL}/contact`,
            name: "Contact Jamal Rafeeq Auto Parts Trading LLC",
            about: { "@id": `${SITE_URL}/#business` },
        },
    ],
};

