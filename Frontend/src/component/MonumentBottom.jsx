import monumentsAll from "../assets/mmm.svg";

const MonumentBottom = () => {
  return (
    <div className="absolute left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
      <img
        src={monumentsAll}
        alt="Monuments"
        className="w-full h-[190px] sm:h-[220px] md:h-[260px] object-cover object-bottom opacity-95 block"
      />
    </div>
  );
};

export default MonumentBottom;
