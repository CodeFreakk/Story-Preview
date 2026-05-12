import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useNavigate } from "react-router";
import svgPaths from "./svg-chh8fi0vxl";
import { figmaHome } from "../../assets/figma";

const imgInnerOval = figmaHome.innerOval;
const imgInnerOval1 = figmaHome.innerOval1;
const imgInnerOval2 = figmaHome.innerOval2;
const imgInnerOval3 = figmaHome.innerOval3;
const imgInnerOval4 = figmaHome.innerOval4;
const imgOval = figmaHome.oval;
const imgRectangle = figmaHome.postRectangle;
const imgOval1 = figmaHome.oval1;

const STORY_TAP_MOVE_PX = 14;

function StoryNavCell({
  storyId,
  className,
  children,
  ...divProps
}: Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  storyId: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const startRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      {...divProps}
      className={className}
      onPointerDown={(e) => {
        startRef.current = { x: e.clientX, y: e.clientY };
        divProps.onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        const s = startRef.current;
        startRef.current = null;
        if (!s) return;
        if (Math.hypot(e.clientX - s.x, e.clientY - s.y) > STORY_TAP_MOVE_PX) return;
        navigate(`/story/${storyId}`);
        divProps.onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        startRef.current = null;
        divProps.onPointerCancel?.(e);
      }}
    >
      {children}
    </div>
  );
}


function TablerIconPlus() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="tabler-icon-plus">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="tabler-icon-plus">
          <path d={svgPaths.p344c4200} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" style={{ stroke: "black", strokeOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function TablerIconHeart() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="tabler-icon-heart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="tabler-icon-heart">
          <path d={svgPaths.p3cbd0a00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" style={{ stroke: "black", strokeOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative size-full">
          <TablerIconPlus />
          <div className="h-[29.12px] relative shrink-0 w-[109.201px]" data-name="Instagram Logo">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 109.2 29.1188">
              <path d={svgPaths.p7d1da80} fill="var(--fill-0, #262626)" id="Instagram Logo" style={{ fill: "color(display-p3 0.1490 0.1490 0.1490)", fillOpacity: "1" }} />
            </svg>
          </div>
          <TablerIconHeart />
        </div>
      </div>
    </div>
  );
}

function ProfileImage() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[0.47px] mt-0 place-items-start relative row-1" data-name="Profile Image">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[68.442px]" data-name="Oval Copy">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.6503 70.6503">
            <path clipRule="evenodd" d={svgPaths.p36929b00} fillRule="evenodd" id="Oval Copy" stroke="url(#paint0_linear_1_200)" strokeWidth="2.20782" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_200" x1="37.5561" x2="84.7979" y1="85.2618" y2="34.7147">
                <stop stopColor="#FBAA47" style={{ stopColor: "color(display-p3 0.9843 0.6667 0.2784)", stopOpacity: "1" }} />
                <stop offset="0.519909" stopColor="#D91A46" style={{ stopColor: "color(display-p3 0.8510 0.1020 0.2745)", stopOpacity: "1" }} />
                <stop offset="1" stopColor="#A60F93" style={{ stopColor: "color(display-p3 0.6510 0.0588 0.5765)", stopOpacity: "1" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="col-1 ml-[3.31px] mt-[3.31px] relative row-1 size-[61.819px]" data-name="Inner Oval">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="61.819" src={imgInnerOval} width="61.819" />
      </div>
    </div>
  );
}

function YourStory() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Your Story">
      <ProfileImage />
      <p className="col-1 font-sans font-[450] leading-[normal] ml-0 mt-[73.96px] not-italic relative row-1 text-[#262626] text-[13.799px] text-center tracking-[-0.1061px] whitespace-nowrap">Your Story</p>
    </div>
  );
}

function LiveContainer() {
  return (
    <div className="col-1 content-stretch flex h-[18.045px] items-center justify-center ml-0 mt-0 pb-[4.246px] pl-[5.307px] pr-[6.369px] pt-[3.184px] relative rounded-[6.369px] row-1 w-[31.844px]" style={{ backgroundImage: "linear-gradient(141.896deg, rgb(201, 0, 131) 10.821%, rgb(210, 36, 99) 29.294%, rgb(241, 163, 29) 93.414%)" }} data-name="Live Container">
      <div aria-hidden="true" className="absolute border-[#fefefe] border-[1.698px] border-solid inset-[-0.849px] pointer-events-none rounded-[7.218px]" />
      <div className="flex flex-col font-sans font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fefefe] text-[8.831px] text-center tracking-[0.552px] whitespace-nowrap">
        <p className="leading-[normal]">LIVE</p>
      </div>
    </div>
  );
}

function Live1() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[20.25px] mt-[56.13px] place-items-start relative row-1" data-name="Live">
      <LiveContainer />
    </div>
  );
}

function Live() {
  return (
    <StoryNavCell
      storyId="colegreen"
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 touch-manipulation cursor-pointer"
      data-name="Live">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[68.442px]" data-name="Oval Copy">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.6503 70.6503">
            <path clipRule="evenodd" d={svgPaths.p36929b00} fillRule="evenodd" id="Oval Copy" stroke="url(#paint0_linear_1_192)" strokeWidth="2.20782" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_192" x1="89.1057" x2="42.5988" y1="41.197" y2="-4.27199">
                <stop stopColor="#E20337" style={{ stopColor: "color(display-p3 0.8863 0.0118 0.2157)", stopOpacity: "1" }} />
                <stop offset="0.51868" stopColor="#C60188" style={{ stopColor: "color(display-p3 0.7765 0.0039 0.5333)", stopOpacity: "1" }} />
                <stop offset="1" stopColor="#7700C3" style={{ stopColor: "color(display-p3 0.4667 0.0000 0.7647)", stopOpacity: "1" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="col-1 ml-[3.31px] mt-[3.31px] relative row-1 size-[61.819px]" data-name="Inner Oval">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="61.819" src={imgInnerOval1} width="61.819" />
      </div>
      <p className="col-1 font-sans font-[450] leading-[normal] ml-[2.34px] mt-[73.96px] not-italic relative row-1 text-[#262626] text-[13.799px] text-center tracking-[-0.1061px] whitespace-nowrap">colegreen</p>
      <Live1 />
    </StoryNavCell>
  );
}

function ProfileImage1() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Profile Image">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[68.442px]" data-name="Oval Copy">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.6503 70.6503">
            <path clipRule="evenodd" d={svgPaths.p36929b00} fillRule="evenodd" id="Oval Copy" stroke="url(#paint0_linear_1_200)" strokeWidth="2.20782" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_200" x1="37.5561" x2="84.7979" y1="85.2618" y2="34.7147">
                <stop stopColor="#FBAA47" style={{ stopColor: "color(display-p3 0.9843 0.6667 0.2784)", stopOpacity: "1" }} />
                <stop offset="0.519909" stopColor="#D91A46" style={{ stopColor: "color(display-p3 0.8510 0.1020 0.2745)", stopOpacity: "1" }} />
                <stop offset="1" stopColor="#A60F93" style={{ stopColor: "color(display-p3 0.6510 0.0588 0.5765)", stopOpacity: "1" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="col-1 ml-[3.31px] mt-[3.31px] relative row-1 size-[61.819px]" data-name="Inner Oval">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="61.819" src={imgInnerOval2} width="61.819" />
      </div>
    </div>
  );
}

function Story() {
  return (
    <StoryNavCell
      storyId="rodek"
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 touch-manipulation cursor-pointer"
      data-name="Story"
    >
      <ProfileImage1 />
      <p className="col-1 font-sans font-[450] leading-[normal] ml-[15.62px] mt-[73.96px] not-italic relative row-1 text-[#262626] text-[13.799px] text-center tracking-[-0.1061px] whitespace-nowrap">rodek</p>
    </StoryNavCell>
  );
}

function ProfileImage2() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Profile Image">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[68.442px]" data-name="Oval Copy">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.6503 70.6503">
            <path clipRule="evenodd" d={svgPaths.p36929b00} fillRule="evenodd" id="Oval Copy" stroke="url(#paint0_linear_1_200)" strokeWidth="2.20782" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_200" x1="37.5561" x2="84.7979" y1="85.2618" y2="34.7147">
                <stop stopColor="#FBAA47" style={{ stopColor: "color(display-p3 0.9843 0.6667 0.2784)", stopOpacity: "1" }} />
                <stop offset="0.519909" stopColor="#D91A46" style={{ stopColor: "color(display-p3 0.8510 0.1020 0.2745)", stopOpacity: "1" }} />
                <stop offset="1" stopColor="#A60F93" style={{ stopColor: "color(display-p3 0.6510 0.0588 0.5765)", stopOpacity: "1" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="col-1 ml-[3.31px] mt-[3.31px] relative row-1 size-[61.819px]" data-name="Inner Oval">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="61.819" src={imgInnerOval3} width="61.819" />
      </div>
    </div>
  );
}

function Story1() {
  return (
    <StoryNavCell
      storyId="macronbi"
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 touch-manipulation cursor-pointer"
      data-name="Story">
      <ProfileImage2 />
      <p className="col-1 font-sans font-[450] leading-[normal] ml-[3.48px] mt-[73.96px] not-italic relative row-1 text-[#262626] text-[13.799px] text-center tracking-[-0.1061px] whitespace-nowrap">macronbi</p>
    </StoryNavCell>
  );
}

function ProfileImage3() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Profile Image">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[68.442px]" data-name="Oval Copy">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.6503 70.6503">
            <path clipRule="evenodd" d={svgPaths.p36929b00} fillRule="evenodd" id="Oval Copy" stroke="url(#paint0_linear_1_200)" strokeWidth="2.20782" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_200" x1="37.5561" x2="84.7979" y1="85.2618" y2="34.7147">
                <stop stopColor="#FBAA47" style={{ stopColor: "color(display-p3 0.9843 0.6667 0.2784)", stopOpacity: "1" }} />
                <stop offset="0.519909" stopColor="#D91A46" style={{ stopColor: "color(display-p3 0.8510 0.1020 0.2745)", stopOpacity: "1" }} />
                <stop offset="1" stopColor="#A60F93" style={{ stopColor: "color(display-p3 0.6510 0.0588 0.5765)", stopOpacity: "1" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="col-1 ml-[3.31px] mt-[3.31px] relative row-1 size-[61.819px]" data-name="Inner Oval">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="61.819" src={imgInnerOval4} width="61.819" />
      </div>
    </div>
  );
}

function Story2() {
  return (
    <StoryNavCell
      storyId="selena"
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 touch-manipulation cursor-pointer"
      data-name="Story">
      <ProfileImage3 />
      <p className="col-1 font-sans font-[450] leading-[normal] ml-[12.31px] mt-[73.96px] not-italic relative row-1 text-[#262626] text-[13.799px] text-center tracking-[-0.1061px] whitespace-nowrap">selena</p>
    </StoryNavCell>
  );
}

function Stories() {
  return (
    <div className="overflow-x-auto w-full" style={{ scrollbarWidth: "none" }} data-name="Stories">
      <div className="content-stretch flex gap-[22.291px] items-center leading-[0] pb-[3px] pt-[3px] relative" style={{ width: "max-content" }}>
        <YourStory />
        <Live />
        <Story />
        <Story1 />
        <Story2 />
      </div>
    </div>
  );
}

function StoriesContainer() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Stories Container">
      <div aria-hidden="true" className="absolute border-[#f7f7f7] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[14px] pt-[10px] px-[16px] relative size-full">
        <Stories />
      </div>
    </div>
  );
}

function OfficialIcon() {
  return (
    <div className="h-[10.189px] relative shrink-0 w-[10.294px]" data-name="Official Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.2941 10.1894">
        <g id="Official Icon">
          <path clipRule="evenodd" d={svgPaths.p1ddbb570} fill="var(--fill-0, #3897F0)" fillRule="evenodd" id="Shape" style={{ fill: "color(display-p3 0.2196 0.5922 0.9412)", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function UserInfoTop() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="User Info Top">
      <p className="font-sans font-medium leading-[18.72px] not-italic relative shrink-0 text-[#262626] text-[13.52px] tracking-[-0.104px] whitespace-nowrap">fredrick_g</p>
      <OfficialIcon />
    </div>
  );
}

function UserInfoContainer() {
  return (
    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-[71.76px]" data-name="User Info Container">
      <UserInfoTop />
      <p className="font-sans font-normal leading-[normal] not-italic relative shrink-0 text-[#626262] text-[12px] tracking-[0.0728px] whitespace-nowrap">Tokyo, Japan</p>
    </div>
  );
}

function UserInfo() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="User Info">
      <div className="relative shrink-0 size-[33.28px]" data-name="Oval">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="33.28" src={imgOval} width="33.28" />
      </div>
      <UserInfoContainer />
    </div>
  );
}

function MoreIcon() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="More Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="More Icon">
          <path clipRule="evenodd" d={svgPaths.p2ecea000} fill="var(--fill-0, #262626)" fillRule="evenodd" id="Shape" style={{ fill: "color(display-p3 0.1490 0.1490 0.1490)", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function PostHeaderContainer() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Post Header Container">
      <UserInfo />
      <MoreIcon />
    </div>
  );
}

function PostHeader() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Post Header">
      <div className="content-stretch flex flex-col items-start pb-[14px] pt-[16px] px-[16px] relative size-full">
        <PostHeaderContainer />
      </div>
    </div>
  );
}

function Heart() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Heart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Heart">
          <path clipRule="evenodd" d={svgPaths.pea63480} fill="var(--fill-0, #333333)" fillRule="evenodd" id="Heart (Stroke)" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
          <path d={svgPaths.p2c8765f0} fill="var(--fill-0, #333333)" id="Heart_2" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function Comment() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Comment">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Comment">
          <path clipRule="evenodd" d={svgPaths.p100ec680} fill="var(--fill-0, #333333)" fillRule="evenodd" id="Comment_2" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
          <g id="Comment (Stroke)">
            <path clipRule="evenodd" d={svgPaths.p15060e80} fill="var(--fill-0, #333333)" fillRule="evenodd" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
            <path clipRule="evenodd" d={svgPaths.p15305900} fill="var(--fill-0, #333333)" fillRule="evenodd" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Share() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Share">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Share">
          <path d={svgPaths.p35392c80} fill="var(--fill-0, #333333)" id="Union" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function LeftPicto() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-0 top-0" data-name="Left Picto">
      <Heart />
      <Comment />
      <Share />
    </div>
  );
}

function IconContainer() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon Container">
      <LeftPicto />
    </div>
  );
}

function Pagination() {
  return (
    <div className="h-[6.24px] relative shrink-0 w-[27.041px]" data-name="Pagination">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.04 6.24002">
        <g id="Pagination">
          <path clipRule="evenodd" d={svgPaths.p1e2ff00} fill="var(--fill-0, #3897F0)" fillRule="evenodd" id="Oval" style={{ fill: "color(display-p3 0.2196 0.5922 0.9412)", fillOpacity: "1" }} />
          <path clipRule="evenodd" d={svgPaths.p21d36f00} fill="var(--fill-0, black)" fillOpacity="0.15" fillRule="evenodd" id="Oval_2" style={{ fill: "black", fillOpacity: "0.15" }} />
          <path clipRule="evenodd" d={svgPaths.p363a0800} fill="var(--fill-0, black)" fillOpacity="0.15" fillRule="evenodd" id="Oval_3" style={{ fill: "black", fillOpacity: "0.15" }} />
        </g>
      </svg>
    </div>
  );
}

function Bookmark() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Bookmark">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Bookmark">
          <path d={svgPaths.p2fbbc80} fill="var(--fill-0, #333333)" id="Bookmark_2" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
          <path clipRule="evenodd" d={svgPaths.p36d4ab80} fill="var(--fill-0, #333333)" fillRule="evenodd" id="Bookmark (Stroke)" style={{ fill: "color(display-p3 0.2000 0.2000 0.2000)", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function Icons() {
  return (
    <div className="content-stretch flex items-center justify-between pb-[4px] relative shrink-0 w-full" data-name="Icons">
      <IconContainer />
      <Pagination />
      <Bookmark />
    </div>
  );
}

function BottomInfos() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Bottom Infos">
      <div className="content-stretch flex flex-col gap-[10px] items-start pt-[12px] px-[16px] relative size-full">
        <Icons />
        <p className="font-sans font-semibold leading-[0] not-italic relative shrink-0 text-[#262626] text-[13.52px] tracking-[-0.104px] w-[358.8px]">
          <span className="font-medium leading-[18.72px]">fredrick_g</span>
          <span className="font-medium leading-[18.72px]">{` `}</span>
          <span className="font-normal leading-[18.72px] text-[#595959] tracking-[-0.0728px]">The game in Japan was amazing and I want to share some photos</span>
        </p>
        <p className="font-sans font-normal leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.4)] tracking-[0.1px] whitespace-nowrap">September 19</p>
      </div>
    </div>
  );
}

function Post() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="post">
      <div className="h-[390px] relative shrink-0 w-full" data-name="Rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle} />
      </div>
      <BottomInfos />
    </div>
  );
}

function PostSection() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Post Section">
      <PostHeader />
      <Post />
    </div>
  );
}

function StoriesSection() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Stories Section">
      <StoriesContainer />
      <PostSection />
    </div>
  );
}

function TopSection() {
  return (
    <div className="relative flex w-full flex-col content-stretch items-start shrink-0" data-name="Top Section">
      <Header />
      <StoriesSection />
    </div>
  );
}

function HomeFill() {
  return (
    <div className="h-[21.84px] relative shrink-0 w-[22.88px]" data-name="Home - Fill">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.8817 21.8487">
        <g id="Home - Fill">
          <path d={svgPaths.p160bc80} fill="var(--fill-0, #121212)" id="Combined Shape" style={{ fill: "color(display-p3 0.0706 0.0706 0.0706)", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function Search() {
  return (
    <div className="h-[22.88px] relative shrink-0 w-[21.84px]" data-name="Search">
      <div className="absolute inset-[-1.26%_-1.87%_-1.78%_-1.32%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5371 23.5742">
          <g id="Search">
            <path d={svgPaths.p32c8f000} fill="var(--fill-0, #121212)" id="Union" style={{ fill: "color(display-p3 0.0706 0.0706 0.0706)", fillOpacity: "1" }} />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Reel() {
  return (
    <div className="relative shrink-0 size-[22.88px]" data-name="Reel">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.8817 22.8811">
        <g id="Reel">
          <path d={svgPaths.p1c0940a0} fill="var(--fill-0, #121212)" id="Reel_2" style={{ fill: "color(display-p3 0.0706 0.0706 0.0706)", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function Shopping() {
  return (
    <div className="h-[22.88px] relative shrink-0 w-[20.8px]" data-name="Shopping">
      <div className="absolute inset-[-0.55%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.8019 23.0049">
          <g id="Shopping">
            <path d={svgPaths.p10ca5e00} fill="var(--fill-0, #121212)" id="Union" style={{ fill: "color(display-p3 0.0706 0.0706 0.0706)", fillOpacity: "1" }} />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ProfileIcon() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Profile Icon">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[25px]" data-name="Oval">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="25" src={imgOval1} width="25" />
      </div>
    </div>
  );
}

function BottomNavContainer() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Bottom Nav Container">
      <HomeFill />
      <Search />
      <Reel />
      <Shopping />
      <ProfileIcon />
    </div>
  );
}

function BottomNav() {
  return (
    <div
      className="relative z-10 flex w-full shrink-0 flex-col content-stretch items-center justify-center border-t border-solid border-[#ececec] bg-white pt-[20px] pb-[44px] px-[32px]"
      data-name="Bottom Nav"
    >
      <BottomNavContainer />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col bg-white" data-name="home">
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
        <TopSection />
      </div>
      <BottomNav />
    </div>
  );
}