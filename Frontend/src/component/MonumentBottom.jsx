import m1 from "../assets/monument-1.svg";
import m2 from "../assets/monument-2.svg";
import m3 from "../assets/monument-3.svg";
import m4 from "../assets/monument-4.svg";
import m5 from "../assets/monument-5.svg";
import m6 from "../assets/monument-6.svg";

const MonumentBottom = () => {
  const monuments = [m1, m2, m3, m4, m3, m2, m5, m6];

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-x-hidden">
      <div className="flex items-end h-40">
        {monuments.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Monument ${index + 1}`}
            className="flex-[1_1_0%] h-full object-contain object-bottom opacity-90"
          />
        ))}
      </div>
    </div>
  );
};

export default MonumentBottom;
