import React from "react";
import All from "../../../assets/Group_39332.png";
import Solo from "../../../assets/Group_39330.png";
import Team from "../../../assets/Group_39329.png";

const FILTERS = [
  { id: "all", label: "All types", img: All },
  { id: "solo", label: "Solo", img: Solo },
  { id: "team", label: "Team", img: Team },
];

const EventTypeFilter = ({ selectedTypeFilter, handleTypeFilterClick }) => {
  return (
    <div className="w-full">
      <p className="milonga mt-6 sm:mt-10 mb-4 text-lg sm:text-xl">
        Event Type
      </p>

      {/* Cards */}
      <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6">
        {FILTERS.map((filter) => {
          const isActive = selectedTypeFilter === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => handleTypeFilterClick(filter.id)}
              className={`
                relative
                w-[90px] h-[90px]
                sm:w-[100px] sm:h-[100px]
                md:w-[120px] md:h-[120px]
                rounded-2xl
                flex flex-col items-center justify-center
                transition-all duration-300
                ${
                  isActive
                    ? "bg-[#cdb7ff] shadow-[0_0_30px_rgba(170,140,255,0.6)]"
                    : "bg-white hover:scale-[1.03]"
                }
              `}
            >
              {/* Title */}
              <span
                className={`
                  mb-2
                  text-xs sm:text-sm md:text-base
                  font-semibold
                  ${
                    isActive ? "text-[#4b2ea8]" : "text-[#1e1e1e]"
                  }
                `}
              >
                {filter.label}
              </span>

              {/* PNG */}
              <div className="
                w-[42px] h-[42px]
                sm:w-[50px] sm:h-[50px]
                md:w-[60px] md:h-[60px]
                flex items-center justify-center
              ">
                <img
                  src={filter.img}
                  alt={filter.label}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventTypeFilter;
