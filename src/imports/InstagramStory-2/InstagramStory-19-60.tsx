import svgPaths from "./svg-hblpgyq5r6";
import imgRectangle from "./f2b0353157c06e5c9900d1fe3a983bb7dee5662c.png";
import imgUserPicture1 from "./8e30719e557c42dde836f7f4c1909359490ae7e2.png";
import imgProfilePicture from "./87a3e2ff0537ab3421aca310a2d957fcf8192be6.png";

function Container() {
  return (
    <div className="h-[1.96px] relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 absolute backdrop-blur-[1.633px] bg-[rgba(255,255,255,0.35)] h-[1.96px] left-0 right-0 rounded-[3px] top-1/2" data-name="Story Timeline Elements" />
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-0 pr-[32.663px] right-0 top-1/2" data-name="Story Timeline Elements">
        <div className="bg-white h-[1.96px] opacity-55 relative rounded-[3px] shrink-0 w-full" data-name="Progress" />
      </div>
    </div>
  );
}

function UserNameAndTime() {
  return (
    <div className="content-stretch flex gap-[9px] items-end not-italic relative shrink-0 whitespace-nowrap" data-name="User Name and Time">
      <div className="flex flex-col font-sans font-medium justify-center leading-[0] relative shrink-0 text-[15px] text-white tracking-[0.3432px]">
        <p className="leading-[normal]">Rodek</p>
      </div>
      <p className="font-sans font-normal leading-[normal] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)]">4h</p>
    </div>
  );
}

function UserDetails() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="User Details">
      <div className="relative shrink-0 size-[33.28px]" data-name="User Picture 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="33.28" src={imgUserPicture1} width="33.28" />
      </div>
      <UserNameAndTime />
    </div>
  );
}

function CloseIcon() {
  return (
    <div className="relative shrink-0 size-[18.474px]" data-name="Close Icon">
      <div className="absolute inset-[-1.13%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.89 18.89">
          <g id="Close Icon">
            <g id="Shape">
              <path d={svgPaths.p3f11e700} fill="var(--fill-0, white)" style={{ fill: "white", fillOpacity: "1" }} />
              <path d={svgPaths.p76c9200} stroke="var(--stroke-0, black)" strokeOpacity="0.2" strokeWidth="0.208" style={{ stroke: "black", strokeOpacity: "0.2" }} />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function PostHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="Post Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[2px] relative size-full">
          <UserDetails />
          <CloseIcon />
        </div>
      </div>
    </div>
  );
}

function UserInfo() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[63.892px] items-center left-[8.32px] top-[8.78px] w-[372.84px]" data-name="User Info">
      <div className="relative shrink-0 w-full" data-name="Timeline Bar">
        <div className="content-stretch flex gap-[1.96px] items-start p-[7.839px] relative size-full">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Story Timeline Elements">
            <Container />
          </div>
          <div className="backdrop-blur-[1.633px] bg-[rgba(255,255,255,0.35)] flex-[1_0_0] h-[1.96px] min-w-px relative rounded-[3px]" data-name="Story Timeline Elements" />
          <div className="backdrop-blur-[1.633px] bg-[rgba(255,255,255,0.35)] flex-[1_0_0] h-[1.96px] min-w-px relative rounded-[3px]" data-name="Story Timeline Elements" />
        </div>
      </div>
      <PostHeader />
    </div>
  );
}

function Story() {
  return (
    <div className="absolute contents left-0 top-[-0.24px]" data-name="Story">
      <div className="absolute h-[752.238px] left-0 rounded-[18px] top-[-0.24px] w-[390px]" data-name="Rectangle">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[18px]">
          <img alt="" className="absolute max-w-none object-cover rounded-[18px] size-full" src={imgRectangle} />
          <div className="absolute inset-0 rounded-[18px]" style={{ backgroundImage: "linear-gradient(-2.13163e-13deg, rgba(0, 0, 0, 0) 42.916%, rgba(0, 0, 0, 0.8) 99.92%), linear-gradient(rgba(0, 0, 0, 0) 56.399%, rgba(0, 0, 0, 0.3) 99.678%)" }} />
        </div>
      </div>
      <div className="absolute bg-[rgba(0,0,0,0)] h-[65.412px] left-0 top-[-0.24px] w-[390px]" data-name="Rectangle" />
      <UserInfo />
    </div>
  );
}

function Message() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[20px] pr-[146.01px] py-[13px] relative rounded-[21.558px] shrink-0" data-name="Message">
      <div aria-hidden="true" className="absolute border-[1.633px] border-solid border-white inset-0 pointer-events-none rounded-[21.558px]" />
      <p className="font-sans font-normal leading-[16.005px] not-italic relative shrink-0 text-[15px] text-[rgba(255,255,255,0.8)] tracking-[0.0327px] whitespace-nowrap">Send message</p>
    </div>
  );
}

function Icons() {
  return (
    <div className="h-[20.251px] relative shrink-0 w-[63.04px]" data-name="Icons">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63.0402 20.2513">
        <g id="Icons">
          <path clipRule="evenodd" d={svgPaths.p5e66bf0} fill="var(--fill-0, white)" fillRule="evenodd" id="Like" style={{ fill: "white", fillOpacity: "1" }} />
          <path clipRule="evenodd" d={svgPaths.p57e3900} fill="var(--fill-0, white)" fillRule="evenodd" id="Sent" style={{ fill: "white", fillOpacity: "1" }} />
        </g>
      </svg>
    </div>
  );
}

function MessageBar() {
  return (
    <div className="-translate-x-1/2 absolute bg-black bottom-[-0.28px] content-stretch flex gap-[18.291px] items-center justify-center left-[calc(50%-0.5px)] pb-[16px] pt-[14px] px-[16px] w-[390px]" data-name="Message Bar">
      <Message />
      <Icons />
    </div>
  );
}

function Tail() {
  return (
    <div className="h-[4px] relative w-[8px]" data-name="Tail">
      <div className="absolute inset-[-50%_-37.5%_0_-37.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 6">
          <g id="Tail">
            <rect fill="var(--fill-0, white)" height="2" id="Safe" rx="1" style={{ fill: "white", fillOpacity: "1" }} width="14" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ProfilePicture() {
  return (
    <div className="h-[79.487px] pointer-events-none relative rounded-[10px] shrink-0 w-full" data-name="Profile Picture">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[10px] size-full" src={imgProfilePicture} />
      <div aria-hidden="true" className="absolute border-[2.5px] border-solid border-white inset-[-2.5px] rounded-[12.5px]" />
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] items-center left-[44.5px] top-[26px] w-[60px]" data-name="Profile">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <Tail />
        </div>
      </div>
      <ProfilePicture />
    </div>
  );
}

export default function InstagramStory() {
  return (
    <div className="bg-black relative size-full" data-name="Instagram Story">
      <Story />
      <MessageBar />
      <Profile />
    </div>
  );
}