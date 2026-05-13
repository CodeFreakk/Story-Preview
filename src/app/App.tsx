import type { ReactNode } from "react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../imports/Home/Home";
import StoryScreen from "./StoryScreen";
import { getStoryPrefetchAssetUrls } from "./storyConfig";

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="box-border flex min-h-dvh w-full flex-col bg-white [-webkit-tap-highlight-color:transparent] md:items-center md:justify-center md:bg-gray-100 md:p-4">
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-white [-webkit-tap-highlight-color:transparent] touch-manipulation md:h-[min(844px,100dvh)] md:w-[390px] md:max-w-full md:flex-none md:shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const { videoUrls, imageUrls } = getStoryPrefetchAssetUrls();
    const links: HTMLLinkElement[] = [];
    const append = (rel: string, as: string, href: string) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.as = as;
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    };
    for (const href of videoUrls) {
      append("preload", "video", href);
    }
    for (const href of imageUrls) {
      append("preload", "image", href);
    }
    return () => {
      for (const link of links) {
        link.remove();
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PhoneFrame>
              <Home />
            </PhoneFrame>
          }
        />
        <Route
          path="/story/:storyId"
          element={
            <PhoneFrame>
              <StoryScreen />
            </PhoneFrame>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}