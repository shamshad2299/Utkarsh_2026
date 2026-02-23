import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ContactPopup = ({ isOpen, onClose, eventType = "general" }) => {
  const [activeTab, setActiveTab] = useState("general");
  
 

  // Set active tab based on eventType prop
  useEffect(() => {
    if (eventType) {
      setActiveTab(eventType);
    }
  }, [eventType]);

  // Close on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // All events tabs data
  const tabs = [
    { id: "general", label: "General" },
    { id: "technical", label: "Technical" },
    { id: "cultural", label: "Cultural" },
    { id: "sports", label: "Sports" },
    { id: "literary", label: "Literary" },
    { id: "finearts", label: "Fine Arts" },
    { id: "hotel", label: "Hotel Mgmt" },
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4  bg-opacity-70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-[#241f4a] bg-opacity-90 border border-white/20 shadow-lg p-4 md:p-6 transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-3 md:mb-4 sticky top-0 bg-[#241f4a] bg-opacity-95 py-2 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-[#e4e1ff]">
            Contact Information
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
            aria-label="Close popup"
          >
            <X size={22} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Tabs - Horizontal scrolling for both mobile and desktop */}
        <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-thin pb-2 mb-3 md:mb-4 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 md:px-3 py-1.5 text-xs md:text-sm rounded-t-md whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#6c63ff] text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="space-y-3 md:space-y-4">
          {/* GENERAL CONTACT - Universal */}
          {activeTab === "general" && (
            <>
              <div className="p-3 md:p-4 bg-[#3a3763] border border-white/20 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>❓</span> For any query please contact:
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-white/70">Email</p>
                    <a 
                      href="mailto:utkarsh.dbm@bbdu.ac.in"
                      className="text-xs md:text-sm text-[#6c63ff] hover:text-[#8b7eff] transition-colors break-all cursor-pointer"
                    >
                      utkarsh.dbm@bbdu.ac.in
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Landline</p>
                    <a 
                      href="tel:05226196336"
                      className="text-xs md:text-sm text-white hover:text-[#c9c3ff] transition-colors cursor-pointer"
                    >
                      0522 6196336
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-3 md:p-4 bg-[#3a3763] border border-white/20 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>📝</span> For registration:
                </h3>
                <div>
                  <p className="text-xs text-white/70">Mobile</p>
                  <a 
                    href="tel:+917392975951"
                    className="text-xs md:text-sm text-white hover:text-[#c9c3ff] transition-colors cursor-pointer"
                  >
                    +91 7392975951
                  </a>
                </div>
              </div>
            </>
          )}

          {/* TECHNICAL CONTACT */}
          {activeTab === "technical" && (
            <>
              <div className="p-3 md:p-4 bg-[#3a3763] border border-blue-500/30 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>💻</span> Technical Event Team
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6c63ff] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                      IT
                    </div>
                    <div>
                      <p className="text-white text-sm md:text-base font-medium">Ishaan Tripathi</p>
                      <a href="tel:6307305544" className="text-xs md:text-sm text-[#6c63ff] hover:text-[#8b7eff] cursor-pointer">6307305544</a>
                    </div>
                  </div>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6c63ff] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                      AD
                    </div>
                    <div>
                      <p className="text-white text-sm md:text-base font-medium">Aditya Dash</p>
                      <a href="tel:9118784487" className="text-xs md:text-sm text-[#6c63ff] hover:text-[#8b7eff] cursor-pointer">9118784487</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-[#3a3763] bg-opacity-50 border border-white/10 rounded-md">
                <p className="text-xs md:text-sm text-[#c9c3ff] flex items-center gap-2">
                  <span>⚙️</span> For coding, robotics & technical events
                </p>
              </div>
            </>
          )}

          {/* SPORTS CONTACT */}
          {activeTab === "sports" && (
            <>
              <div className="p-3 md:p-4 bg-[#3a3763] border border-green-500/30 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>⚽</span> Sports Event Head
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6c63ff] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                      PS
                    </div>
                    <div>
                      <p className="text-white text-sm md:text-base font-medium">Priyanshu Singh</p>
                      <a href="tel:+919693614063" className="text-xs md:text-sm text-[#6c63ff] hover:text-[#8b7eff] cursor-pointer">+91 96936 14063</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-[#3a3763] bg-opacity-50 border border-white/10 rounded-md">
                <p className="text-xs md:text-sm text-[#c9c3ff] flex items-center gap-2">
                  <span>🏆</span> For all sports-related queries
                </p>
              </div>
            </>
          )}

          {/* LITERARY CONTACT */}
          {activeTab === "literary" && (
            <>
              <div className="p-3 md:p-4 bg-[#3a3763] border border-yellow-500/30 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>📚</span> Literary Team
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6c63ff] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                      DS
                    </div>
                    <div>
                      <p className="text-white text-sm md:text-base font-medium">Dhruv Saxena</p>
                      <p className="text-xs text-white/70">(Team Lead)</p>
                      <a href="tel:7985327257" className="text-xs md:text-sm text-[#6c63ff] hover:text-[#8b7eff] cursor-pointer">7985327257</a>
                    </div>
                  </div>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6c63ff] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                      SS
                    </div>
                    <div>
                      <p className="text-white text-sm md:text-base font-medium">Shudhanshu Singh</p>
                      <p className="text-xs text-white/70">(Associate Team Lead)</p>
                      <a href="tel:8528460538" className="text-xs md:text-sm text-[#6c63ff] hover:text-[#8b7eff] cursor-pointer">8528460538</a>
                    </div>
                  </div>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6c63ff] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                      KA
                    </div>
                    <div>
                      <p className="text-white text-sm md:text-base font-medium">Khushi Askari</p>
                      <p className="text-xs text-white/70">(Associate Team Lead)</p>
                      <a href="tel:9919192787" className="text-xs md:text-sm text-[#6c63ff] hover:text-[#8b7eff] cursor-pointer">9919192787</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-[#3a3763] bg-opacity-50 border border-white/10 rounded-md">
                <p className="text-xs md:text-sm text-[#c9c3ff] flex items-center gap-2">
                  <span>✍️</span> For debates, quizzes & literary events
                </p>
              </div>
            </>
          )}

          {/* FINE ARTS CONTACT - Placeholder for now */}
          {activeTab === "finearts" && (
            <>
              <div className="p-3 md:p-4 bg-[#3a3763] border border-purple-500/30 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>🎨</span> Fine Arts Team
                </h3>
                <p className="text-white/70 text-sm text-center py-4">Details will be added soon</p>
              </div>
            </>
          )}

          {/* HOTEL MANAGEMENT CONTACT - Placeholder for now */}
          {activeTab === "hotel" && (
            <>
              <div className="p-3 md:p-4 bg-[#3a3763] border border-orange-500/30 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>🏨</span> Hotel Management Team
                </h3>
                <p className="text-white/70 text-sm text-center py-4">Details will be added soon</p>
              </div>
            </>
          )}

          {/* CULTURAL CONTACT - Placeholder for now */}
          {activeTab === "cultural" && (
            <>
              <div className="p-3 md:p-4 bg-[#3a3763] border border-pink-500/30 rounded-md">
                <h3 className="text-sm md:text-base font-semibold text-[#c9c3ff] mb-2 md:mb-3 flex items-center gap-2">
                  <span>🎭</span> Cultural Team
                </h3>
                <p className="text-white/70 text-sm text-center py-4">Details will be added soon</p>
              </div>
            </>
          )}

          {/* Available Hours - Common for all */}
          <div className="p-2 md:p-3 bg-[#3a3763] bg-opacity-50 border border-white/10 rounded-md">
            <p className="text-xs md:text-sm text-[#c9c3ff] flex items-center gap-2">
              <span>⏰</span> Available: Mon-Sat, 09:00 AM - 06:00 PM
            </p>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="mt-4 md:mt-6 flex justify-end sticky bottom-0 bg-[#241f4a] bg-opacity-95 py-2">
          <button
            onClick={onClose}
            className="px-4 md:px-6 py-2 rounded-md bg-[#6c63ff] text-white text-xs md:text-sm font-semibold hover:bg-[#5b54e6] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;