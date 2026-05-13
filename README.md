# InstaStoryPreview

This is a code bundle for InstaStoryPreview. The original Figma design is available at https://www.figma.com/design/WtwYJgG47XW4vWqR9mJ79V/Exact-Design-Implementation.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Story video (smaller files, faster start)

The app cannot “compress” video in the browser: you shrink bytes by **re-encoding the MP4** (or replacing it with a smaller file) in `public/videos/`. Use **H.264**, a capped resolution (for example 720p tall), and **`+faststart`** so playback can begin before the whole file is downloaded.

Example (adjust paths and `crf` as you like; lower `crf` = larger file, better quality):

```bash
ffmpeg -y -i public/videos/rodek_story_video1.mp4 -c:v libx264 -crf 26 -preset slow -vf "scale=-2:min(1280,ih)" -movflags +faststart -c:a aac -b:a 96k public/videos/rodek_story_video1_compressed.mp4
```

Then replace the original after you have checked quality, or point `STORY_SLIDES` in `src/app/storyConfig.ts` at the new filename. all story image and video URLs from `src/app/storyConfig.ts` when the app loads, and the story `<video>` uses `preload="auto"` so the browser buffers aggressively once the story is open.
