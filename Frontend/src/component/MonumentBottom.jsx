import monumentsAll from "../assets/mmm.svg";

const MonumentBottom = () => {

  return (
    <div className="relative w-full overflow-hidden min-h-[190px]">
      
      <div
        className="absolute inset-0 opacity-95"
        style={{
          backgroundImage: `url(${monumentsAll})`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "0 bottom",
          backgroundSize: "auto 100%",
          animation: "scrollBg 40s linear infinite",
          willChange: "background-position",
        }}
      />

      <style>
        {`
          @keyframes scrollBg {
            from {
              background-position: 0 bottom;
            }
            to {
              background-position: -1000px bottom;
            }
          }
        `}
      </style>

    </div>
  );
};

export default MonumentBottom;
