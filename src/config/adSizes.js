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
  "Between Rows": {
    label: "Between Rows",
    ratio: "5:1",
    size: "2000 × 400 px",
    shown: "Home page, after every 2 product rows, as wide as the product rows (about 1000 × 200 on desktop, 375 × 75 on phones). Several ads take turns, one per gap",
  },
  Footer: {
    label: "Footer",
    ratio: "728:90 (≈ 8:1)",
    size: "1456 × 180 px",
    shown: "Home page, after the last product row: 728 × 90 on desktop, full width × 60 on phones",
  },
  hls: {
    label: "Home left sidebar",
    ratio: "1:4 (tall)",
    size: "360 × 1440 px",
    shown: "Home page, a tall strip beside the product rows (left or right), following the scroll: 160 × 640 (up to 180 × 720 on large screens). Only on screens 1280 px and wider",
  },
  hrs: {
    label: "Home right sidebar",
    ratio: "1:4 (tall)",
    size: "360 × 1440 px",
    shown: "Home page, a tall strip beside the product rows (left or right), following the scroll: 160 × 640 (up to 180 × 720 on large screens). Only on screens 1280 px and wider",
  },
  Profile: {
    label: "Profile",
    ratio: "1:1",
    size: "700 × 700 px",
    shown: "Customer, seller and supplier profile pages, under the profile card: about 320–350 px square on desktop, full width on phones. Several ads: a random one per visit",
  },
};
