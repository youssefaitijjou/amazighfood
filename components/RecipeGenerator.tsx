import React, { useState, useEffect, useRef } from 'react';
import { generateRecipe, generateFoodImage, generateRecipeAudio } from '../services/geminiService';
import { Recipe, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { ChefHat, Clock, Users, Flame, Utensils, Loader2, Image as ImageIcon, Share2, Check, Volume2, Square, Pause } from 'lucide-react';

interface RecipeGeneratorProps {
  language: Language;
  initialIngredients?: string;
}

// Helper for base64 to Uint8Array
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper for PCM to AudioBuffer
function pcmToAudioBuffer(data: Uint8Array, ctx: AudioContext, sampleRate: number = 24000) {
    const pcm16 = new Int16Array(data.buffer);
    const frameCount = pcm16.length;
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        // Convert Int16 to Float32 [-1.0, 1.0]
        channelData[i] = pcm16[i] / 32768.0;
    }
    return buffer;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ language, initialIngredients }) => {
  const [ingredients, setIngredients] = useState(initialIngredients || '');
  const [preferences, setPreferences] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Audio state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [cachedAudio, setCachedAudio] = useState<string | null>(null);
  const [pausedAt, setPausedAt] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  const t = TRANSLATIONS[language].recipe;

  useEffect(() => {
    if (initialIngredients) {
      setIngredients(initialIngredients);
    }
  }, [initialIngredients]);

  // Reset audio if recipe changes
  useEffect(() => {
    cleanupAudio();
    setCachedAudio(null);
    setPausedAt(0);
    setStartedAt(0);
    audioBufferRef.current = null;
  }, [recipe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  const cleanupAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.onended = null;
        audioSourceRef.current.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const handlePause = () => {
    if (audioSourceRef.current && audioCtxRef.current) {
      // Calculate elapsed time since last start
      const elapsed = audioCtxRef.current.currentTime - startedAt;
      setPausedAt((prev) => prev + elapsed);

      try {
        // Remove onended so we don't reset pausedAt to 0
        audioSourceRef.current.onended = null;
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudioData = (base64Data: string) => {
    try {
      // Ensure context exists and is not closed
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Decode into buffer only if needed
      if (!audioBufferRef.current) {
        const bytes = base64ToUint8Array(base64Data);
        audioBufferRef.current = pcmToAudioBuffer(bytes, audioCtxRef.current, 24000);
      }
      
      const buffer = audioBufferRef.current!;

      // If we previously finished (or are at the end), reset to start
      let startOffset = pausedAt;
      if (startOffset >= buffer.duration - 0.1) {
        startOffset = 0;
        setPausedAt(0);
      }
      
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      
      source.onended = () => {
        // Natural finish
        setIsPlaying(false);
        setPausedAt(0); 
        setStartedAt(0);
        audioSourceRef.current = null;
      };

      audioSourceRef.current = source;
      setStartedAt(audioCtxRef.current.currentTime);
      
      // Start playing from the stored offset
      source.start(0, startOffset);
      setIsPlaying(true);
    } catch (e) {
      console.error("Playback failed", e);
      setIsPlaying(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setError(null);
    setRecipe(null);
    setImageLoading(false);
    setCopied(false);
    // Audio state is reset by the useEffect([recipe])

    try {
      // 1. Generate Text Recipe
      const result = await generateRecipe(ingredients, preferences, language);
      setRecipe(result);
      setLoading(false);

      // 2. Generate Image based on the result
      setImageLoading(true);
      try {
        const imagePrompt = `${result.title}, ${result.cuisineType} cuisine. ${result.description}`;
        const imageUrl = await generateFoodImage(imagePrompt);
        if (imageUrl) {
          setRecipe(prev => prev ? { ...prev, imageUrl } : null);
        }
      } catch (imgErr) {
        console.error("Image generation failed", imgErr);
      } finally {
        setImageLoading(false);
      }

    } catch (err) {
      setError(t.error);
      console.error(err);
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!recipe) return;

    const ingredientsList = recipe.ingredients.map(i => `- ${i.amount} ${i.name}`).join('\n');
    const stepsList = recipe.steps.map(s => `${s.stepNumber}. ${s.instruction}`).join('\n');
    
    const shareText = `${recipe.title} (${recipe.cuisineType})
    
${recipe.description}

${t.ingredients}:
${ingredientsList}

${t.instructions}:
${stepsList}

${t.nutrition}:
${t.calories}: ${recipe.nutritionalInfo.calories} | ${t.protein}: ${recipe.nutritionalInfo.protein}

Generated by AmazighFood AI`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleListen = async () => {
    if (isPlaying) {
      handlePause();
      return;
    }

    if (!recipe || audioLoading) return;

    // If we have cached audio, play (resume) it immediately
    if (cachedAudio) {
      playAudioData(cachedAudio);
      return;
    }

    setAudioLoading(true);

    try {
      // Prepare detailed text for reading
      const ingredientsList = recipe.ingredients.map(i => `${i.amount} ${i.name}`).join(', ');
      const stepsList = recipe.steps.map(s => `Step ${s.stepNumber}: ${s.instruction}`).join('. ');

      const textToRead = `
        ${recipe.title}.
        ${recipe.description}.
        Ingredients: ${ingredientsList}.
        Instructions: ${stepsList}.
      `;
      
      const audioData = await generateRecipeAudio(textToRead);
      
      if (audioData) {
        setCachedAudio(audioData);
        playAudioData(audioData);
      }
    } catch (e) {
      console.error("Failed to generate audio", e);
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amazigh-earth mb-2">{t.title}</h2>
        <p className="text-stone-600">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-amazigh-yellow">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">{t.labelIngredients}</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={t.placeholderIngredients}
              className="w-full p-3 border border-stone-600 rounded-lg focus:ring-2 focus:ring-amazigh-yellow focus:border-transparent min-h-[100px] bg-stone-800 text-white placeholder:text-stone-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">{t.labelPreferences}</label>
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder={t.placeholderPreferences}
              className="w-full p-3 border border-stone-600 rounded-lg focus:ring-2 focus:ring-amazigh-yellow focus:border-transparent bg-stone-800 text-white placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !ingredients.trim()}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
              ${loading || !ingredients.trim() 
                ? 'bg-stone-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amazigh-red to-amazigh-earth hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {loading ? <><Loader2 className="animate-spin" /> {t.processing}</> : <><ChefHat /> {t.btnGenerate}</>}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {recipe && (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up relative">
          
          {/* Generated Image Section */}
          <div className="relative w-full h-64 md:h-80 bg-stone-100">
            {recipe.imageUrl ? (
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover animate-fade-in"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-200">
                {imageLoading ? (
                   <>
                    <Loader2 className="w-10 h-10 animate-spin mb-2 text-amazigh-sand" />
                    <span className="text-sm font-semibold animate-pulse text-amazigh-earth">{t.generatingImage}</span>
                   </>
                ) : (
                  <ImageIcon className="w-12 h-12 opacity-20" />
                )}
              </div>
            )}
            
            {/* Action Buttons Container */}
            <div className="absolute -bottom-6 right-6 flex gap-4 z-20">
              
              {/* Listen Button */}
              <button 
                onClick={handleListen}
                disabled={audioLoading}
                className={`bg-white text-stone-900 p-4 rounded-full shadow-xl transition-all hover:scale-110 hover:shadow-2xl flex items-center justify-center group
                  ${isPlaying ? 'ring-2 ring-amazigh-red ring-offset-2' : ''}`}
                title={isPlaying ? "Pause" : pausedAt > 0 ? "Resume" : t.btnListen}
              >
                {audioLoading ? (
                  <Loader2 className="w-6 h-6 text-amazigh-blue animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 text-amazigh-red fill-current" />
                ) : (
                  <Volume2 className={`w-6 h-6 ${pausedAt > 0 ? 'text-amazigh-red' : 'text-amazigh-blue'} group-hover:text-amazigh-red transition-colors`} />
                )}
              </button>

              {/* Share Button */}
              <button 
                onClick={handleShare}
                className="bg-white text-stone-900 p-4 rounded-full shadow-xl transition-all hover:scale-110 hover:rotate-6 hover:shadow-2xl flex items-center justify-center group"
                title={t.btnShare}
              >
                {copied ? <Check className="w-6 h-6 text-green-600" /> : <Share2 className="w-6 h-6 text-amazigh-blue group-hover:text-amazigh-red transition-colors" />}
              </button>
            </div>
            
            {copied && (
              <div className="absolute bottom-4 right-6 bg-stone-900/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-xl animate-fade-in z-20 whitespace-nowrap">
                {t.copied}
              </div>
            )}
          </div>

          <div className="bg-amazigh-earth text-white p-6 pt-10">
            <div className="flex justify-between items-start">
              <div>
                 <h3 className="text-2xl font-bold font-serif mb-1">{recipe.title}</h3>
                 <span className="inline-block bg-amazigh-yellow text-stone-900 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                   {recipe.cuisineType}
                 </span>
              </div>
            </div>
            <p className="mt-4 italic opacity-90">{recipe.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-6 bg-stone-50 border-b border-stone-200 text-center text-stone-700">
            <div className="flex flex-col items-center">
              <Clock className="w-5 h-5 text-amazigh-red mb-1" />
              <span className="text-xs font-bold uppercase text-stone-400">{t.prepTime}</span>
              <span className="font-semibold">{recipe.prepTime}</span>
            </div>
            <div className="flex flex-col items-center">
              <Flame className="w-5 h-5 text-amazigh-red mb-1" />
              <span className="text-xs font-bold uppercase text-stone-400">{t.cookTime}</span>
              <span className="font-semibold">{recipe.cookTime}</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-5 h-5 text-amazigh-red mb-1" />
              <span className="text-xs font-bold uppercase text-stone-400">{t.servings}</span>
              <span className="font-semibold">{recipe.servings}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h4 className="text-xl font-bold text-amazigh-earth flex items-center gap-2 mb-4 border-b pb-2">
                <Utensils className="w-5 h-5" /> {t.ingredients}
              </h4>
              <ul className="space-y-2 text-stone-700">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 hover:bg-stone-50 rounded">
                    <span>{ing.name}</span>
                    <span className="font-bold text-amazigh-earth">{ing.amount}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <h5 className="font-bold text-orange-800 mb-2 text-sm uppercase">{t.nutrition}</h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-orange-900">
                  <div className="flex justify-between"><span>{t.calories}:</span> <b>{recipe.nutritionalInfo.calories}</b></div>
                  <div className="flex justify-between"><span>{t.protein}:</span> <b>{recipe.nutritionalInfo.protein}</b></div>
                  <div className="flex justify-between"><span>{t.carbs}:</span> <b>{recipe.nutritionalInfo.carbs}</b></div>
                  <div className="flex justify-between"><span>{t.fat}:</span> <b>{recipe.nutritionalInfo.fat}</b></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-amazigh-earth flex items-center gap-2 mb-4 border-b pb-2">
                <ChefHat className="w-5 h-5" /> {t.instructions}
              </h4>
              <div className="space-y-6">
                {recipe.steps.map((step) => (
                  <div key={step.stepNumber} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amazigh-earth text-white rounded-full flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </div>
                    <p className="text-stone-700 mt-1 leading-relaxed">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;