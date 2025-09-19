export interface StyleOption {
  id: string;
  name: string;
  description: string;
  prompt: string;
  referenceImage: string;
  category: 'artistic' | 'photography' | 'modern' | 'vintage';
  type: 'traditional' | 'trending';
}

export const TRADITIONAL_STYLES: StyleOption[] = [
  // Traditional Artistic Styles
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description: 'Classic oil painting with rich textures and brush strokes',
    prompt: 'Transform into a classic oil painting style with visible brush strokes, rich colors, and artistic texture',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f4f4f5\"/%3E%3Cpath d=\"M10 12c2.5 0 5 2.5 5 5v6c0 2.5-2.5 5-5 5s-5-2.5-5-5v-6c0-2.5 2.5-5 5-5z\" fill=\"%238b5cf6\"/%3E%3Cpath d=\"M30 10c2.5 0 5 2.5 5 5v10c0 2.5-2.5 5-5 5s-5-2.5-5-5V15c0-2.5 2.5-5 5-5z\" fill=\"%23f87171\"/%3E%3C/svg%3E',
    category: 'artistic',
    type: 'traditional'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft watercolor painting with flowing colors',
    prompt: 'Convert to watercolor painting style with soft edges, flowing colors, and artistic paint bleeds',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f4f4f5\"/%3E%3Ccircle cx=\"15\" cy=\"15\" r=\"8\" fill=\"%236366f1\" opacity=\"0.7\"/%3E%3Ccircle cx=\"25\" cy=\"20\" r=\"6\" fill=\"%23f472b6\" opacity=\"0.6\"/%3E%3Ccircle cx=\"20\" cy=\"28\" r=\"5\" fill=\"%2306b6d4\" opacity=\"0.8\"/%3E%3C/svg%3E',
    category: 'artistic',
    type: 'traditional'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Fun cartoon style with bold colors and outlines',
    prompt: 'Transform into cartoon style with bold outlines, vibrant colors, and simplified features',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f4f4f5\"/%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"12\" fill=\"%23fbbf24\" stroke=\"%23374151\" stroke-width=\"2\"/%3E%3Ccircle cx=\"16\" cy=\"17\" r=\"2\" fill=\"%23374151\"/%3E%3Ccircle cx=\"24\" cy=\"17\" r=\"2\" fill=\"%23374151\"/%3E%3Cpath d=\"M14 24c2 2 4 2 6 0s4 0 6 0\" stroke=\"%23374151\" stroke-width=\"2\" stroke-linecap=\"round\"/%3E%3C/svg%3E',
    category: 'artistic',
    type: 'traditional'
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese anime art style with large eyes and detailed features',
    prompt: 'Convert to anime art style with large expressive eyes, detailed hair, and smooth shading',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f4f4f5\"/%3E%3Ccircle cx=\"20\" cy=\"22\" r=\"12\" fill=\"%23fde68a\"/%3E%3Cellipse cx=\"17\" cy=\"19\" rx=\"3\" ry=\"4\" fill=\"%23374151\"/%3E%3Cellipse cx=\"23\" cy=\"19\" rx=\"3\" ry=\"4\" fill=\"%23374151\"/%3E%3Ccircle cx=\"17\" cy=\"18\" r=\"1\" fill=\"%23ffffff\"/%3E%3Ccircle cx=\"23\" cy=\"18\" r=\"1\" fill=\"%23ffffff\"/%3E%3Cpath d=\"M12 12c4-2 8-2 12 0s8 2 12 0\" stroke=\"%23f59e0b\" stroke-width=\"2\" stroke-linecap=\"round\"/%3E%3C/svg%3E',
    category: 'artistic',
    type: 'traditional'
  },
  {
    id: 'professional-portrait',
    name: 'Professional Portrait',
    description: 'Clean professional headshot style',
    prompt: 'Enhance as a professional portrait with perfect lighting, sharp focus, and clean background',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f4f4f5\"/%3E%3Ccircle cx=\"20\" cy=\"18\" r=\"8\" fill=\"%2306b6d4\"/%3E%3Crect x=\"12\" y=\"26\" width=\"16\" height=\"8\" rx=\"2\" fill=\"%23374151\"/%3E%3C/svg%3E',
    category: 'photography',
    type: 'traditional'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Movie-like dramatic lighting and color grading',
    prompt: 'Apply cinematic style with dramatic lighting, film grain, and movie-like color grading',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23111827\"/%3E%3Crect x=\"6\" y=\"12\" width=\"28\" height=\"16\" rx=\"2\" fill=\"%238b5cf6\"/%3E%3Crect x=\"4\" y=\"10\" width=\"4\" height=\"4\" rx=\"1\" fill=\"%23f59e0b\"/%3E%3Crect x=\"32\" y=\"10\" width=\"4\" height=\"4\" rx=\"1\" fill=\"%23f59e0b\"/%3E%3C/svg%3E',
    category: 'photography',
    type: 'traditional'
  },
  {
    id: 'black-white',
    name: 'Black & White',
    description: 'Classic monochrome with high contrast',
    prompt: 'Convert to black and white with high contrast, dramatic shadows, and classic film aesthetic',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f4f4f5\"/%3E%3Cpath d=\"M20 8l12 12-12 12L8 20 20 8z\" fill=\"%23ffffff\" stroke=\"%23000000\" stroke-width=\"2\"/%3E%3Cpath d=\"M20 20l12 12-12 0V20z\" fill=\"%23000000\"/%3E%3C/svg%3E',
    category: 'photography',
    type: 'traditional'
  },
  {
    id: 'retro-80s',
    name: 'Retro 80s',
    description: 'Nostalgic 80s aesthetic with vibrant colors',
    prompt: 'Apply retro 80s style with vibrant neon colors, vintage film grain, and nostalgic aesthetic',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23374151\"/%3E%3Cpath d=\"M8 16h24v8H8z\" fill=\"%23ff00ff\"/%3E%3Cpath d=\"M8 24h24v8H8z\" fill=\"%2300ffff\"/%3E%3Cpath d=\"M8 8h24v8H8z\" fill=\"%23ffff00\"/%3E%3C/svg%3E',
    category: 'vintage',
    type: 'traditional'
  },
  {
    id: 'vintage-film',
    name: 'Vintage Film',
    description: 'Old film photography with warm tones',
    prompt: 'Transform to vintage film style with warm tones, film grain, and classic photography aesthetic',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23451a03\"/%3E%3Crect x=\"8\" y=\"8\" width=\"24\" height=\"24\" rx=\"4\" fill=\"%23d97706\"/%3E%3Ccircle cx=\"14\" cy=\"14\" r=\"2\" fill=\"%23451a03\"/%3E%3Ccircle cx=\"26\" cy=\"14\" r=\"2\" fill=\"%23451a03\"/%3E%3Ccircle cx=\"14\" cy=\"26\" r=\"2\" fill=\"%23451a03\"/%3E%3Ccircle cx=\"26\" cy=\"26\" r=\"2\" fill=\"%23451a03\"/%3E%3C/svg%3E',
    category: 'vintage',
    type: 'traditional'
  },
  {
    id: 'sepia',
    name: 'Sepia Tone',
    description: 'Classic sepia photography from early 1900s',
    prompt: 'Convert to sepia tone with vintage brown coloring and classic early photography aesthetic',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23292524\"/%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"10\" fill=\"%23a3a3a3\"/%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"6\" fill=\"%23a16207\"/%3E%3C/svg%3E',
    category: 'vintage',
    type: 'traditional'
  }
];

export const TRENDING_STYLES: StyleOption[] = [
  {
    id: 'studio-ghibli',
    name: 'Studio Ghibli',
    description: 'Magical Ghibli-style animation with soft colors and whimsical details',
    prompt: 'Transform into Studio Ghibli animation style with soft watercolor backgrounds, magical atmosphere, and whimsical character design',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23dcfce7\"/%3E%3Cpath d=\"M20 8c-6 0-12 6-12 12s6 12 12 12 12-6 12-12S26 8 20 8z\" fill=\"%2365a30d\"/%3E%3Cpath d=\"M15 15l5-3 5 3-5 8-5-8z\" fill=\"%23fbbf24\"/%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"3\" fill=\"%23ffffff\"/%3E%3C/svg%3E',
    category: 'artistic',
    type: 'trending'
  },
  {
    id: '3d-figurine',
    name: '3D Figurine',
    description: 'High-end collectible 3D figurine on computer desk with custom packaging',
    prompt: 'Transform into a 3D figurine sitting on a computer desk with transparent base, computer screen showing 3D modeling process, and custom packaging designed like high-end collectibles',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f3f4f6\"/%3E%3Crect x=\"6\" y=\"25\" width=\"28\" height=\"8\" rx=\"2\" fill=\"%236b7280\"/%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"6\" fill=\"%233b82f6\"/%3E%3Crect x=\"14\" y=\"14\" width=\"12\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"%233b82f6\" stroke-width=\"1\" opacity=\"0.5\"/%3E%3Crect x=\"8\" y=\"8\" width=\"6\" height=\"8\" rx=\"1\" fill=\"%23ef4444\"/%3E%3C/svg%3E',
    category: 'modern',
    type: 'trending'
  },
  {
    id: 'instagram-aesthetic',
    name: 'Instagram Aesthetic',
    description: 'Trendy social media style with perfect filters',
    prompt: 'Apply Instagram aesthetic with warm filters, soft lighting, and social media-ready styling',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23fef3c7\"/%3E%3Crect x=\"8\" y=\"8\" width=\"24\" height=\"24\" rx=\"6\" fill=\"%23ffffff\" stroke=\"%23f59e0b\" stroke-width=\"2\"/%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"6\" fill=\"%23f59e0b\"/%3E%3Ccircle cx=\"26\" cy=\"14\" r=\"2\" fill=\"%23f59e0b\"/%3E%3C/svg%3E',
    category: 'photography',
    type: 'trending'
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Futuristic cyberpunk with neon colors',
    prompt: 'Transform into cyberpunk style with neon colors, futuristic elements, and digital effects',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23000000\"/%3E%3Crect x=\"10\" y=\"10\" width=\"20\" height=\"20\" rx=\"2\" fill=\"none\" stroke=\"%2300ffff\" stroke-width=\"2\"/%3E%3Cpath d=\"M15 15h10M15 20h10M15 25h10\" stroke=\"%23ff00ff\" stroke-width=\"1\"/%3E%3C/svg%3E',
    category: 'modern',
    type: 'trending'
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Iridescent holographic effect with rainbow colors',
    prompt: 'Apply holographic effect with iridescent rainbow colors, prismatic light reflections, and futuristic glow',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23111827\"/%3E%3Cpath d=\"M10 10h20v20H10z\" fill=\"url(%23rainbow)\"/%3E%3Cdefs%3E%3ClinearGradient id=\"rainbow\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"%3E%3Cstop offset=\"0%25\" stop-color=\"%23ff0000\"/%3E%3Cstop offset=\"16.66%25\" stop-color=\"%23ff8800\"/%3E%3Cstop offset=\"33.33%25\" stop-color=\"%23ffff00\"/%3E%3Cstop offset=\"50%25\" stop-color=\"%2300ff00\"/%3E%3Cstop offset=\"66.66%25\" stop-color=\"%2300ffff\"/%3E%3Cstop offset=\"83.33%25\" stop-color=\"%230088ff\"/%3E%3Cstop offset=\"100%25\" stop-color=\"%23ff00ff\"/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E',
    category: 'modern',
    type: 'trending'
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: 'Retro-futuristic aesthetic with pink and cyan colors',
    prompt: 'Apply vaporwave aesthetic with retro-futuristic elements, pink and cyan color palette, and nostalgic digital art style',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23281847\"/%3E%3Cpath d=\"M5 35L20 15L35 35z\" fill=\"%23ff00ff\" opacity=\"0.8\"/%3E%3Cpath d=\"M0 30h40M0 32h40M0 34h40\" stroke=\"%2300ffff\" stroke-width=\"1\"/%3E%3Ccircle cx=\"20\" cy=\"10\" r=\"6\" fill=\"%23ff00ff\" opacity=\"0.6\"/%3E%3C/svg%3E',
    category: 'modern',
    type: 'trending'
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    description: 'Retro 8-bit pixel art style',
    prompt: 'Transform into pixel art style with 8-bit aesthetic, blocky pixels, and retro gaming colors',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23000000\"/%3E%3Crect x=\"8\" y=\"8\" width=\"4\" height=\"4\" fill=\"%2300ff00\"/%3E%3Crect x=\"12\" y=\"8\" width=\"4\" height=\"4\" fill=\"%23ff0000\"/%3E%3Crect x=\"16\" y=\"8\" width=\"4\" height=\"4\" fill=\"%230000ff\"/%3E%3Crect x=\"20\" y=\"8\" width=\"4\" height=\"4\" fill=\"%23ffff00\"/%3E%3Crect x=\"8\" y=\"12\" width=\"4\" height=\"4\" fill=\"%23ff00ff\"/%3E%3Crect x=\"12\" y=\"12\" width=\"4\" height=\"4\" fill=\"%2300ffff\"/%3E%3C/svg%3E',
    category: 'artistic',
    type: 'trending'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Modern glass effect with transparency and blur',
    prompt: 'Apply glassmorphism style with transparent glass effects, frosted blur, and modern UI aesthetic',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f1f5f9\"/%3E%3Crect x=\"8\" y=\"8\" width=\"24\" height=\"24\" rx=\"6\" fill=\"%23ffffff\" fill-opacity=\"0.3\" stroke=\"%23ffffff\" stroke-opacity=\"0.5\"/%3E%3Crect x=\"12\" y=\"12\" width=\"16\" height=\"16\" rx=\"4\" fill=\"%236366f1\" fill-opacity=\"0.1\"/%3E%3C/svg%3E',
    category: 'modern',
    type: 'trending'
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Instant camera aesthetic with white borders',
    prompt: 'Apply Polaroid instant camera style with white borders, slightly faded colors, and vintage instant photo aesthetic',
    referenceImage: 'data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"40\" height=\"40\" rx=\"8\" fill=\"%23f3f4f6\"/%3E%3Crect x=\"6\" y=\"6\" width=\"28\" height=\"28\" rx=\"2\" fill=\"%23ffffff\"/%3E%3Crect x=\"8\" y=\"8\" width=\"24\" height=\"18\" fill=\"%2393c5fd\"/%3E%3Crect x=\"8\" y=\"26\" width=\"24\" height=\"6\" fill=\"%23ffffff\"/%3E%3C/svg%3E',
    category: 'vintage',
    type: 'trending'
  }
];

// Combined styles for backwards compatibility
export const STYLE_OPTIONS: StyleOption[] = [...TRADITIONAL_STYLES, ...TRENDING_STYLES];

export const STYLE_CATEGORIES = [
  { id: 'all', name: 'All Styles' },
  { id: 'artistic', name: 'Artistic' },
  { id: 'photography', name: 'Photography' },
  { id: 'modern', name: 'Modern' },
  { id: 'vintage', name: 'Vintage' }
] as const;