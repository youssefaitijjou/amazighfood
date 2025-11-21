import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RecipeGenerator from './components/RecipeGenerator';
import FoodAnalyzer from './components/FoodAnalyzer';
import ChatBot from './components/ChatBot';
import { AppView, Language } from './types';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { TRANSLATIONS } from './translations';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [language, setLanguage] = useState<Language>('en');
  const [prefilledIngredients, setPrefilledIngredients] = useState<string>('');

  const t = TRANSLATIONS[language].home;
  const isRTL = language === 'ar';

  // Featured plates data now comes from translations for localization
  const featuredPlatesImages = [
    "https://images.unsplash.com/photo-1627309346289-8930440f3f09?q=80&w=800&auto=format&fit=crop", // Couscous
    "https://images.unsplash.com/photo-1539136788036-1574801f4148?q=80&w=800&auto=format&fit=crop", // Tagine
    "https://images.unsplash.com/photo-1528751014936-589268171c40?q=80&w=800&auto=format&fit=crop", // Shakshouka
    "https://images.unsplash.com/photo-1565496091661-63917571002c?q=80&w=800&auto=format&fit=crop"  // Mint Tea
  ];

  const handleViewChange = (view: AppView) => {
    // Clear prefilled ingredients when navigating via header to ensure fresh state
    if (view === AppView.RECIPES) {
      setPrefilledIngredients('');
    }
    setCurrentView(view);
  };

  const handleCreateRecipeFromAnalysis = (ingredients: string) => {
    setPrefilledIngredients(ingredients);
    setCurrentView(AppView.RECIPES);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlateClick = (title: string, desc: string) => {
    setPrefilledIngredients(`${title}. ${desc}`);
    setCurrentView(AppView.RECIPES);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-800 selection:bg-amazigh-red selection:text-white">
      <Header currentView={currentView} onChangeView={handleViewChange} language={language} setLanguage={setLanguage} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {currentView === AppView.HOME && (
          <div className="animate-fade-in">
             <Hero onChangeView={handleViewChange} language={language} />
             
             {/* Feature Highlights Grid */}
             <div className="grid md:grid-cols-3 gap-8 mx-4 mb-16">
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 group">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">🍲</div>
                  <h3 className="text-xl font-bold mb-2 font-serif">{t.feat1Title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{t.feat1Desc}</p>
                </div>
                 <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">📸</div>
                  <h3 className="text-xl font-bold mb-2 font-serif">{t.feat2Title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{t.feat2Desc}</p>
                </div>
                 <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 group">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">💬</div>
                  <h3 className="text-xl font-bold mb-2 font-serif">{t.feat3Title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{t.feat3Desc}</p>
                </div>
             </div>

             {/* Featured Plates Section */}
             <div className="mx-4 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl font-bold font-serif text-stone-900">{t.platesTitle}</h2>
                    <p className="text-stone-500 mt-2">{t.platesSubtitle}</p>
                  </div>
                  <button 
                    onClick={() => handleViewChange(AppView.RECIPES)}
                    className="text-amazigh-red font-bold hover:text-red-800 flex items-center gap-1 text-sm transition-colors"
                  >
                    {t.createOwn} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {t.plates.map((plate, index) => (
                    <div 
                      key={index} 
                      onClick={() => handlePlateClick(plate.title, plate.desc)}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-stone-100 cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={featuredPlatesImages[index]} 
                          alt={plate.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-stone-800 uppercase tracking-wider shadow-sm`}>
                          {plate.tag}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif font-bold text-lg mb-2 text-stone-900 group-hover:text-amazigh-red transition-colors">{plate.title}</h3>
                        <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">{plate.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {currentView === AppView.RECIPES && (
          <div className="animate-fade-in mt-8">
            <RecipeGenerator language={language} initialIngredients={prefilledIngredients} />
          </div>
        )}

        {currentView === AppView.ANALYZER && (
          <div className="animate-fade-in mt-8">
            <FoodAnalyzer language={language} onCreateRecipe={handleCreateRecipeFromAnalysis} />
          </div>
        )}

        {currentView === AppView.CHAT && (
          <div className="animate-fade-in mt-8">
            <ChatBot language={language} />
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-stone-200 py-8 text-center text-stone-400 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4 text-stone-900 font-serif font-bold">
            <span className="text-amazigh-yellow text-xl">ⵣ</span> {TRANSLATIONS[language].common.brandName}
          </div>
          <p>© {new Date().getFullYear()} {TRANSLATIONS[language].common.brandName} Processing AI. Celebrating North African Culture & Technology.</p>
          <p className="mt-2 text-xs opacity-70">Created by Y.ait ijjou</p>
        </div>
      </footer>
    </div>
  );
};

export default App;