// Chapter content is NOT in this repo — cloned locally into public/system-design/
// (gitignored). See README "System Design Notes (local only)" for setup + license note.
export const systemDesignCategories = ["Fundamentals", "Case Studies"];

export const systemDesignChapters = [
  { id: 1, folder: "01. Scaling", title: "Scale From Zero To Millions Of Users", category: "Fundamentals" },
  { id: 2, folder: "02. Back Of the Envelope Estimation", title: "Back-of-the-envelope Estimation", category: "Fundamentals" },
  { id: 3, folder: "03. System Design Framework", title: "A Framework For System Design Interviews", category: "Fundamentals" },
  { id: 4, folder: "04. Rate Limiter", title: "Design A Rate Limiter", category: "Case Studies" },
  { id: 5, folder: "05. Consistent Hashing", title: "Design Consistent Hashing", category: "Case Studies" },
  { id: 6, folder: "06. Key-Value Store", title: "Design A Key-Value Store", category: "Case Studies" },
  { id: 7, folder: "07. Unique-Id Generator", title: "Design A Unique ID Generator In Distributed Systems", category: "Case Studies" },
  { id: 8, folder: "08. URL Shortener", title: "Design A URL Shortener", category: "Case Studies" },
  { id: 9, folder: "09. Web Crawler", title: "Design A Web Crawler", category: "Case Studies" },
  { id: 10, folder: "10. Notification System", title: "Design A Notification System", category: "Case Studies" },
  { id: 11, folder: "11. News Feed System", title: "Design A News Feed System", category: "Case Studies" },
  { id: 12, folder: "12. Chat System", title: "Design A Chat System", category: "Case Studies" },
  { id: 13, folder: "13. Search Autocomplete", title: "Design A Search Autocomplete System", category: "Case Studies" },
  { id: 14, folder: "14. Youtube", title: "Design YouTube", category: "Case Studies" },
  { id: 15, folder: "15. Google Drive", title: "Design Google Drive", category: "Case Studies" },
  { id: 16, folder: "16. Proximity Service", title: "Proximity Service", category: "Case Studies" },
  { id: 17, folder: "17. Nearby Friends", title: "Nearby Friends", category: "Case Studies" },
  { id: 18, folder: "18. Google Maps", title: "Design Google Maps", category: "Case Studies" },
  { id: 19, folder: "19. Distributed Message Queue", title: "Distributed Message Queue", category: "Case Studies" },
  { id: 20, folder: "20. Metrics Monitoring and Alerting System", title: "Metrics Monitoring and Alerting System", category: "Case Studies" },
  { id: 21, folder: "21. Ad Click Event Aggregation", title: "Ad Click Event Aggregation", category: "Case Studies" },
  { id: 22, folder: "22. Hotel Reservation System", title: "Hotel Reservation System", category: "Case Studies" },
  { id: 23, folder: "23. Distributed Email Service", title: "Distributed Email Service", category: "Case Studies" },
  { id: 24, folder: "24. S3-like Object Storage", title: "S3-like Object Storage", category: "Case Studies" },
  { id: 25, folder: "25. Real-time Gaming Leaderboard", title: "Real-time Gaming Leaderboard", category: "Case Studies" },
  { id: 26, folder: "26. Payment System", title: "Payment System", category: "Case Studies" },
  { id: 27, folder: "27. Digital Wallet", title: "Digital Wallet", category: "Case Studies" },
  { id: 28, folder: "28. Stock Exchange", title: "Stock Exchange", category: "Case Studies" },
];

const BASE_URL = "/system-design";

// Upstream repo mixes "Readme.md" / "README.md" casing across chapters.
export function chapterMdUrls(chapter) {
  const dir = `${BASE_URL}/${encodeURIComponent(chapter.folder)}`;
  return [`${dir}/Readme.md`, `${dir}/README.md`];
}

export function chapterImageBaseUrl(chapter) {
  return `${BASE_URL}/${encodeURIComponent(chapter.folder)}/`;
}
