import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../imports/Home/Home";
import StoryScreen from "./StoryScreen";

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative h-[844px] w-[390px] overflow-hidden bg-white shadow-2xl">
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