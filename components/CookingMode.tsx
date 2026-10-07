import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { ArrowLeft, Volume2, VolumeX, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSynth(window.speechSynthesis);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Stop speaking when step changes if auto-read is not enabled
    // For this simplified version, we just stop previous speech
    if (synth) synth.cancel();
  }, [currentStep, synth]);

  const speak = (text: string) => {
    if (!synth) return;
    
    synth.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(recipe.steps[currentStep]);
    }
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-slate-100 px-4 flex items-center justify-between bg-white">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-slate-800 truncate px-4">
          {recipe.title}
        </h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 w-full">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="max-w-2xl w-full text-center space-y-8">
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold uppercase tracking-wide">
            Step {currentStep + 1} of {recipe.steps.length}
          </span>
          
          <p className="text-3xl md:text-5xl font-medium text-slate-800 leading-tight">
            {recipe.steps[currentStep]}
          </p>

          <button 
            onClick={toggleSpeech}
            className={`
              inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all
              ${isSpeaking 
                ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-2' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            `}
          >
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-t border-slate-100 bg-slate-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          {currentStep === recipe.steps.length - 1 ? (
             <button
             onClick={onClose}
             className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
           >
             Finish
             <CheckCircle size={20} />
           </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(recipe.steps.length - 1, currentStep + 1))}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-md shadow-slate-200"
            >
              Next Step
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
