// component/Loader/VirasatLoader.jsx
import React from 'react';


const Loader = () => {
  return (
    <div className="virasat-loader-container">
      {/* Background Pattern */}
      <div className="mandala-pattern"></div>
      
      <div className="loader-content">
        {/* Traditional Toran/Lamp Animation */}
        <div className="toran-container">
          <div className="toran-top"></div>
          <div className="toran-leaf leaf-1"></div>
          <div className="toran-leaf leaf-2"></div>
          <div className="toran-leaf leaf-3"></div>
          <div className="toran-leaf leaf-4"></div>
          <div className="toran-leaf leaf-5"></div>
        </div>

        {/* Rotating Charkha/Wheel (Symbolizing Progress) */}
        <div className="charkha-container">
          <div className="charkha">
            <div className="charkha-circle"></div>
            <div className="charkha-spoke spoke-1"></div>
            <div className="charkha-spoke spoke-2"></div>
            <div className="charkha-spoke spoke-3"></div>
            <div className="charkha-spoke spoke-4"></div>
            <div className="charkha-spoke spoke-5"></div>
            <div className="charkha-spoke spoke-6"></div>
            <div className="charkha-spoke spoke-7"></div>
            <div className="charkha-spoke spoke-8"></div>
          </div>
        </div>

        {/* Animated Text with Hindi */}
        <div className="virasat-text-container">
          <h2 className="virasat-title">
            <span className="hindi-text">विरासत से विकास तक</span>
            <span className="english-text">Virasat se Vikas Tak</span>
          </h2>
          
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>

          <div className="cultural-elements">
            <span className="element">🪔</span>
            <span className="element">🌾</span>
            <span className="element">🏛️</span>
            <span className="element">⚙️</span>
            <span className="element">🚀</span>
          </div>

          <p className="loading-subtitle">
            <span className="sanskrit">संस्कृतम् संरक्षणम् विकासम् च</span>
            <span className="meaning">Preserving Heritage, Embracing Progress</span>
          </p>
        </div>

        {/* Traditional Motifs - REPOSITIONED to avoid overlap */}
        <div className="traditional-motifs">
          <div className="motif motif-1"></div>
          <div className="motif motif-2"></div>
          <div className="motif motif-3"></div>
          <div className="motif motif-4"></div>
          <div className="motif motif-5"></div>
        </div>

        {/* Floating Elements - REPOSITIONED */}
        <div className="floating-elements">
          <div className="float-element diya">🪔</div>
          <div className="float-element lotus">🌺</div>
          <div className="float-element pot">🏺</div>
          <div className="float-element gear">⚙️</div>
          <div className="float-element rocket">🚀</div>
        </div>
      </div>
    </div>
  );
};

export default Loader;