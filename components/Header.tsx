import React, { useState } from 'react';
import { AppView, Language } from '../types';
import { UtensilsCrossed, ChefHat, Activity, MessageCircle, Globe, ChevronDown } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface HeaderProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onChangeView, language, setLanguage }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const t = TRANSLATIONS[language].nav;
  const common = TRANSLATIONS[language].common;

  const navItems = [
    { id: AppView.HOME, label: t.home, icon: null },
    { id: AppView.RECIPES, label: t.createRecipe, icon: <UtensilsCrossed size={18} /> },
    { id: AppView.ANALYZER, label: t.foodVision, icon: <Activity size={18} /> },
    { id: AppView.CHAT, label: t.chefChat, icon: <MessageCircle size={18} /> },
  ];

  const languages: Language[] = ['en', 'fr', 'ar'];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onChangeView(AppView.HOME)}
          >
            <div className="bg-stone-900 text-amazigh-yellow p-2 rounded-lg transform transition-transform group-hover:rotate-12">
              <span className="text-2xl font-bold">ⵣ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif tracking-tight text-stone-900">
                {language === 'ar' ? 'أمازيغ' : 'Amazigh'}<span className="text-amazigh-red">{language === 'ar' ? 'فود' : 'Food'}</span>
              </h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest hidden sm:block">{common.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                    ${currentView === item.id 
                      ? 'bg-stone-900 text-white shadow-md' 
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Language Selector - Unified for all modes */}
            <div className="relative">
                <button 
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg text-xs font-bold uppercase text-stone-700 transition-colors"
                >
                    <Globe size={16} className="text-amazigh-blue" />
                    {language}
                    <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                    <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-xl border border-stone-100 py-1 z-50 animate-fade-in">
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setLanguage(lang);
                                    setIsLangOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm font-bold uppercase hover:bg-stone-50 transition-colors flex items-center justify-between
                                    ${language === lang ? 'text-amazigh-red bg-stone-50' : 'text-stone-600'}`}
                            >
                                {lang}
                                {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-amazigh-red"></div>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Menu Button (Simplified for this demo) */}
            <div className="md:hidden flex gap-2">
              {navItems.filter(i => i.id !== AppView.HOME).map(item => (
                  <button 
                    key={item.id}
                    onClick={() => onChangeView(item.id)}
                    className={`p-2 rounded-lg ${currentView === item.id ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
                  >
                    {item.icon}
                  </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;