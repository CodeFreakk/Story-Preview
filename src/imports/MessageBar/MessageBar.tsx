import svgPaths from "./svg-w74wf0teo2";

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

export default function MessageBar() {
  return (
    <div className="content-stretch flex gap-[18.291px] items-center justify-center pl-[15.678px] pr-[16.658px] pt-[8.166px] relative size-full" data-name="Message Bar">
      <div className="content-stretch flex items-center justify-center pb-[14.045px] pl-[20.578px] pr-[146.005px] pt-[13.065px] relative rounded-[66px] shrink-0" data-name="Message">
        <div aria-hidden="true" className="absolute border-[1.633px] border-solid border-white inset-0 pointer-events-none rounded-[66px] py-[6px] m-[0px] p-[0px]" />
        <p className="font-sans font-medium leading-[5.228px] not-italic relative shrink-0 text-[4.57px] text-[rgba(255,255,255,0.7)] tracking-[0.0327px] whitespace-nowrap text-[14px] px-[0px] py-[4px]">Send message</p>
      </div>
      <Icons />
    </div>
  );
}