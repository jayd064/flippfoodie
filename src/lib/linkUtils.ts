// Universal Revenue Engine - Amazon Affiliate Link Utility
// Associate Tag: giftos-21

const AMAZON_TAG = "giftos-21";

/**
 * Get a monetized Amazon affiliate link
 * Priority 1: Manual URL (existing affiliate links)
 * Priority 2: Admin override URL (custom pasted links)
 * Priority 3: Auto-generated Amazon search URL with tag
 */
export const getAffiliateLink = (
  productName: string,
  manualUrl?: string,
  adminOverrideUrl?: string
): string => {
  // Priority 1: Admin override takes precedence (for upgrading popular searches)
  if (adminOverrideUrl) {
    return ensureTagged(adminOverrideUrl);
  }
  
  // Priority 2: Manual URL from GlobalStore
  if (manualUrl) {
    return ensureTagged(manualUrl);
  }
  
  // Priority 3: Auto-generate Amazon search URL
  return generateSearchUrl(productName);
};

/**
 * Ensure the Amazon tag is appended to any URL
 */
const ensureTagged = (url: string): string => {
  // If it's a short link (amzn.to), return as-is (already has tag baked in)
  if (url.includes("amzn.to/")) {
    return url;
  }
  
  // For full Amazon URLs, add tag if not present
  if (url.includes("amazon.in") || url.includes("amazon.com")) {
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has("tag")) {
      urlObj.searchParams.set("tag", AMAZON_TAG);
    }
    return urlObj.toString();
  }
  
  return url;
};

/**
 * Generate an Amazon search URL with affiliate tag
 */
export const generateSearchUrl = (productName: string): string => {
  const encodedName = encodeURIComponent(productName);
  return `https://www.amazon.in/s?k=${encodedName}&tag=${AMAZON_TAG}`;
};

/**
 * Amazon Associate Disclaimer Text
 */
export const AMAZON_DISCLAIMER = "As an Amazon Associate, I earn from qualifying purchases.";
