const fallbackSlug = (id) => `product-${id ?? "item"}`;

export function slugifyProductName(name, id) {
    const slug = String(name || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || fallbackSlug(id);
}

export function getProductPath(product, productId = product?.id ?? product?.pk) {
    return `/single/${slugifyProductName(product?.name, productId)}/${productId}`;
}

export function getProductUrl(product, productId = product?.id ?? product?.pk) {
    const path = getProductPath(product, productId);
    return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}
