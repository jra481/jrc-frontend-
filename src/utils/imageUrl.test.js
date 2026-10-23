import { describe, expect, it } from "vitest";
import { getImageUrl } from "./imageUrl";

describe("getImageUrl", () => {
    it("normalizes absolute Django media URLs to the storefront media proxy", () => {
        expect(getImageUrl("https://13-50-221-204.sslip.io/media/products/brake-pad.png"))
            .toBe("/media/products/brake-pad.png");
    });

    it("keeps root-relative media URLs on the storefront origin", () => {
        expect(getImageUrl("/media/hero_banners/road-ahead.png"))
            .toBe("/media/hero_banners/road-ahead.png");
    });

    it("does not rewrite unrelated external images", () => {
        const imageUrl = "https://images.example.com/part.png";
        expect(getImageUrl(imageUrl)).toBe(imageUrl);
    });
});
