import React from 'react';
import { AppView, Language } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface HeroProps {
  onChangeView: (view: AppView) => void;
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ onChangeView, language }) => {
  const t = TRANSLATIONS[language].hero;
  const isRTL = language === 'ar';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-2xl mx-4 mt-8 mb-12">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541518763669-27fef04b14fe?q=80&w=2000&auto=format&fit=crop" 
          alt="Moroccan Spices" 
          className={`w-full h-full object-cover opacity-40 ${isRTL ? 'scale-x-[-1]' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="relative z-10 px-8 py-20 md:px-16 md:py-32 max-w-4xl">
        <div className="inline-block bg-amazigh-yellow/90 text-stone-900 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wider uppercase">
          {t.badge}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight">
          {t.titlePrefix} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amazigh-yellow to-amazigh-red">{t.titleSuffix}</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl leading-relaxed font-light">
          {t.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onChangeView(AppView.RECIPES)}
            className="px-8 py-4 bg-amazigh-red hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            {t.btnRecipe} 
            {isRTL ? <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
          <button 
            onClick={() => onChangeView(AppView.ANALYZER)}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl font-bold text-lg transition-all flex items-center justify-center"
          >
            {t.btnAnalyze}
          </button>
        </div>
      </div>

      {/* Decorative Tifinagh Symbol (Abstract) */}
      <div className={`absolute bottom-[-20px] ${isRTL ? 'left-[-20px]' : 'right-[-20px]'} text-white/5 text-[200px] font-bold leading-none pointer-events-none select-none`}>
        ⵣ
      </div>
    </div>
  );
};

export default Hero;