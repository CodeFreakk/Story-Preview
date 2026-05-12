import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../imports/Home/Home";
import StoryScreen from "./StoryScreen";

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