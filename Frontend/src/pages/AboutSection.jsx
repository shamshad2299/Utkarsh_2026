import React, { useState, useEffect } from "react";
import aboutImage from "../assets/about2.webp";
import {
  Calendar,
  Users,
  Trophy,
  Sparkles,
  Award,
  TrendingUp,
  Palette,
  Code,
  Landmark,
  Gem,
  Play,
  Pause,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FooterSection from "../component/Footer";

const AboutSection = () => {
  const [show, setShow] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  const historyData = [
    {
      year: "2011",
      era: "The Seed",
      title: "Where It All Began",
      desc: "A small gathering of 200 students in the college auditorium. What started as 'BBD Cultural Night' with just 5 events laid the foundation for something magnificent.",
      stats: { participants: "200", events: "5", colleges: "3" },
      color: "from-purple-600 to-purple-800",
      image: "🌱",
      achievements: [
        "First ever cultural night",
        "Local participation only",
        "Student-organized initiative",
      ],
    },
    {
      year: "2013",
      era: "The Sprout",
      title: "Towards Growth",
      desc: "Renamed to 'UTKARSH' meaning 'excellence'. Expanded to 3 days with inter-college competitions. The first trophy was introduced.",
      stats: { participants: "800", events: "15", colleges: "12" },
      color: "from-pink-600 to-pink-800",
      image: "🌿",
      achievements: [
        "First inter-college fest",
        "Introduction of trophies",
        "3-day format established",
      ],
    },
    {
      year: "2015",
      era: "The Blossom",
      title: "Gaining Recognition",
      desc: "UTKARSH became Lucknow's most anticipated college fest. Celebrity judges, workshops, and the first EDM night drew crowds of 2000+.",
      stats: { participants: "2000", events: "30", colleges: "25" },
      color: "from-blue-600 to-blue-800",
      image: "🌸",
      achievements: [
        "First celebrity appearance",
        "EDM night introduced",
        "City-wide recognition",
      ],
    },
    {
      year: "2017",
      era: "The Expansion",
      title: "Growth & Expansion",
      desc: "Recognized as the largest fest in Uttar Pradesh. Technical events joined cultural ones. Prize pool crossed ₹1 lakh.",
      stats: { participants: "3500", events: "45", colleges: "50" },
      color: "from-cyan-600 to-cyan-800",
      image: "🌳",
      achievements: [
        "Technical + Cultural fusion",
        "₹1L+ prize pool",
        "State-level recognition",
      ],
    },
    {
      year: "2019",
      era: "The Pride",
      title: "Decade Celebration",
      desc: "10th Anniversary celebration. Pan-North India participation with 5000+ attendees. Introduced gaming arena and fashion show.",
      stats: { participants: "5000", events: "60", colleges: "85" },
      color: "from-indigo-600 to-indigo-800",
      image: "🎪",
      achievements: [
        "10th Anniversary",
        "Gaming arena launch",
        "North India coverage",
      ],
    },
    {
      year: "2021",
      era: "The Resilience",
      title: "Digital Evolution",
      desc: "Pandemic didn't stop us! First hybrid fest with online events reaching 10,000+ digital participants.",
      stats: { participants: "10000", events: "75", colleges: "120" },
      color: "from-violet-600 to-violet-800",
      image: "💻",
      achievements: ["Hybrid format", "10K+ digital reach", "Innovation award"],
    },
    {
      year: "2023",
      era: "The Return",
      title: "Grand Comeback",
      desc: "Grand physical return with 3-day extravaganza. National artists, 90+ events, and the biggest production value yet.",
      stats: { participants: "7500", events: "90", colleges: "150" },
      color: "from-fuchsia-600 to-fuchsia-800",
      image: "🎊",
      achievements: ["National artists", "90+ events", "Record participation"],
    },
    {
      year: "2025",
      era: "The Innovation Era",
      title: "Tech Meets Tradition",
      desc: "UTKARSH 2025 embraced technology-driven experiences. AI-powered registrations, digital ticketing, immersive LED stages, and tech-cultural fusion defined the future-forward vision of the fest.",
      stats: { participants: "9000", events: "95", colleges: "180" },
      color: "from-blue-700 to-cyan-600",
      image: "🤖",
      achievements: [
        "AI-powered systems",
        "Fully digital registrations",
        "Tech-cultural fusion theme",
      ],
    },
    {
      year: "2026",
      era: "Virasat Se Vikas Tak",
      title: "15 Years of Excellence",
      desc: "UTKARSH'26 celebrates 15 glorious years under the theme 'Virasat Se Vikas Tak'. Honoring our cultural legacy while embracing progressive growth, this edition reflects the journey from tradition to transformation.",
      stats: { participants: "10000+", events: "100+", colleges: "200+" },
      color: "from-purple-700 to-orange-500",
      image: "💎",
      achievements: [
        "15 Year Celebration",
        "Legacy Showcase Events",
        "Cultural + Modern Fusion",
      ],
    },
  ];

  const highlights = [
    {
      icon: <Landmark className="w-5 h-5" />,
      title: "Heritage",
      desc: "15 years of rich cultural traditions and legacy.",
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Growth",
      desc: "Evolution from small fest to North India's biggest.",
      color: "from-pink-500 to-pink-700",
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Technology",
      desc: "100+ technical events showcasing innovation.",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Culture",
      desc: "Diverse performances representing Indian culture.",
      color: "from-cyan-500 to-cyan-700",
    },
  ];

  const quotes = [
    {
      text: "Culture is our identity",
      author: "Ancient Wisdom",
      icon: "🕉️",
    },
    {
      text: "Growth is our goal",
      author: "Modern Vision",
      icon: "📈",
    },
    {
      text: "From Heritage to Growth",
      author: "UTKARSH'26",
      icon: "⚡",
    },
  ];

  const quickStats = [
    { value: "15", label: "Years", icon: <Calendar className="w-3 h-3" /> },
    { value: "100+", label: "Events", icon: <Trophy className="w-3 h-3" /> },
    { value: "10K+", label: "Artists", icon: <Users className="w-3 h-3" /> },
    { value: "∞", label: "Memories", icon: <Gem className="w-3 h-3" /> },
  ];

  // Auto-play timeline effect
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveTimeline((prev) => (prev + 1) % historyData.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, historyData.length]);

  // Slow scroll effect
  const startSlowScroll = () => {
    setIsScrolling(true);
    const scrollDuration = 30000;
    const startTime = Date.now();
    const startPosition = window.scrollY;
    const targetPosition =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrollStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);

      window.scrollTo({
        top: startPosition + (targetPosition - startPosition) * progress,
        behavior: "auto",
      });

      if (progress < 1 && isScrolling) {
        requestAnimationFrame(scrollStep);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(scrollStep);
  };

  const stopSlowScroll = () => {
    setIsScrolling(false);
  };

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen ">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-linear(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      </div>

  

      {/* Main Content */}
      <div className="relative z-10 xl:max-w-[calc(100%-120px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div
          className={`
            text-center mb-10
            transition-all duration-700
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400 milonga">
              UTKARSH
            </span>
          </h1>

          <div className="inline-block px-6 py-2 sm:px-8 sm:py-3 mb-4">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              2026
            </p>
          </div>

          <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto">
            "From Heritage to Growth — 15 Years of Excellence"
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {/* Image */}
          <div
            className={`
              relative
              transition-all duration-700 delay-200
              ${show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}
            `}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={aboutImage}
                alt="UTKARSH'26"
                className="w-full object-contain"
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-purple-900/80 backdrop-blur-sm rounded-xl border border-purple-500/50">
                  <p className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    15 Years of Legacy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div
            className={`
              space-y-8 sm:space-y-10 relative
              transition-all duration-700 delay-400
              ${show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
            `}
          >
            {/* Quote Card */}
            <div className="bg-linear-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-linear-to-br from-[#6c63ff] to-[#5b54e6] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl text-white">❝</span>
                </div>
                <div>
                  <p className="text-[#e4e1ff] text-lg sm:text-xl md:text-2xl leading-relaxed mb-4 font-light italic">
                    "This journey from heritage to growth is the fruit of our
                    collective efforts."
                  </p>
                  <p className="text-[#c9c3ff] text-sm sm:text-base border-l-2 border-[#6c63ff] pl-4">
                    For fifteen years, UTKARSH has been the crown jewel of BBD
                    University's cultural calendar.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {quickStats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-linear-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90 backdrop-blur-xl p-5 rounded-xl border border-white/20 text-center"
                >
                  <div className="text-[#c9c3ff] mb-1">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#c9c3ff]">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Date and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-linear-to-br from-[#241f4a]/90 to-[#2b255f]/90 backdrop-blur-xl p-5 rounded-xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-[#6c63ff] to-[#5b54e6] rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#c9c3ff] mb-1">
                      MARK YOUR CALENDAR
                    </p>
                    <p className="text-[#e4e1ff] text-base sm:text-lg font-semibold">
                      Feb 26-28, 2026
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-[#2b255f]/90 to-[#241f4a]/90 backdrop-blur-xl p-5 rounded-xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-[#5b54e6] to-[#6c63ff] rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#c9c3ff] mb-1">VENUE</p>
                    <p className="text-[#e4e1ff] text-base sm:text-lg font-semibold">
                      BBD University, Lucknow
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div
          className={`
            mb-20
            transition-all duration-700 delay-600
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-300 mb-3">
              The Journey
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              15 years of evolution
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTimeline((prev) =>
                  prev > 0 ? prev - 1 : historyData.length - 1,
                );
                setIsPlaying(false);
              }}
              className="p-2 bg-purple-900/50 rounded-lg hover:bg-purple-800/60 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-purple-300 rotate-180" />
            </button>

            <button
              onClick={handlePlayClick}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all cursor-pointer ${
                isPlaying
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-900/50 hover:bg-purple-800/60"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-300 text-sm">Play</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTimeline((prev) => (prev + 1) % historyData.length);
                setIsPlaying(false);
              }}
              className="p-2 bg-purple-900/50 rounded-lg hover:bg-purple-800/60 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-purple-300" />
            </button>
          </div>

          <div className="text-center mb-4">
            <span className="text-sm text-purple-300">
              Year {activeTimeline + 1} of {historyData.length}
            </span>
          </div>

          <div className="bg-purple-900/20 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-purple-500/30">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-1/3">
                <div
                  className={`bg-linear-to-br ${historyData[activeTimeline].color} p-6 rounded-xl text-center`}
                >
                  <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                    {historyData[activeTimeline].year}
                  </div>
                  <div className="text-white/90 text-sm sm:text-base mb-3">
                    {historyData[activeTimeline].era}
                  </div>
                  <div className="text-4xl">
                    {historyData[activeTimeline].image}
                  </div>
                </div>
              </div>

              <div className="lg:w-2/3">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {historyData[activeTimeline].title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  {historyData[activeTimeline].desc}
                </p>

                <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 mb-4">
                  {Object.entries(historyData[activeTimeline].stats).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="bg-purple-900/30 p-3 rounded-lg"
                      >
                        <div className="text-lg sm:text-xl font-bold text-white">
                          {value}
                        </div>
                        <div className="text-xs text-purple-300 capitalize">
                          {key}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div>
                  <h4 className="text-purple-300 font-semibold flex items-center gap-2 text-sm sm:text-base mb-2">
                    <Award className="w-4 h-4" /> Key Milestones
                  </h4>
                  <div className="space-y-1">
                    {historyData[activeTimeline].achievements.map(
                      (achievement, idx) => (
                        <p
                          key={idx}
                          className="text-gray-400 text-xs sm:text-sm"
                        >
                          • {achievement}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {historyData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTimeline(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  activeTimeline === idx
                    ? "w-8 bg-purple-500"
                    : "w-2 bg-purple-900 hover:bg-purple-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Highlights Section */}
        <div
          className={`
            mb-20
            transition-all duration-700 delay-800
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-300 mb-4">
              Key Pillars
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              The foundation of our legacy
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-linear-to-br from-[#241f4a]/90 to-[#2b255f]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20"
              >
                <div
                  className={`w-16 h-16 bg-linear-to-br ${item.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quotes Section */}
        <div
          className={`
            mb-20
            transition-all duration-700 delay-900
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-300 mb-3">
              Voices of UTKARSH
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Wisdom that defines our journey
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="bg-linear-to-br from-[#241f4a]/90 to-[#2b255f]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center"
              >
                <div className="text-4xl text-purple-400 mb-4">❝</div>
                <p className="text-xl text-white mb-4">"{quote.text}"</p>
                <p className="text-gray-400 text-sm">— {quote.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`
            relative
            transition-all duration-700 delay-1000
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="bg-linear-to-br from-purple-900/50 to-pink-900/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Gem className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              From Heritage to Growth
            </h2>

            <p className="text-xl sm:text-2xl text-transparent bg-clip-text bg-linear-to-r from-purple-200 to-pink-200 mb-3">
              15 Years of Excellence
            </p>

            <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
              Be part of the legacy. Where your story becomes part of our
              history.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/sponsorship_form")}
                className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm sm:text-base cursor-pointer"
              >
                Become a Sponsor
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 border-2 border-purple-500 text-purple-300 font-semibold rounded-xl hover:bg-purple-500/10 transition-all text-sm sm:text-base cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default AboutSection;
