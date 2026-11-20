/**
 * UI-only switches for content that has not been verified yet. The underlying data and config files
 * still hold placeholder values; the interface hides anything switched off here.
 * Flip a flag to true only after the real value has replaced the placeholder in the data.
 */
export const VERIFIED = {
  /** GitHub, Discord, LinkedIn, Instagram and X links in siteConfig.contact. */
  socialLinks: false,
  /** Contact email address. */
  contactEmail: false,
  /** Footer claims: open-source licence, status pill, CI pipeline badge, "officially recognized". */
  footerClaims: false,
  /** Project descriptions, leads and repository or demo URLs. */
  projectDetails: false,
  /** Homelab hardware claims such as the "6-node" rack. */
  homelab: false,
} as const;
