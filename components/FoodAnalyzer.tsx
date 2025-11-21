import React, { useState, useRef } from 'react';
import { analyzeFoodImage, analyzeFoodText } from '../services/geminiService';
import { FoodAnalysis, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { Camera, Upload, Activity, CheckCircle2, Leaf, AlertCircle, Loader2, Utensils, FileText, Search } from 'lucide-react';

interface FoodAnalyzerProps {
  language: Language;
  onCreateRecipe: (ingredients: string) => void;
}

const FoodAnalyzer: React.FC<FoodAnalyzerProps> = ({ language, onCreateRecipe }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [userContext, setUserContext] = useState<string>('');
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = TRANSLATIONS[language].analyzer;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      // Simple mime type check
      if (!file.type.startsWith('image/')) {
        setError(t.errorValidImage);
        return;
      }
      
      setMimeType(file.type);
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setAnalysis(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !userContext.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (selectedImage) {
        // Image based analysis
        const base64Data = selectedImage.split(',')[1];
        result = await analyzeFoodImage(base64Data, mimeType, language, userContext);
      } else {
        // Text based analysis
        result = await analyzeFoodText(userContext, language);
      }
      
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(t.errorAnalyze);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setUserContext('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amazigh-blue mb-2">{t.title}</h2>
        <p className="text-stone-600">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Image Upload */}
          <div 
            className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-all overflow-hidden relative
              ${selectedImage ? 'border-amazigh-green bg-stone-900' : 'border-stone-300 bg-white hover:bg-stone-50'}`}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="h-full w-full object-contain" />
                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="bg-blue-50 text-amazigh-blue p-4 rounded-full inline-block mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="text-stone-600 font-medium mb-2">{t.uploadPrompt}</p>
                <p className="text-stone-400 text-sm">{t.supportText}</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="text-center text-stone-400 text-sm font-bold uppercase tracking-widest">
             - OR -
          </div>

          {/* User Input Text Area */}
          <div className={`bg-white p-1 rounded-lg border transition-all ${!selectedImage ? 'border-amazigh-blue ring-1 ring-amazigh-blue shadow-sm' : 'border-stone-300'}`}>
             <div className="px-3 py-2 border-b border-stone-100 flex items-center gap-2 text-stone-500 text-sm font-medium">
                <FileText size={14} />
                {t.labelContext}
             </div>
             <textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder={t.placeholderContext}
                className="w-full p-3 min-h-[80px] outline-none resize-none text-sm text-stone-700 bg-transparent"
             />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={(!selectedImage && !userContext.trim()) || loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md
              ${(!selectedImage && !userContext.trim()) || loading
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-amazigh-blue hover:bg-blue-800 hover:-translate-y-0.5'}`}
          >
             {loading ? <Loader2 className="animate-spin" /> : <><Search className="w-5 h-5" /> {t.btnAnalyze}</>}
          </button>
          
          {error && <p className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[300px] relative flex flex-col">
          {!analysis && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center flex-grow">
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <p>{t.emptyState}</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-amazigh-blue flex-grow">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="animate-pulse font-medium">{t.processing}</p>
            </div>
          )}

          {analysis && (
            <div className="animate-fade-in space-y-6 flex-grow">
              <div>
                <h3 className="text-2xl font-bold text-stone-800 font-serif">{analysis.dishName}</h3>
                <p className="text-stone-600 text-sm mt-1">{analysis.description}</p>
              </div>

              <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-lg">
                <div className="flex-1 text-center border-r border-stone-200">
                  <span className="block text-xs font-bold uppercase text-stone-400">{t.calories}</span>
                  <span className="text-xl font-bold text-amazigh-red">{analysis.estimatedCalories}</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="block text-xs font-bold uppercase text-stone-400">{t.healthScore}</span>
                  <span className={`text-xl font-bold ${analysis.healthRating >= 7 ? 'text-green-600' : analysis.healthRating >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {analysis.healthRating}/10
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" /> {t.ingredients}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.mainIngredients.map((ing, i) => (
                    <span key={i} className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                 <h4 className="font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amazigh-blue" /> {t.tags}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.dietaryTags.map((tag, i) => (
                    <span key={i} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Create Recipe Button */}
              <div className="pt-6 mt-auto">
                <button
                  onClick={() => onCreateRecipe(analysis.mainIngredients.join(', '))}
                  className="w-full py-3 bg-gradient-to-r from-amazigh-yellow to-amazigh-red hover:shadow-lg transform hover:-translate-y-0.5 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Utensils className="w-5 h-5" />
                  {t.btnCreateFromAnalysis}
                </button>
              </div>
              
              <div className="pt-2 text-center">
                  <button 
                    onClick={handleClear}
                    className="text-stone-400 text-sm hover:text-stone-600 underline"
                  >
                    Start Over
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;