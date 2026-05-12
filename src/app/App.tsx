import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../imports/Home/Home";
import StoryScreen from "./StoryScreen";

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="box-border flex min-h-dvh items-center justify-center bg-gray-100 p-4 [-webkit-tap-highlight-color:transparent]">
      <div className="relative flex h-[min(844px,100dvh)] w-[390px] max-w-full min-h-0 flex-col overflow-hidden bg-white shadow-2xl [-webkit-tap-highlight-color:transparent] touch-manipulation">
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