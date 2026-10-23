import { API_URL } from "../lib/apiUrl";

const sameOriginMediaPath = (imagePath) => {
    const value = String(imagePath || "");
    if (!value) return null;

    try {
        const baseOrigin = typeof window === "undefined" ? "http://localhost" : window.location.origin;
        const parsed = new URL(value, baseOrigin);
        if (parsed.pathname.startsWith("/media/")) {
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
    } catch {
        // Leave malformed or non-media URLs unchanged for the caller.
    }

    return null;
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const mediaPath = sameOriginMediaPath(imagePath);
    if (mediaPath) return mediaPath;

    if (/^(https?:)?\/\//i.test(imagePath)) {
        return imagePath;
    }

    // Django serves uploaded media from /media/, outside the /api/ prefix.
    // Keep root-relative media URLs at the site root so uploaded videos and
    // brand logos do not incorrectly become /api/media/... URLs.
    if (String(imagePath).startsWith("/")) {
        if (API_URL.startsWith("/")) return imagePath;
        return `${new URL(API_URL).origin}${imagePath}`;
    }

    return `${API_URL.replace(/\/$/, "")}/${String(imagePath).replace(/^\//, "")}`;
};
