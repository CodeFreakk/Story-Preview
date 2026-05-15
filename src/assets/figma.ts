/**
 * Static image URLs for Home (Figma export). Files live in /public/images.
 */
const images = "/images";

export const figmaHome = {
  innerOval: `${images}/your_story.png`,
  innerOval1: `${images}/colegreen.png`,
  innerOval2: `${images}/rodek.png`,
  innerOval3: `${images}/macronbi.png`,
  innerOval4: `${images}/selena.png`,
  oval: `${images}/fredrick_g.png`,
  postRectangle: `${images}/tokyoPost.png`,
  postColegreen: `${images}/colegreen_story.jpg`,
  postRodek: `${images}/rodek_story_image2.jpg`,
  postMacronbi: `${images}/macronbi_story.jpg`,
  oval1: `${images}/${encodeURIComponent("tabMenu avatat.png")}`,
} as const;
