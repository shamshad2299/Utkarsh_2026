// src/component/TeamSectionFolder/TeamSection.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import TeamGrid from "./TeamGrid";
import websiteCrewHeading from "../../assets/website_crew_heading.png";


const TeamSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get("/website-team");
        setMembers(res.data.data || []);
      } catch (err) {
        console.error("Failed to load team", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section id="team" className="relative py-20 bg-[#080131] text-white">
      {/* background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4">
      {/* ===== Heading (Image-based) ===== */}
      <div className="mb-14 flex justify-center">
        <img
          src={websiteCrewHeading}
          alt="Website Crew :he website crew: Bringing the magic"
          className="
            w-[320px]
            sm:w-[420px]
            md:w-[540px]
            h-auto
            select-none
          "
        />
      </div>


        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-400">Loading team...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-gray-400">
            No team members available.
          </p>
        ) : (
          <TeamGrid members={members} />
        )}
      </div>
    </section>
  );
};

export default TeamSection;
