import { getProductUrl } from "../utils/productUrl";

const WHATSAPP_NUMBER = "971508736155";

export { WHATSAPP_NUMBER };
export const BUSINESS_PHONE_NUMBERS = [
    { display: "+971 50 873 6155", href: "tel:+971508736155" },
    { display: "+971 58 895 9179", href: "tel:+971588959179" },
];
export const BUSINESS_EMAIL = "jrautopartsdubai@gmail.com";
export const BUSINESS_WEBSITE = "https://www.jrautospareparts.com";
export const BUSINESS_ADDRESS = "Bin Thani Building, Shop No: 21, Deira, Dubai - UAE";
export const BUSINESS_MAP_URL = "https://maps.app.goo.gl/ykB7wKTTvLD5m7cU8?g_st=awb";
const BUSINESS_MAP_QUERY = "Jamal Rafeeq Auto Parts Trading LLC, Bin Thani Building, Shop Number 21, Deira, Dubai";
export const BUSINESS_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS_MAP_QUERY)}&output=embed`;

export function getWhatsappUrl(message) {
    if (!WHATSAPP_NUMBER) return "";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function getProductPrice(product, priceOverride) {
    return [
        priceOverride,
        product?.discounted_price,
        product?.current_price,
        product?.starting_price,
        product?.variants?.[0]?.discounted_price,
        product?.variants?.[0]?.price,
    ].find((value) => value !== null && value !== undefined && value !== "");
}

function formatWhatsappPrice(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? `AED ${numericValue.toFixed(2)}` : "Price on enquiry";
}

export function getProductWhatsappUrl(product, _productId, options = {}) {
    const brand = typeof product?.brand === "object" ? product.brand?.name : product?.brand;
    const productUrl = getProductUrl(product, _productId);
    const productLink = options.includeProductLink === false ? [] : [`Product link: ${productUrl}`];
    const message = [
        "Hello, I would like to enquire about this product.",
        "",
        `Product: ${product?.name || "Automotive product"}`,
        `Brand: ${brand || product?.brand_name || "Not specified"}`,
        `Vehicle: ${product?.vehicle || "Not specified"}`,
        `Manufacturing year: ${product?.vehicle_year || "Not specified"}`,
        `Price: ${formatWhatsappPrice(getProductPrice(product, options.price))}`,
        ...productLink,
        "",
        "Please confirm availability and pricing.",
    ].join("\n");
    return getWhatsappUrl(message);
}
