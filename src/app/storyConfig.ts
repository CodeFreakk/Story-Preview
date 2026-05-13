import type { StoryMediaSlide } from "../imports/InstagramStory/InstagramStory";

export const STORY_DISPLAY: Record<string, string> = {
  colegreen: "colegreen",
  rodek: "rodek",
  macronbi: "macronbi",
  selena: "selena",
};

export const STORY_AVATAR: Record<string, string> = {
  colegreen: "/images/colegreen.png",
  rodek: "/images/rodek.png",
  macronbi: "/images/macronbi.png",
  selena: "/images/selena.png",
};

/** Per-user story slides: profile shot then post (same pattern as Instagram photo stories). */
export const STORY_SLIDES: Record<string, StoryMediaSlide[]> = {
  colegreen: [
    { type: "image", src: "/images/colegreen.png" },
    { type: "image", src: "/images/tokyoPost.png" },
  ],
  rodek: [
    { type: "video", src: "/videos/rodek_story_video720p.mp4" },
    { type: "image", src: "/images/rodek_story_image2.jpg" },
  ],
  macronbi: [
    { type: "image", src: "/images/macronbi.png" },
    { type: "image", src: "/images/tokyoPost.png" },
  ],
  selena: [
    { type: "video", src: "/videos/selena_story_video1.mp4" },
    { type: "video", src: "/videos/selena_story_video2.mp4" },
  ],
};

export function slidesForStory(
  storyId: string | undefined,
  fallbackAvatar: string,
): StoryMediaSlide[] {
  if (storyId && STORY_SLIDES[storyId]) return STORY_SLIDES[storyId];
  return [
    { type: "image", src: fallbackAvatar },
    { type: "image", src: "/images/tokyoPost.png" },
  ];
}

/** Unique story media URLs for `<link rel="preload">` as soon as the shell loads. */
export function getStoryPrefetchAssetUrls(): {
  videoUrls: string[];
  imageUrls: string[];
} {
  const videoUrls = new Set<string>();
  const imageUrls = new Set<string>();
  for (const slides of Object.values(STORY_SLIDES)) {
    for (const s of slides) {
      if (s.type === "video") videoUrls.add(s.src);
      else imageUrls.add(s.src);
    }
  }
  for (const src of Object.values(STORY_AVATAR)) {
    imageUrls.add(src);
  }
  imageUrls.add("/images/fredrick_g.png");
  return { videoUrls: [...videoUrls], imageUrls: [...imageUrls] };
}
