import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Compass, 
  Award, 
  Trophy, 
  RefreshCw, 
  ChevronRight, 
  BookOpen, 
  ListTodo, 
  Sun, 
  Palmtree, 
  Sparkles,
  Plane,
  Bed,
  Utensils,
  Ticket,
  ShoppingBag,
  Waves,
  Eye,
  EyeOff,
  Flame,
  VolumeX,
  Volume1,
  HelpCircle
} from 'lucide-react';
import { questions, Question, Option } from './questions';

export default function App() {
  // Navigation / Mode State
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards' | 'stats'>('quiz');
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionKey, setSelectedOptionKey] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [quizHistory, setQuizHistory] = useState<{ questionId: number; selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Sound Configuration
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Interactivity Toggles (State resets per question)
  const [isQuestionTranslated, setIsQuestionTranslated] = useState<boolean>(false);
  const [translatedOptionKeys, setTranslatedOptionKeys] = useState<{ [key: string]: boolean }>({});

  // Flashcards state
  const [activeFlashcardCategory, setActiveFlashcardCategory] = useState<string>('all');
  const [flippedCardIds, setFlippedCardIds] = useState<{ [id: number]: boolean }>({});
  
  // Particle effects state
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string; speed: number }[]>([]);

  // Category Info
  const categories = {
    all: { name: 'Բոլորը / All', icon: Compass, color: 'from-sky-400 to-indigo-500' },
    airport: { name: 'Օդանավակայան / Airport', icon: Plane, color: 'from-blue-400 to-cyan-500' },
    beach: { name: 'Լողափ / Beach', icon: Waves, color: 'from-teal-400 to-emerald-500' },
    hotel: { name: 'Հյուրանոց / Hotel', icon: Bed, color: 'from-indigo-400 to-purple-500' },
    restaurant: { name: 'Ռեստորան / Restaurant', icon: Utensils, color: 'from-amber-400 to-orange-500' },
    transport: { name: 'Տրանսպորտ / Transport', icon: Ticket, color: 'from-rose-400 to-red-500' },
    shopping: { name: 'Խանութ / Shopping', icon: ShoppingBag, color: 'from-fuchsia-400 to-pink-500' }
  };

  // Safe voice loading for Speech Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Web Audio API Sound Synthesizer for beach game vibes
  const playTone = (type: 'correct' | 'incorrect' | 'click' | 'victory') => {
    if (!isSoundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'incorrect') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(147, ctx.currentTime + 0.15); // D3
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'victory') {
        osc.type = 'sine';
        const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.2);
          oscNode.start(ctx.currentTime + idx * 0.1);
          oscNode.stop(ctx.currentTime + idx * 0.1 + 0.2);
        });
      }
    } catch (e) {
      console.warn("Sound context error:", e);
    }
  };

  // Native Speech Synthesis to read Spanish sentences
  const speakSpanish = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    // Clean up Spanish text of option prefix like "A) " or "B) " and Armenian additions
    const cleanText = text.replace(/^[A-D]\)\s*/i, '').split('—')[0].trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es-ES') || voice.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Generate splash particles when getting an answer right
  const triggerParticles = () => {
    const colors = ['#fde047', '#38bdf8', '#2dd4bf', '#fb7185', '#a78bfa', '#ffffff'];
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40, // Centered range (30% to 70%)
      y: 60 + Math.random() * 20,
      size: 6 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1 + Math.random() * 4
    }));
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 2000);
  };

  // Handle Option selection
  const handleOptionClick = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerChecked) return;
    playTone('click');
    setSelectedOptionKey(key);
  };

  // Toggle option translation
  const toggleOptionTranslation = (key: 'A' | 'B' | 'C' | 'D', e: React.MouseEvent) => {
    e.stopPropagation();
    playTone('click');
    setTranslatedOptionKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle Checking Answer
  const handleCheckAnswer = () => {
    if (!selectedOptionKey || isAnswerChecked) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOptionKey === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      playTone('correct');
      triggerParticles();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
      setScore(prev => prev + 1);
    } else {
      playTone('incorrect');
      setStreak(0);
    }

    setQuizHistory(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedOptionKey,
        isCorrect
      }
    ]);
    
    setIsAnswerChecked(true);
  };

  // Reset interactive flags for next question
  const handleNextQuestion = () => {
    playTone('click');
    setIsQuestionTranslated(false);
    setTranslatedOptionKeys({});
    setSelectedOptionKey(null);
    setIsAnswerChecked(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizFinished(true);
      setActiveTab('stats');
      playTone('victory');
    }
  };

  // Restart Quiz
  const handleRestartQuiz = () => {
    playTone('click');
    setCurrentQuestionIndex(0);
    setSelectedOptionKey(null);
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setQuizHistory([]);
    setIsQuizFinished(false);
    setIsQuestionTranslated(false);
    setTranslatedOptionKeys({});
    setActiveTab('quiz');
  };

  // Flashcards flipping state helpers
  const handleCardFlip = (id: number) => {
    playTone('click');
    setFlippedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCategoryIcon = (categoryStr: string) => {
    switch (categoryStr) {
      case 'airport': return Plane;
      case 'beach': return Waves;
      case 'hotel': return Bed;
      case 'restaurant': return Utensils;
      case 'transport': return Ticket;
      case 'shopping': return ShoppingBag;
      default: return Compass;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex) / questions.length) * 100);

  // Filter flashcards by active category
  const filteredQuestions = activeFlashcardCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === activeFlashcardCategory);

  return (
    <div className="min-h-screen relative overflow-hidden vibrant-beach-bg font-sans text-slate-800 flex flex-col">
      
      {/* GLOWING SUN ACCENT */}
      <div className="sun-vibrant absolute top-[50px] right-[80px] z-0 pointer-events-none" />

      {/* FLOATING CLOUDS */}
      <div className="cloud-vibrant absolute top-[80px] left-[100px] z-0 pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="cloud-vibrant absolute top-[150px] left-[400px] z-0 pointer-events-none animate-pulse duration-[12000ms]" />

      {/* BEACH SEA WAVE EFFECT AT BOTTOM */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none overflow-hidden h-40">
        <svg className="absolute bottom-24 w-[200%] h-24 text-teal-400/30 fill-current animate-wave left-0" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1350,30 1500,60 L1500,120 L0,120 Z" />
        </svg>
        <svg className="absolute bottom-12 w-[200%] h-24 text-sky-200/40 fill-current animate-wave left-[-30px]" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ animationDelay: '1.5s' }}>
          <path d="M0,50 C180,80 320,20 480,50 C640,80 780,20 940,50 C1100,80 1240,20 1400,50 L1400,120 L0,120 Z" />
        </svg>
        <div className="absolute bottom-0 w-full h-24 bg-[#fde68a]/90 backdrop-blur-xs flex items-end justify-between px-10 pb-4">
          <span className="text-amber-800/60 text-xs font-mono flex items-center gap-1">
            <Palmtree className="w-4 h-4 text-orange-600" /> Viajes Spanish-Armenian Beach Resort
          </span>
          <span className="text-amber-800/60 text-xs font-mono">
            🍹🏖️ Let's learn Spanish!
          </span>
        </div>
      </div>

      {/* FLYING PARTICLES FOR CORRECT ANSWERS */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: `${p.x}vw`, y: '100vh', scale: 0.5 }}
            animate={{ 
              opacity: 0, 
              y: '-20vh', 
              x: `${p.x + (Math.random() * 20 - 10)}vw`,
              rotate: 360,
              scale: [0.5, 1.2, 0.2]
            }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute rounded-full flex items-center justify-center font-bold"
            style={{ 
              width: p.size, 
              height: p.size, 
              backgroundColor: p.color,
              boxShadow: `0 0 15px ${p.color}`
            }}
          >
            {p.size > 12 && '✨'}
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col z-10">
        
        {/* APP BAR HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-2xl shadow-md border-2 border-white text-white">
              <Compass className="w-7 h-7 animate-spin-slow text-amber-50" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold font-display tracking-tight text-white drop-shadow-md flex items-center gap-2">
                VIAJES <span className="text-amber-200 text-2xl font-light">| Իսպաներեն</span>
              </h1>
              <p className="text-xs text-sky-100 font-medium tracking-wide">
                Ճանապարհորդական իսպաներենի ինտերակտիվ վիկտորինա
              </p>
            </div>
          </div>

          {/* TAB & UTILITY RAIL */}
          <div className="flex items-center gap-2">
            <div className="bg-white/25 backdrop-blur-md p-1 rounded-xl flex border border-white/25">
              <button
                id="tab-quiz"
                onClick={() => { playTone('click'); setActiveTab('quiz'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === 'quiz' 
                    ? 'bg-white text-slate-950 shadow-md' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                Վիկտորինա
              </button>
              <button
                id="tab-flashcards"
                onClick={() => { playTone('click'); setActiveTab('flashcards'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === 'flashcards' 
                    ? 'bg-white text-slate-950 shadow-md' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Քարտեր
              </button>
              <button
                id="tab-stats"
                onClick={() => { playTone('click'); setActiveTab('stats'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === 'stats' 
                    ? 'bg-white text-slate-950 shadow-md' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Award className="w-4 h-4" />
                Արդյունքներ
              </button>
            </div>

            {/* SOUND TOGGLE */}
            <button
              id="sound-toggle"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? "Անջատել ձայնը / Mute" : "Միացնել ձայնը / Unmute"}
              className={`p-2.5 rounded-xl border border-white/25 backdrop-blur-md transition-all text-white hover:scale-105 active:scale-95 ${
                isSoundEnabled ? 'bg-white/25' : 'bg-red-500/30 border-red-300/30'
              }`}
            >
              {isSoundEnabled ? <Volume1 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-100" />}
            </button>
          </div>
        </header>

        {/* ACTIVE TAB DISPLAY AREA */}
        <main className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto">
          <AnimatePresence mode="wait">
            
            {/* 1. QUIZ TAB CONTAINER */}
            {activeTab === 'quiz' && !isQuizFinished && (
              <motion.div
                key="quiz-mode"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col gap-5"
              >
                
                {/* STATUS BAR & ACCURACY CHIPS */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-sm text-white">
                  <div className="flex items-center gap-3">
                    <span className="bg-sky-950/40 px-3 py-1 rounded-full text-xs font-mono font-bold border border-sky-300/20">
                      Հարց {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    <span className="flex items-center gap-1.5 bg-amber-500/30 text-amber-100 px-3 py-1 rounded-full text-xs font-bold border border-amber-300/30">
                      <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                      Սերիա՝ {streak}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium opacity-90">
                      Ճիշտ՝ <strong className="text-emerald-200">{score}</strong> / {questions.length}
                    </span>
                    <div className="h-4 w-px bg-white/20" />
                    <span className="text-xs font-mono font-medium opacity-90">
                      Ճշգրտություն՝ <strong className="text-amber-200">{currentQuestionIndex > 0 ? Math.round((score / currentQuestionIndex) * 100) : 100}%</strong>
                    </span>
                  </div>
                </div>

                {/* PROGRESS BEACH TRAIL */}
                <div className="relative bg-slate-200/90 rounded-full h-4 overflow-hidden border border-slate-300 p-0.5 shadow-inner">
                  <motion.div 
                    className="h-full bg-[#f59e0b] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Surfer/Shell Icon acting as a progress slider */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -ml-2 transition-all duration-500 pointer-events-none"
                    style={{ left: `${progressPercent}%` }}
                  >
                    <div className="bg-amber-400 p-1 rounded-full shadow-lg border border-white scale-110">
                      <Compass className="w-3.5 h-3.5 text-amber-950 animate-spin-slow" />
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE QUESTION CARD */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-300/10 to-sky-300/10 rounded-3xl blur-xl group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <motion.div
                    id={`question-card-${currentQuestion.id}`}
                    onClick={() => {
                      playTone('click');
                      setIsQuestionTranslated(!isQuestionTranslated);
                    }}
                    className={`glass-panel p-6 md:p-8 rounded-3xl shadow-xl border border-white/50 cursor-pointer relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] flex flex-col gap-4 ${
                      isQuestionTranslated ? 'ring-2 ring-amber-400/50 bg-white/85' : ''
                    }`}
                  >
                    {/* Beach category tag and tap hint */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 bg-sky-100 text-sky-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider">
                        {React.createElement(getCategoryIcon(currentQuestion.category), { className: "w-4 h-4 text-sky-600" })}
                        {currentQuestion.category}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium bg-slate-100/80 px-2.5 py-1 rounded-lg transition-colors">
                        <Languages className="w-4 h-4 text-sky-500" />
                        <span>Կտտացրեք թարգմանության համար</span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="my-2 flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-sky-700/80 uppercase font-bold tracking-wider mb-1 font-mono">
                          ԻՍՊԱՆԵՐԵՆ • SPANISH
                        </p>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-relaxed font-display">
                          {currentQuestion.spanishQuestion}
                        </h2>
                      </div>
                      <button
                        id="pronounce-main-question"
                        onClick={(e) => speakSpanish(currentQuestion.spanishQuestion, e)}
                        className="p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-xl transition-colors shrink-0 hover:scale-105 active:scale-95"
                        title="Լսել արտասանությունը"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Revealable Armenian Translation */}
                    <AnimatePresence>
                      {isQuestionTranslated && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-slate-200/60 overflow-hidden"
                        >
                          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/50">
                            <p className="text-xs text-amber-800 uppercase font-bold tracking-wider mb-1 font-mono">
                              ՀԱՅԵՐԵՆ ԹԱՐԳՄԱՆՈՒԹՅՈՒՆ • ARMENIAN
                            </p>
                            <p className="text-lg md:text-xl font-bold text-slate-800 font-display">
                              {currentQuestion.armenianQuestion}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Visual prompt inside the card */}
                    <div className="text-center text-[10px] text-slate-400 font-mono mt-1">
                      {isQuestionTranslated ? "← Սեղմեք նորից հայերենը թաքցնելու համար →" : "← Սեղմեք այստեղ հայերեն թարգմանության համար →"}
                    </div>
                  </motion.div>
                </div>

                {/* INSTRUCTIONS ON REVEALS */}
                <div className="text-center">
                  <span className="bg-sky-950/20 text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2 border border-white/15">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ընտրեք ճիշտ տարբերակը: Կտտացրեք <strong>«Թարգմանել»</strong>՝ հայերենը տեսնելու համար:</span>
                  </span>
                </div>

                {/* ANSWER OPTIONS GRID */}
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionKey === opt.key;
                    const isCorrect = opt.key === currentQuestion.correctAnswer;
                    const isWrongSelected = isSelected && !isCorrect;
                    
                    let optionStyle = "bg-white hover:bg-sky-50/80 hover:border-sky-400 border-slate-200 border-2";
                    
                    if (isAnswerChecked) {
                      if (isCorrect) {
                        optionStyle = "bg-emerald-50 border-emerald-500 border-2 ring-2 ring-emerald-300 text-emerald-950 shadow-emerald-100";
                      } else if (isWrongSelected) {
                        optionStyle = "bg-rose-50 border-rose-500 border-2 ring-2 ring-rose-300 text-rose-950 shadow-rose-100";
                      } else {
                        optionStyle = "opacity-50 bg-white/40 border-transparent cursor-not-allowed";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-amber-50/70 border-amber-500 border-2 ring-2 ring-amber-300 text-slate-900 shadow-md";
                    }

                    return (
                      <div
                        id={`option-container-${opt.key}`}
                        key={opt.key}
                        onClick={() => handleOptionClick(opt.key)}
                        className={`p-4 rounded-2xl border shadow-sm transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer ${optionStyle} ${
                          !isAnswerChecked && 'hover:scale-[1.01] hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {/* Key indicator circle */}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                            isAnswerChecked && isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : isAnswerChecked && isWrongSelected
                              ? 'bg-rose-500 text-white border-rose-600'
                              : isSelected
                              ? 'bg-sky-500 text-white border-sky-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {opt.key}
                          </div>

                          <div className="flex-1">
                            {/* Spanish Option Text */}
                            <p className="text-base md:text-lg font-semibold text-slate-900 font-display">
                              {opt.spanish}
                            </p>

                            {/* Option Translation Box */}
                            <AnimatePresence>
                              {translatedOptionKeys[opt.key] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-1.5 overflow-hidden"
                                >
                                  <p className="text-xs text-sky-900 bg-sky-100/50 py-1 px-2.5 rounded-lg border border-sky-200/50 inline-block font-medium">
                                    🇦🇲 {opt.armenian}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Interactive translate & sound tools */}
                        <div className="flex items-center gap-2 self-end md:self-center ml-11 md:ml-0 shrink-0">
                          {/* Tap to translate button */}
                          <button
                            id={`translate-option-${opt.key}`}
                            onClick={(e) => toggleOptionTranslation(opt.key, e)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              translatedOptionKeys[opt.key]
                                ? 'bg-sky-200 text-sky-800'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Թարգմանել հայերեն"
                          >
                            <Languages className="w-3 h-3 text-sky-500" />
                            <span>{translatedOptionKeys[opt.key] ? 'Թաքցնել' : 'Թարգմանել'}</span>
                          </button>

                          {/* Sound speak button */}
                          <button
                            id={`speak-option-${opt.key}`}
                            onClick={(e) => speakSpanish(opt.spanish, e)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            title="Լսել արտասանությունը"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM FEEDBACK & NEXT ACTIONS CONTAINER */}
                <div className="mt-2 min-h-12 flex flex-col gap-4">
                  {!isAnswerChecked ? (
                    <button
                      id="check-answer-btn"
                      onClick={handleCheckAnswer}
                      disabled={!selectedOptionKey}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg text-center shadow-lg transition-all transform duration-200 flex items-center justify-center gap-2 ${
                        selectedOptionKey
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white cursor-pointer hover:scale-[1.01] active:scale-[0.99] hover:shadow-xl'
                          : 'bg-white/20 text-white/50 border border-white/10 cursor-not-allowed'
                      }`}
                    >
                      <Compass className="w-5 h-5 animate-spin-slow" />
                      Ստուգել պատասխանը • Check Answer
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3"
                    >
                      {/* BILINGUAL EXPLANATION BOX */}
                      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-lg flex flex-col md:flex-row gap-4 items-start">
                        <div className={`p-3 rounded-2xl shrink-0 ${
                          selectedOptionKey === currentQuestion.correctAnswer 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-rose-100 text-rose-600'
                        }`}>
                          {selectedOptionKey === currentQuestion.correctAnswer 
                            ? <CheckCircle2 className="w-8 h-8" /> 
                            : <XCircle className="w-8 h-8" />
                          }
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                            {selectedOptionKey === currentQuestion.correctAnswer ? 'Ճիշտ է! • ¡Excelente!' : 'Սխալ է • Incorrecto'}
                          </h4>
                          <p className="text-slate-800 font-medium mb-3 leading-relaxed">
                            {currentQuestion.explanation}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-100">
                              Ճիշտ պատասխանը՝ {currentQuestion.correctAnswer}) {currentQuestion.options.find(o => o.key === currentQuestion.correctAnswer)?.spanish}
                            </span>
                            <button
                              id="pronounce-correct-ans"
                              onClick={(e) => speakSpanish(currentQuestion.options.find(o => o.key === currentQuestion.correctAnswer)?.spanish || '', e)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-indigo-600 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <Volume2 className="w-3 h-3" />
                              Արտասանել իսպաներեն
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* NEXT BUTTON */}
                      <button
                        id="next-question-btn"
                        onClick={handleNextQuestion}
                        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        {currentQuestionIndex === questions.length - 1 ? 'Ավարտել վիկտորինան • Finish' : 'Հաջորդ հարցը • Next Question'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>

              </motion.div>
            )}

            {/* 2. FLASHCARDS TAB CONTAINER */}
            {activeTab === 'flashcards' && (
              <motion.div
                key="flashcards-mode"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex flex-col gap-6"
              >
                {/* INSTRUCTIONS */}
                <div className="bg-white/25 backdrop-blur-md p-4 rounded-2xl border border-white/30 shadow-sm text-white text-center flex flex-col gap-1">
                  <h3 className="font-bold text-lg font-display">Ինտերակտիվ ուսուցման քարտեր • Flashcards</h3>
                  <p className="text-xs text-sky-100 font-medium">
                    Սեղմեք քարտի վրա՝ իսպաներեն թարգմանությունն ու արտասանությունը լսելու համար:
                  </p>
                </div>

                {/* CATEGORY SELECTOR CHIPS */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {Object.entries(categories).map(([key, value]) => {
                    const isSelected = activeFlashcardCategory === key;
                    const Icon = value.icon;
                    return (
                      <button
                        id={`category-tab-${key}`}
                        key={key}
                        onClick={() => { playTone('click'); setActiveFlashcardCategory(key); }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                          isSelected 
                            ? 'bg-slate-900 text-white shadow-md scale-105' 
                            : 'bg-white/70 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{value.name.split(' / ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* FLASHCARDS LISTING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredQuestions.map((q) => {
                    const isFlipped = !!flippedCardIds[q.id];
                    const CategoryIcon = getCategoryIcon(q.category);
                    return (
                      <div
                        id={`flashcard-${q.id}`}
                        key={q.id}
                        onClick={() => handleCardFlip(q.id)}
                        className="h-60 rounded-3xl cursor-pointer relative reveal-card"
                      >
                        <div className={`w-full h-full relative duration-500 reveal-card-inner rounded-3xl shadow-md border border-white/50 ${
                          isFlipped ? 'reveal-card-flipped' : ''
                        }`}>
                          
                          {/* FRONT SIDE (ARMENIAN) */}
                          <div className={`absolute inset-0 w-full h-full p-5 flex flex-col justify-between rounded-3xl backface-hidden bg-white/95 ${
                            isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-bold">
                                ՔԱՐՏ {q.id} • {q.category}
                              </span>
                              <CategoryIcon className="w-5 h-5 text-sky-500" />
                            </div>

                            <div className="my-auto py-2">
                              <p className="text-slate-800 text-base md:text-lg font-bold leading-relaxed">
                                {q.armenianQuestion}
                              </p>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                              <span className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                                <Languages className="w-3.5 h-3.5" />
                                Իմացիր իսպաներենը
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">Սեղմիր՝ շրջելու</span>
                            </div>
                          </div>

                          {/* BACK SIDE (SPANISH TRANSLATION) */}
                          <div className={`absolute inset-0 w-full h-full p-5 flex flex-col justify-between rounded-3xl backface-hidden bg-gradient-to-br from-indigo-950 to-slate-900 text-white transform rotate-Y-180 ${
                            isFlipped ? 'opacity-100' : 'pointer-events-none opacity-0'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-300 font-bold">
                                ԻՍՊԱՆԵՐԵՆ • TRADUCCIÓN {q.id}
                              </span>
                              <button
                                id={`speak-flashcard-${q.id}`}
                                onClick={(e) => speakSpanish(q.spanishQuestion, e)}
                                className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-sm transition-colors hover:scale-105"
                                title="Լսել արտասանությունը"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="my-auto py-2">
                              <p className="text-indigo-100 text-base md:text-lg font-extrabold leading-relaxed font-display">
                                {q.spanishQuestion}
                              </p>
                              
                              <div className="mt-3 bg-indigo-900/40 p-2.5 rounded-xl border border-indigo-800/50">
                                <p className="text-xs text-emerald-300 font-mono font-bold mb-1">
                                  ՃԻՇՏ ՊԱՏԱՍԽԱՆԸ • RESPUESTA CORRECTA:
                                </p>
                                <p className="text-xs font-semibold text-slate-200">
                                  {q.options.find(o => o.key === q.correctAnswer)?.spanish} — {q.options.find(o => o.key === q.correctAnswer)?.armenian}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-indigo-800/40">
                              <span className="text-xs text-indigo-300 font-medium">
                                🇦🇲 {q.armenianQuestion.slice(0, 30)}...
                              </span>
                              <span className="text-[10px] text-indigo-400 font-mono">Սեղմիր՝ շրջելու</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 3. REPORT & RESULTS STATS TAB */}
            {((activeTab === 'stats' && quizHistory.length === 0) || isQuizFinished) && (
              <motion.div
                key="stats-mode-finished"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex flex-col gap-6"
              >
                {/* SUMMARY HEADER CARD */}
                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/50 shadow-xl text-center flex flex-col items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Trophy className="w-16 h-16 text-amber-500/20" />
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-3xl text-white shadow-md border-2 border-white animate-bounce">
                    <Award className="w-12 h-12" />
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
                      {score === questions.length ? 'Հրաշալի է! • ¡Excelente!' : 'Լավ աշխատանք! • ¡Buen trabajo!'}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Դուք ավարտեցիք իսպաներենի ճանապարհորդական վիկտորինան
                    </p>
                  </div>

                  {/* SCORE LABELS */}
                  <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-lg mt-2">
                    <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex flex-col items-center">
                      <span className="text-xs text-slate-500 font-bold uppercase font-mono tracking-wider">
                        Ճիշտ
                      </span>
                      <strong className="text-2xl md:text-3xl text-sky-600 font-display font-black mt-1">
                        {score} / {questions.length}
                      </strong>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center">
                      <span className="text-xs text-slate-500 font-bold uppercase font-mono tracking-wider">
                        Ճշգրտություն
                      </span>
                      <strong className="text-2xl md:text-3xl text-emerald-600 font-display font-black mt-1">
                        {Math.round((score / questions.length) * 100)}%
                      </strong>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center">
                      <span className="text-xs text-slate-500 font-bold uppercase font-mono tracking-wider">
                        Մաքս Սերիա
                      </span>
                      <strong className="text-2xl md:text-3xl text-amber-600 font-display font-black mt-1">
                        {maxStreak} 🔥
                      </strong>
                    </div>
                  </div>

                  {/* RECOMMENDATION CHIP */}
                  <div className="bg-indigo-50 border border-indigo-100/60 p-4 rounded-2xl text-slate-700 text-sm max-w-lg font-medium leading-relaxed">
                    🌟 <strong>Լեզվաբանական խորհուրդ.</strong> Ճամփորդելիս իսպանախոս երկրներում ճիշտ կառուցված նախադասություններն օգնում են ավելի արագ կողմնորոշվել օդանավակայանում, ռեստորանում և հյուրանոցում: Շարունակեք ուսումնասիրել թարգմանությունները ստորև:
                  </div>

                  {/* RESTART BUTTON */}
                  <button
                    id="restart-quiz-btn"
                    onClick={handleRestartQuiz}
                    className="mt-2 py-3 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="w-5 h-5 animate-spin-slow" />
                    Սկսել նորից • Reiniciar
                  </button>
                </div>

                {/* REVIEW SHEET OF ALL QUESTIONS */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-sm font-display flex items-center gap-2">
                    <ListTodo className="w-5 h-5" />
                    Հարցերի մանրամասն վերլուծություն
                  </h3>

                  <div className="flex flex-col gap-3">
                    {questions.map((q) => {
                      const userAns = quizHistory.find(h => h.questionId === q.id);
                      const CategoryIcon = getCategoryIcon(q.category);
                      
                      return (
                        <div
                          id={`review-card-${q.id}`}
                          key={q.id}
                          className="bg-white/95 rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                              <CategoryIcon className="w-3.5 h-3.5 text-slate-500" />
                              ՀԱՐՑ {q.id} • {q.category}
                            </span>

                            {userAns && (
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                                userAns.isCorrect 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {userAns.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                {userAns.isCorrect ? 'Ճիշտ' : 'Սխալ'}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-slate-800 font-semibold mb-1 text-sm md:text-base">
                              🇦🇲 {q.armenianQuestion}
                            </p>
                            <p className="text-indigo-950 font-bold text-sm md:text-base font-display flex items-center gap-2">
                              🇪🇸 {q.spanishQuestion}
                              <button
                                id={`speak-review-${q.id}`}
                                onClick={(e) => speakSpanish(q.spanishQuestion, e)}
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </p>
                          </div>

                          <div className="bg-slate-50/75 p-3 rounded-xl border border-slate-100 text-xs">
                            <p className="text-slate-500 font-bold mb-1 uppercase font-mono">Ճիշտ տարբերակը • Opción correcta:</p>
                            <p className="font-semibold text-indigo-950">
                              {q.correctAnswer}) {q.options.find(o => o.key === q.correctAnswer)?.spanish} — {q.options.find(o => o.key === q.correctAnswer)?.armenian}
                            </p>
                            <p className="text-slate-600 mt-2 italic">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {/* FALLBACK: EMPTY STATS PANEL VIEW (WHEN NO HISTORY) */}
            {activeTab === 'stats' && quizHistory.length === 0 && !isQuizFinished && (
              <motion.div
                key="stats-empty-mode"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl text-center flex flex-col items-center gap-4 max-w-md mx-auto"
              >
                <div className="bg-amber-100 p-4 rounded-3xl text-amber-600">
                  <HelpCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Ակտիվ արդյունքներ չկան</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Դեռևս չունեք ավարտված վիկտորինաներ: Սկսեք վիկտորինան, ընտրեք տարբերակներն ու ստուգեք ձեր ուժերը:
                </p>
                <button
                  id="start-quiz-empty-btn"
                  onClick={() => setActiveTab('quiz')}
                  className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Սկսել վիկտորինան
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* FOOTER METADATA */}
        <footer className="mt-8 mb-20 text-center text-xs text-white/70 drop-shadow-sm font-mono flex flex-col gap-1">
          <p>Յուրաքանչյուր հարցի կամ տարբերակի վրա կտտացնելիս բացվում է թարգմանությունը:</p>
          <p>© 2026 Viajes Spanish-Armenian Study Resort. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}
