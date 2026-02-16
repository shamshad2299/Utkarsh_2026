import monumentsAll from "../assets/mmm.svg";

const MonumentBottom = () => {
  return (
    <div className="">
      <img
        src={monumentsAll}
        alt="Monuments"
        className="w-full object-cover object-bottom opacity-95 block"
      />
    </div>
  );
};

export default MonumentBottom;
