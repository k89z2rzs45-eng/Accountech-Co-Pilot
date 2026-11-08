export const COUNTRY_TO_CURRENCY = {
  US: "USD",
  UK: "GBP",
  CA: "CAD",
  MM: "MMK", // Myanmar
  JP: "JPY",
  CN: "CNY",
  IN: "INR",
  SG: "SGD",
  TH: "THB",
  KR: "KRW",
  // Additional Asia coverage
  MY: "MYR",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",
  HK: "HKD",
  TW: "TWD",
  AE: "AED",
  BD: "BDT",
  PK: "PKR",
  LK: "LKR",
  NP: "NPR",
  KH: "KHR",
  LA: "LAK",
};

export function detectCountryFromBrowser() {
  try {
    const lang = navigator.language || (navigator.languages && navigator.languages[0]);
    if (lang && lang.includes("-")) {
      const parts = lang.split("-");
      return (parts[1] || "").toUpperCase();
    }
  } catch (error) {
    console.log("Could not detect country from browser:", error.message);
  }
  return null;
}

export function currencyForCountry(country) {
  if (!country) return null;
  return COUNTRY_TO_CURRENCY[country] || null;
}

export function detectDefaultCurrency({ userCountry, userPreferred }) {
  try {
    if (userPreferred) return userPreferred; // 1) explicit preference
    const fromProfile = currencyForCountry(userCountry); // 2) from profile country
    if (fromProfile) return fromProfile;
    const browserCountry = detectCountryFromBrowser(); // 3) browser locale
    const fromBrowser = currencyForCountry(browserCountry);
    if (fromBrowser) return fromBrowser;
    return "USD"; // 4) fallback
  } catch (error) {
    console.log("Error in currency detection:", error.message);
    return "USD"; // Safe fallback
  }
}