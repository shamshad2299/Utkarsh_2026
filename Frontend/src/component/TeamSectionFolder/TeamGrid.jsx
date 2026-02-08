// src/component/TeamSectionFolder/TeamGrid.jsx
import TeamCard from "./TeamCard";

const TOTAL_SLOTS = 7;

const TeamGrid = ({ members }) => {
  const slots = Array(TOTAL_SLOTS).fill(null);

  members.forEach((m) => {
    if (m.order >= 1 && m.order <= TOTAL_SLOTS) {
      slots[m.order - 1] = m;
    }
  });

  return (
    <>
      {/* ===== TOP ROW (4 CARDS) ===== */}
      <div className="
        flex flex-wrap
        justify-center
        gap-6
      ">
        {slots.slice(0, 4).map(
          (m) => m && <TeamCard key={m._id} member={m} />
        )}
      </div>

      {/* ===== BOTTOM ROW (3 CARDS) ===== */}
      <div className="
        mt-10
        flex flex-wrap
        justify-center
        gap-6
        max-w-6xl
        mx-auto
      ">
        {slots.slice(4).map(
          (m) => m && <TeamCard key={m._id} member={m} />
        )}
      </div>
    </>
  );
};

export default TeamGrid;
