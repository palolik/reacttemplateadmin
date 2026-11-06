// Image sizes for each ad placement, taken from how the storefront draws them
// (reacttemplate/src/pages/home/Ads/Ads.jsx). Ads are shown with object-contain,
// so an image in a different ratio is not cropped but gets blank bars around it.
// Keep in sync with docs/advertisement-guide.md in the backend repo.
export const AD_SIZES = {
  Popup: {
    label: "Popup",
    ratio: "1:1",
    size: "1080 × 1080 px",
    shown: "Pops up over the home page, up to 384 × 384",
  },
  "Homepage Banner": {
    label: "Homepage Banner",
    ratio: "16:5 (3.2:1)",
    size: "1920 × 600 px",
    shown: "Home page, under the combos: full width × 400 px on desktop, × 200 px on phones",
  },
  Header: {
    label: "Header",
    ratio: "728:90 (≈ 8:1)",
    size: "1456 × 180 px",
    shown: "Home page, under the hero banner: 728 × 90 on desktop, full width × 60 on phones",
  },
  Footer: {
    label: "Footer",
    ratio: "728:90 (≈ 8:1)",
    size: "1456 × 180 px",
    shown: "Home page, after the last product row: 728 × 90 on desktop, full width × 60 on phones",
  },
  hls: {
    label: "Home left sidebar",
    ratio: "6:5",
    size: "600 × 500 px",
    shown: "Home page, after the second product row (left and right side by side): 300 × 250",
  },
  hrs: {
    label: "Home right sidebar",
    ratio: "6:5",
    size: "600 × 500 px",
    shown: "Home page, after the second product row (left and right side by side): 300 × 250",
  },
};
