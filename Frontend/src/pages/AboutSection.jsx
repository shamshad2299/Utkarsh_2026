import React, { useState, useEffect, useRef } from "react";
import aboutImage from "../assets/about2.webp";
import {
  Home,
  Calendar,
  Users,
  Trophy,
  Music,
  Sparkles,
  Clock,
  Award,
  TrendingUp,
  Globe,
  PartyPopper,
  Star,
  Infinity,
  ChevronRight,
  IndianRupee,
  Palette,
  Code,
  Landmark,
  Flame,
  Gem,
  Crown,
  Play,
  Pause,
  MapPin,
  Cpu,
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
      icon: <Landmark className="w-6 h-6" />,
      image: "🌱",
      achievements: [
        "First ever cultural night",
        "Local participation only",
        "Student-organized initiative",
      ],
      bgPattern: "radial-linear(circle at 30% 40%, rgba(168,85,247,0.2), transparent 60%)",
    },
    {
      year: "2013",
      era: "The Sprout",
      title: "Towards Growth",
      desc: "Renamed to 'UTKARSH' meaning 'excellence'. Expanded to 3 days with inter-college competitions. The first trophy was introduced.",
      stats: { participants: "800", events: "15", colleges: "12" },
      color: "from-pink-600 to-pink-800",
      icon: <TrendingUp className="w-6 h-6" />,
      image: "🌿",
      achievements: [
        "First inter-college fest",
        "Introduction of trophies",
        "3-day format established",
      ],
      bgPattern: "linear-linear(45deg, rgba(236,72,153,0.15) 0%, transparent 70%)",
    },
    {
      year: "2015",
      era: "The Blossom",
      title: "Gaining Recognition",
      desc: "UTKARSH became Lucknow's most anticipated college fest. Celebrity judges, workshops, and the first EDM night drew crowds of 2000+.",
      stats: { participants: "2000", events: "30", colleges: "25" },
      color: "from-blue-600 to-blue-800",
      icon: <Crown className="w-6 h-6" />,
      image: "🌸",
      achievements: [
        "First celebrity appearance",
        "EDM night introduced",
        "City-wide recognition",
      ],
      bgPattern: "radial-linear(ellipse at 70% 50%, rgba(59,130,246,0.2), transparent 70%)",
    },
    {
      year: "2017",
      era: "The Expansion",
      title: "Growth & Expansion",
      desc: "Recognized as the largest fest in Uttar Pradesh. Technical events joined cultural ones. Prize pool crossed ₹1 lakh.",
      stats: { participants: "3500", events: "45", colleges: "50" },
      color: "from-cyan-600 to-cyan-800",
      icon: <Globe className="w-6 h-6" />,
      image: "🌳",
      achievements: [
        "Technical + Cultural fusion",
        "₹1L+ prize pool",
        "State-level recognition",
      ],
      bgPattern: "repeating-linear-linear(45deg, rgba(6,182,212,0.1) 0px, rgba(6,182,212,0.1) 10px, transparent 10px, transparent 20px)",
    },
    {
      year: "2019",
      era: "The Pride",
      title: "Decade Celebration",
      desc: "10th Anniversary celebration. Pan-North India participation with 5000+ attendees. Introduced gaming arena and fashion show.",
      stats: { participants: "5000", events: "60", colleges: "85" },
      color: "from-indigo-600 to-indigo-800",
      icon: <Gem className="w-6 h-6" />,
      image: "🎪",
      achievements: [
        "10th Anniversary",
        "Gaming arena launch",
        "North India coverage",
      ],
      bgPattern: "radial-linear(circle at 20% 80%, rgba(99,102,241,0.2), transparent 70%)",
    },
    {
      year: "2021",
      era: "The Resilience",
      title: "Digital Evolution",
      desc: "Pandemic didn't stop us! First hybrid fest with online events reaching 10,000+ digital participants.",
      stats: { participants: "10000", events: "75", colleges: "120" },
      color: "from-violet-600 to-violet-800",
      icon: <Globe className="w-6 h-6" />,
      image: "💻",
      achievements: ["Hybrid format", "10K+ digital reach", "Innovation award"],
      bgPattern: "linear-linear(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 50%, transparent 100%)",
    },
    {
      year: "2023",
      era: "The Return",
      title: "Grand Comeback",
      desc: "Grand physical return with 3-day extravaganza. National artists, 90+ events, and the biggest production value yet.",
      stats: { participants: "7500", events: "90", colleges: "150" },
      color: "from-fuchsia-600 to-fuchsia-800",
      icon: <PartyPopper className="w-6 h-6" />,
      image: "🎊",
      achievements: ["National artists", "90+ events", "Record participation"],
      bgPattern: "radial-linear(circle at 80% 30%, rgba(232,121,249,0.2), transparent 60%)",
    },
    {
      year: "2025",
      era: "The Innovation Era",
      title: "Tech Meets Tradition",
      desc: "UTKARSH 2025 embraced technology-driven experiences. AI-powered registrations, digital ticketing, immersive LED stages, and tech-cultural fusion defined the future-forward vision of the fest.",
      stats: { participants: "9000", events: "95", colleges: "180" },
      color: "from-blue-700 to-cyan-600",
      icon: <Cpu className="w-6 h-6" />,
      image: "🤖",
      achievements: [
        "AI-powered systems",
        "Fully digital registrations",
        "Tech-cultural fusion theme",
      ],
      bgPattern: "repeating-radial-linear(circle at 50% 50%, rgba(59,130,246,0.1) 0px, rgba(59,130,246,0.1) 5px, transparent 5px, transparent 15px)",
    },
    {
      year: "2026",
      era: "Virasat Se Vikas Tak",
      title: "15 Years of Excellence",
      desc: "UTKARSH'26 celebrates 15 glorious years under the theme 'Virasat Se Vikas Tak'. Honoring our cultural legacy while embracing progressive growth, this edition reflects the journey from tradition to transformation.",
      stats: { participants: "10000+", events: "100+", colleges: "200+" },
      color: "from-purple-700 to-orange-500",
      icon: <Flame className="w-6 h-6" />,
      image: "💎",
      achievements: [
        "15 Year Celebration",
        "Legacy Showcase Events",
        "Cultural + Modern Fusion",
      ],
      bgPattern: "linear-linear(90deg, rgba(168,85,247,0.15) 0%, rgba(249,115,22,0.15) 50%, rgba(168,85,247,0.15) 100%)",
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
      color: "from-amber-500 to-purple-600",
      bgFrom: "from-amber-500/50",
      bgTo: "to-purple-600/50",
      pattern: "repeating-linear-linear(45deg, rgba(168,85,247,0.2) 0px, rgba(168,85,247,0.2) 2px, transparent 2px, transparent 10px)",
      rotation: "group-hover:rotate-y-6",
    },
    {
      text: "Growth is our goal",
      author: "Modern Vision",
      icon: "📈",
      color: "from-blue-500 to-pink-600",
      bgFrom: "from-blue-500/50",
      bgTo: "to-pink-500/50",
      pattern: "radial-linear(circle at 30% 40%, rgba(236,72,153,0.3) 0%, transparent 30%)",
      rotation: "group-hover:-rotate-y-6",
    },
    {
      text: "From Heritage to Growth",
      author: "UTKARSH'26",
      icon: "⚡",
      color: "from-purple-500 via-pink-500 to-orange-500",
      bgFrom: "from-purple-500/50",
      bgTo: "to-orange-500/50",
      pattern: "linear-linear(90deg, transparent 0%, rgba(168,85,247,0.2) 25%, rgba(236,72,153,0.2) 50%, rgba(249,115,22,0.2) 75%, transparent 100%)",
      rotation: "group-hover:rotate-x-6",
    },
  ];

  const quickStats = [
    { value: "15", label: "Years", icon: <Calendar className="w-3 h-3" /> },
    { value: "100+", label: "Events", icon: <Trophy className="w-3 h-3" /> },
    { value: "10K+", label: "Artists", icon: <Users className="w-3 h-3" /> },
    { value: "∞", label: "Memories", icon: <Infinity className="w-3 h-3" /> },
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
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-linear(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      </div>

      {/* Scroll Control Button */}
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <button
          onClick={isScrolling ? stopSlowScroll : startSlowScroll}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all text-sm sm:text-base"
        >
          {isScrolling ? (
            <>
              <Pause className="w-4 h-4" />
              <span className="hidden sm:inline">Stop</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Start Journey</span>
            </>
          )}
        </button>
      </div>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 right-4 z-50 p-2.5 sm:p-3 bg-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl hover:bg-purple-800/60 transition-all"
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
      </button>

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
            <span className="milonga text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
              UTKARSH
            </span>
          </h1>

          <div className="inline-block px-6 py-2 sm:px-8 sm:py-3 bg-purple-900/30 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              2026
            </p>
          </div>

          <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto">
            "From Heritage to Growth — 15 Years of Excellence"
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-10 lg:mb-10">
          {/* Image */}
          <div
            className={`
              relative group
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
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-sm:-bottom-1">
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
            <div className="relative group perspective-2000">
              <div className="absolute -inset-1 bg-linear-to-r from-[#6c63ff] via-[#5b54e6] to-[#4a42d4] rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
              <div className="relative bg-linear-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 transform-3d rotate-x-2 group-hover:rotate-x-0 transition-all duration-700 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-linear(circle at 20px 20px, rgba(108,99,255,0.2) 2px, transparent 2px)`,
                      backgroundSize: "40px 40px",
                    }}
                  ></div>
                </div>

                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-[#6c63ff]/30 rounded-full"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float-particle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="absolute top-0 left-0 w-20 h-20">
                  <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-[#6c63ff] rounded-tl-3xl"></div>
                  <div className="absolute top-2 left-2 w-4 h-4 bg-[#6c63ff]/30 rounded-full animate-ping-slow"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20">
                  <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-[#5b54e6] rounded-br-3xl"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#5b54e6]/30 rounded-full animate-ping-slow"></div>
                </div>

                <div className="relative flex gap-6 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-linear-to-r from-[#6c63ff] to-[#5b54e6] rounded-full blur-xl"></div>
                    <div className="relative w-16 h-16 bg-linear-to-br from-[#6c63ff] to-[#5b54e6] rounded-2xl rotate-12 transform hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                      <span className="text-4xl text-white font-serif transform -rotate-12">❝</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#6c63ff] rounded-full animate-ping-slow"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-[#5b54e6] rounded-full animate-ping-slow"></div>
                  </div>

                  <div className="flex-1">
                    <p className="text-[#e4e1ff] text-lg sm:text-xl md:text-2xl leading-relaxed mb-4 font-light italic relative">
                      <span className="relative inline-block">
                        "This journey from heritage to growth is the fruit of our collective efforts."
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-[#6c63ff] via-[#5b54e6] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></span>
                      </span>
                    </p>
                    <p className="text-[#c9c3ff] text-sm sm:text-base relative pl-4 border-l-2 border-[#6c63ff]">
                      For fifteen years, UTKARSH has been the crown jewel of BBD University's cultural calendar.
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1">
                  <div
                    className="h-full bg-linear-to-r from-[#6c63ff] via-[#5b54e6] to-[#4a42d4]"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {quickStats.map((stat, i) => (
                <div
                  key={i}
                  className="relative group perspective-1000"
                >
                  <div className="absolute -inset-0.5 bg-linear-to-r from-[#6c63ff] to-[#5b54e6] rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative bg-linear-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90 backdrop-blur-xl p-5 rounded-xl border border-white/20 overflow-hidden transform-3d group-hover:rotate-y-5 transition-all duration-500">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-linear(circle at ${20 + i * 20}% ${30 + i * 10}%, rgba(108,99,255,0.3), transparent 70%)`,
                        }}
                      ></div>
                    </div>

                    <div className="relative mb-3 flex justify-center">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 bg-linear-to-r from-[#6c63ff] to-[#5b54e6] rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-[#c9c3ff] group-hover:text-white group-hover:scale-110 transition-all duration-300 transform group-hover:rotate-12">
                            {stat.icon}
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#6c63ff] rounded-full animate-ping-slow"></div>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold text-center mb-1">
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-[#e4e1ff] to-[#c9c3ff] group-hover:from-white group-hover:to-[#e4e1ff] transition-all duration-500">
                        {stat.value}
                      </span>
                    </div>

                    <div className="text-xs text-center relative">
                      <span className="text-[#c9c3ff] group-hover:text-white transition-colors duration-300 relative">
                        {stat.label}
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-linear-to-r from-[#6c63ff] to-transparent transition-all duration-300"></span>
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-0.5">
                      <div className="h-full bg-linear-to-r from-[#6c63ff] via-[#5b54e6] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Date and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative group perspective-1500">
                <div className="absolute -inset-0.5 bg-linear-to-r from-[#6c63ff] to-[#5b54e6] rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                <div className="relative bg-linear-to-br from-[#241f4a]/90 to-[#2b255f]/90 backdrop-blur-xl p-5 rounded-xl border border-white/20 overflow-hidden transform-3d group-hover:rotate-x-5 transition-all duration-500">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "radial-linear(circle at 30% 50%, rgba(108,99,255,0.2), transparent 70%)",
                      }}
                    ></div>
                  </div>

                  <div className="relative flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-linear-to-r from-[#6c63ff] to-[#5b54e6] rounded-xl blur-md group-hover:blur-xl transition-all duration-500"></div>
                      <div className="relative w-14 h-14 bg-linear-to-br from-[#6c63ff] to-[#5b54e6] rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4">
                        <div className="absolute inset-0 border-2 border-[#6c63ff] rounded-full animate-ping-slow"></div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-[#c9c3ff] mb-1 tracking-wider">MARK YOUR CALENDAR</p>
                      <p className="text-[#e4e1ff] text-base sm:text-lg font-semibold relative">
                        Feb 26-28, 2026
                        <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-linear-to-r from-[#6c63ff] to-[#5b54e6] transition-all duration-700"></span>
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                      <div className="w-full h-full border-t-2 border-r-2 border-[#6c63ff]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group perspective-1500">
                <div className="absolute -inset-0.5 bg-linear-to-r from-[#5b54e6] to-[#6c63ff] rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                <div className="relative bg-linear-to-br from-[#2b255f]/90 to-[#241f4a]/90 backdrop-blur-xl p-5 rounded-xl border border-white/20 overflow-hidden transform-3d group-hover:rotate-x-5 transition-all duration-500">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "radial-linear(circle at 70% 50%, rgba(91,84,230,0.2), transparent 70%)",
                      }}
                    ></div>
                  </div>

                  <div className="relative flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-linear-to-r from-[#5b54e6] to-[#6c63ff] rounded-xl blur-md group-hover:blur-xl transition-all duration-500"></div>
                      <div className="relative w-14 h-14 bg-linear-to-br from-[#5b54e6] to-[#6c63ff] rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4">
                        <div className="absolute inset-0 border-2 border-[#5b54e6] rounded-full animate-ping-slow"></div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-[#c9c3ff] mb-1 tracking-wider">VENUE</p>
                      <p className="text-[#e4e1ff] text-base sm:text-lg font-semibold relative">
                        BBD University, Lucknow
                        <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-linear-to-r from-[#5b54e6] to-[#6c63ff] transition-all duration-700"></span>
                      </p>
                    </div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                      <div className="w-full h-full border-b-2 border-l-2 border-[#5b54e6]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 w-40 h-40 pointer-events-none">
              <div className="absolute inset-0 bg-linear-to-r from-[#6c63ff]/20 to-[#5b54e6]/20 rounded-full blur-3xl animate-float"></div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 pointer-events-none">
              <div className="absolute inset-0 bg-linear-to-r from-[#5b54e6]/20 to-[#6c63ff]/20 rounded-full blur-3xl animate-float-delayed"></div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div
          className={`
            mb-20 lg:mb-24
            transition-all duration-700 delay-600
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-300 mb-3 ">
              The Journey
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">15 years of evolution</p>
          </div>

          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTimeline((prev) => (prev > 0 ? prev - 1 : historyData.length - 1));
                setIsPlaying(false);
              }}
              className="p-2 bg-purple-900/50 rounded-lg hover:bg-purple-800/60 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-purple-300 rotate-180" />
            </button>

            <button
              onClick={handlePlayClick}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                isPlaying
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-900/50 hover:bg-purple-800/60"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Pause Slides</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-300 text-sm">Play Slides</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTimeline((prev) => (prev + 1) % historyData.length);
                setIsPlaying(false);
              }}
              className="p-2 bg-purple-900/50 rounded-lg hover:bg-purple-800/60 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-purple-300" />
            </button>
          </div>

          <div className="text-center mb-4">
            <span className="text-sm text-purple-300">
              Year {activeTimeline + 1} of {historyData.length}
            </span>
          </div>

          <div className="bg-purple-900/20 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-purple-500/30 overflow-hidden relative">
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000"
              style={{ background: historyData[activeTimeline].bgPattern }}
            ></div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-1/3">
                <div className={`bg-linear-to-br ${historyData[activeTimeline].color} p-6 rounded-xl text-center`}>
                  <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                    {historyData[activeTimeline].year}
                  </div>
                  <div className="text-white/90 text-sm sm:text-base mb-3">
                    {historyData[activeTimeline].era}
                  </div>
                  <div className="text-4xl">{historyData[activeTimeline].image}</div>
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
                  {Object.entries(historyData[activeTimeline].stats).map(([key, value], idx) => (
                    <div 
                      key={key} 
                      className="bg-purple-900/30 p-3 rounded-lg"
                    >
                      <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
                      <div className="text-xs text-purple-300 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-purple-300 font-semibold flex items-center gap-2 text-sm sm:text-base mb-2">
                    <Award className="w-4 h-4" /> Key Milestones
                  </h4>
                  <div className="space-y-1">
                    {historyData[activeTimeline].achievements.map((achievement, idx) => (
                      <p key={idx} className="text-gray-400 text-xs sm:text-sm">• {achievement}</p>
                    ))}
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
            mb-20 lg:mb-24
            transition-all duration-700 delay-800
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-300 mb-4">
              Key Pillars
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">The foundation of our legacy</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {highlights.map((item, index) => {
              const pillarDesigns = [
                // Heritage
                {
                  bgFrom: "from-purple-600",
                  bgTo: "to-purple-800",
                  hoverRotate: "group-hover:rotate-y-6",
                  icon: <Landmark className="w-8 h-8 text-white" />,
                  pattern: "repeating-linear-linear(45deg, rgba(168,85,247,0.2) 0px, rgba(168,85,247,0.2) 4px, transparent 4px, transparent 12px)",
                  decorative: "🕉️",
                },
                // Growth
                {
                  bgFrom: "from-pink-500",
                  bgTo: "to-rose-500",
                  hoverRotate: "group-hover:-rotate-y-6",
                  icon: <TrendingUp className="w-8 h-8 text-white" />,
                  pattern: "radial-linear(circle at 30% 40%, rgba(236,72,153,0.3) 0%, transparent 30%)",
                  decorative: "📈",
                },
                // Technology
                {
                  bgFrom: "from-blue-500",
                  bgTo: "to-cyan-500",
                  hoverRotate: "group-hover:rotate-x-6",
                  icon: <Code className="w-8 h-8 text-white" />,
                  pattern: "radial-linear(circle at 2px 2px, rgba(59,130,246,0.3) 1px, transparent 1px)",
                  decorative: "⚡",
                },
                // Culture
                {
                  bgFrom: "from-cyan-500",
                  bgTo: "to-teal-500",
                  hoverRotate: "group-hover:-rotate-x-6",
                  icon: <Palette className="w-8 h-8 text-white" />,
                  pattern: "radial-linear(circle at 30% 40%, rgba(6,182,212,0.3) 0%, transparent 20%)",
                  decorative: "🎨",
                },
              ];

              return (
                <div key={index} className="relative group perspective-2000">
                  <div className={`absolute -inset-0.5 bg-linear-to-r ${pillarDesigns[index].bgFrom} ${pillarDesigns[index].bgTo} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700`}></div>
                  
                  <div className={`relative bg-linear-to-br from-[#241f4a]/90 to-[#2b255f]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 overflow-hidden transform-3d ${pillarDesigns[index].hoverRotate} group-hover:scale-105 transition-all duration-700`}>
                    
                    <div className="absolute inset-0 opacity-10" style={{ background: pillarDesigns[index].pattern }}></div>
                    
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                      <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-3 border-2 border-purple-400 rounded-full animate-spin-slow"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-indigo-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative w-16 h-16 bg-linear-to-br from-purple-600 to-indigo-700 rounded-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 flex items-center justify-center border-2 border-purple-400/30">
                          {pillarDesigns[index].icon}
                        </div>
                        
                        <div className="absolute -top-2 -right-2 w-4 h-4">
                          <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping-slow"></div>
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">{pillarDesigns[index].decorative}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 relative inline-block">
                        {item.title}
                        <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-linear-to-r from-purple-500 to-indigo-500 transition-all duration-700"></span>
                      </h3>

                      <p className="text-purple-200 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quotes Section */}
        <div
          className={`
            mb-20 lg:mb-24
            transition-all duration-700 delay-900
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-pink-300 mb-3">
              Voices of UTKARSH
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">Wisdom that defines our journey</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {quotes.map((quote, index) => (
              <div key={index} className="relative group perspective-1500">
                <div className={`absolute -inset-0.5 bg-linear-to-r ${quote.bgFrom} ${quote.bgTo} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700`}></div>
                
                <div className={`relative bg-linear-to-br from-[#241f4a]/90 to-[#2b255f]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 overflow-hidden transform-3d ${quote.rotation} group-hover:scale-105 transition-all duration-700`}>
                  
                  <div className="absolute inset-0 opacity-10" style={{ background: quote.pattern }}></div>
                  
                  <div className="absolute -right-10 -top-10 w-32 h-32 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-4 border-2 border-amber-500 rounded-full animate-spin-slow"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="relative inline-block mb-4">
                      <div className={`absolute inset-0 bg-linear-to-r ${quote.color} rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700`}></div>
                      <div className={`relative w-16 h-16 bg-linear-to-r ${quote.color} rounded-2xl transform group-hover:scale-110 transition-all duration-700 flex items-center justify-center`}>
                        <span className="text-4xl text-white font-serif">❝</span>
                      </div>
                    </div>

                    <p className="text-2xl sm:text-3xl text-white font-light italic mb-4 relative">
                      "{quote.text}"
                      <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-linear-to-r ${quote.color}`}></span>
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-6">
                      <div className={`w-8 h-8 rounded-full bg-linear-to-r ${quote.color} flex items-center justify-center`}>
                        <span className="text-white text-xs">{quote.icon}</span>
                      </div>
                      <p className="text-gray-300 text-sm">— {quote.author}</p>
                    </div>
                  </div>
                </div>
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
          {/* Main Container with 3D Perspective */}
          <div className="relative group perspective-2000">
            {/* Animated Background Layers */}
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
            
            {/* Main Card with 3D Transform */}
            <div className="relative bg-linear-to-br from-[#241f4a]/90 via-[#2b255f]/90 to-[#1b1738]/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 transform-3d group-hover:rotate-x-2 transition-all duration-700 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              
              {/* Floating Particles Background - FIXED: No animationDelay conflict */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationName: 'cta-float-particle',
                      animationDuration: `${Math.random() * 4 + 3}s`,
                      animationTimingFunction: 'linear',
                      animationIterationCount: 'infinite',
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Animated linear Orbs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-r from-pink-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>

              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-32 h-32">
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-purple-500/50 rounded-tl-3xl"></div>
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-pink-500/30 rounded-tl-xl"></div>
                <div className="absolute top-4 left-4 w-4 h-4 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-ping-slow"></div>
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32">
                <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-pink-500/50 rounded-br-3xl"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-orange-500/30 rounded-br-xl"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-linear-to-r from-pink-500 to-orange-500 rounded-full animate-ping-slow animation-delay-500"></div>
              </div>

              {/* Heritage Pattern Overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-linear(circle at 30px 30px, rgba(168,85,247,0.2) 2px, transparent 2px)`,
                  backgroundSize: '60px 60px',
                }}></div>
              </div>

              {/* Main Content */}
              <div className="relative z-10">
                {/* Animated Icon Container */}
                <div className="relative inline-block mb-8 group/icon">
                  {/* Glow Effects */}
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-2xl opacity-50 group-hover/icon:opacity-80 transition-opacity duration-700"></div>
                  
                  {/* Rotating Rings */}
                  <div className="absolute -inset-4">
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-2 border-2 border-pink-500/30 rounded-full animate-spin-slow animation-delay-500"></div>
                    <div className="absolute inset-4 border-2 border-orange-500/30 rounded-full animate-spin-slow animation-delay-1000"></div>
                  </div>

                  {/* Main Icon */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center transform group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-700">
                    <Gem className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                    
                    {/* Floating Particles */}
                    <div className="absolute -top-2 -right-2 w-4 h-4">
                      <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping-slow"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">✨</span>
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4">
                      <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping-slow animation-delay-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">💫</span>
                    </div>
                    <div className="absolute top-1/2 -right-4 w-3 h-3">
                      <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping-slow animation-delay-600"></div>
                    </div>
                  </div>
                </div>

                {/* Title with linear Animation */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative inline-block">
                  <span className="absolute inset-0 blur-2xl bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 animate-pulse-slow"></span>
                  <span className="relative text-transparent bg-clip-text bg-linear-to-r from-purple-300 via-pink-300 to-orange-300 bg-[length:200%_200%] animate-linear-x">
                    From Heritage to Growth
                  </span>
                </h2>

                {/* Decorative Line */}
                <div className="flex justify-center items-center gap-2 mb-4">
                  <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>
                  <div className="w-2 h-2 rotate-45 bg-linear-to-r from-purple-500 to-pink-500"></div>
                  <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-pink-500 to-transparent"></div>
                </div>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl text-transparent bg-clip-text bg-linear-to-r from-purple-200 to-pink-200 mb-3">
                  15 Years of Excellence
                </p>

                {/* Description with Animated Border */}
                <div className="relative max-w-2xl mx-auto mb-10">
                  <div className="absolute -inset-1 bg-linear-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-xl blur-md"></div>
                  <p className="relative text-gray-300 text-sm sm:text-base leading-relaxed px-4 py-3">
                    Be part of the legacy. Where your story becomes part of our history.
                  </p>
                  
                  {/* Animated Quote Marks */}
                  <span className="absolute -top-3 left-0 text-4xl text-purple-500/30 font-serif">"</span>
                  <span className="absolute -bottom-3 right-0 text-4xl text-pink-500/30 font-serif">"</span>
                </div>

                {/* Buttons Container */}
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  {/* Primary Button */}
                  <button
                    onClick={() => navigate("/sponsorship_form")}
                    className="relative group/btn perspective-1000 cursor-pointer"
                  >
                    <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-0 group-hover/btn:opacity-70 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl overflow-hidden transform-3d group-hover/btn:rotate-x-6 group-hover/btn:scale-105 transition-all duration-500">
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Button Content */}
                      <span className="relative text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                        Become a Sponsor
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>

                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping-slow"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-ping-slow animation-delay-300"></div>
                  </button>

                  {/* Secondary Button */}
                  <button
                    onClick={() => navigate("/register")}
                    className="relative group/btn perspective-1000 cursor-pointer"
                  >
                    <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover/btn:opacity-50 transition-opacity duration-500"></div>
                    
                    <div className="relative px-8 py-4 bg-transparent rounded-xl overflow-hidden transform-3d group-hover/btn:rotate-x-6 group-hover/btn:scale-105 transition-all duration-500 border-2 border-purple-500/50 group-hover/btn:border-pink-500">
                      {/* Background Glow */}
                      <div className="absolute inset-0 bg-linear-to-r from-purple-600/0 via-purple-600/10 to-pink-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Button Content */}
                      <span className="relative text-purple-300 group-hover/btn:text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                        Register Now
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping-slow animation-delay-600"></div>
                  </button>
                </div>

                {/* Animated Bottom Bar */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-1/3 h-0.5 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-1000"></div>
              </div>

              {/* Decorative Floating Elements */}
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-ping-slow"></div>
                <div className="absolute inset-2 border-2 border-pink-500 rounded-full animate-ping-slow animation-delay-300"></div>
              </div>

              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                <div className="absolute inset-0 border-2 border-pink-500 rounded-full animate-ping-slow animation-delay-600"></div>
                <div className="absolute inset-2 border-2 border-orange-500 rounded-full animate-ping-slow animation-delay-900"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FooterSection />

      <style jsx>{`
        @keyframes pattern-drift {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(20px) translateY(20px); }
        }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          50% { transform: translateY(-30px) translateX(10px) scale(1.5); opacity: 1; }
          100% { transform: translateY(-60px) translateX(20px) scale(0); opacity: 0; }
        }

        @keyframes cta-float-particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(50px) scale(0); opacity: 0; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes ping-slow {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(20px) scale(1.05); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes linear-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-linear-x {
          animation: linear-x 3s ease infinite;
          background-size: 200% 200%;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-900 {
          animation-delay: 900ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .perspective-1500 {
          perspective: 1500px;
        }

        .perspective-2000 {
          perspective: 2000px;
        }

        .transform-3d {
          transform-style: preserve-3d;
        }

        .rotate-x-2 {
          transform: rotateX(2deg);
        }

        .group:hover .group-hover\\:rotate-x-0 {
          transform: rotateX(0deg);
        }

        .group:hover .group-hover\\:rotate-y-6 {
          transform: rotateY(6deg);
        }

        .group:hover .group-hover\\:-rotate-y-6 {
          transform: rotateY(-6deg);
        }

        .group:hover .group-hover\\:rotate-x-6 {
          transform: rotateX(6deg);
        }

        .group:hover .group-hover\\:-rotate-x-6 {
          transform: rotateX(-6deg);
        }

        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }

        .group\\/btn:hover .group-hover\\/btn\\:rotate-x-6 {
          transform: rotateX(6deg);
        }

        .group\\/btn:hover .group-hover\\/btn\\:scale-105 {
          transform: scale(1.05);
        }

        .group\\/icon:hover .group-hover\\/icon\\:rotate-12 {
          transform: rotate(12deg);
        }
      `}</style>
    </div>
  );
};

export default AboutSection;