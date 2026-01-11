import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Flag,
  Quote,
  ClipboardList,
  Trophy,
  X,
  Check,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  Info,
  Loader2,
  BookOpen,
} from "lucide-react";
import useSound from "use-sound";
import confetti from "canvas-confetti";

// Sound Assets (Using JsDelivr for valid CORS headers)
const CLICK_SOUND =
  "https://cdn.jsdelivr.net/gh/joshwcomeau/use-sound@master/stories/sounds/pop-down.mp3";
const CHIME_SOUND =
  "https://cdn.jsdelivr.net/gh/joshwcomeau/use-sound@master/stories/sounds/glug-a.mp3";

const QuizDisplay = ({
  loading,
  quizData,
  onExplain,
  onReset,
  showDocs,
  setShowDocs,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // { [questionIndex]: optionIndex }

  const [playClick] = useSound(CLICK_SOUND, { volume: 0.5 });
  const [playSuccess] = useSound(CHIME_SOUND, {
    volume: 0.5,
    playbackRate: 1.2,
  });

  // Reset state when quiz data changes
  useEffect(() => {
    if (quizData) {
      setCurrentIndex(0);
      setSelectedOptions({});
    }
  }, [quizData]);

  const handleNext = () => {
    playClick();
    if (currentIndex < quizData.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    playClick();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    // Prevent changing answer if already selected
    if (selectedOptions[currentIndex] !== undefined) return;

    playClick();

    setSelectedOptions((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const [explanation, setExplanation] = useState(null); // { index: number, text: string }
  const [explainingIndex, setExplainingIndex] = useState(null); // Index of option currently being explained

  const handleExplainRequest = async (optionIndex, optionText) => {
    setExplainingIndex(optionIndex);
    const isCorrect = quizData[currentIndex].correctIndex === optionIndex;
    const text = await onExplain(quizData[currentIndex], optionText, isCorrect);
    setExplanation({ index: optionIndex, text });
    setExplainingIndex(null);
  };

  // Clear explanation when moving to next question
  useEffect(() => {
    setExplanation(null);
  }, [currentIndex]);

  // Check if quiz is finished
  const finished = quizData ? currentIndex >= quizData.length : false;

  // Calculate Score (always calculate, logic is safe for null quizData)
  const calculateScore = () => {
    if (!quizData) return 0;
    let correctCount = 0;
    quizData.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / quizData.length) * 100);
  };

  const scorePercentage = finished ? calculateScore() : 0;

  // Trigger Confetti & Sound when finished with 100% score
  useEffect(() => {
    if (finished && scorePercentage === 100) {
      playSuccess();
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
      };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);

      return () => clearInterval(interval);
    }
  }, [finished, scorePercentage, playSuccess]);

  if (!loading && !quizData) {
    return (
      <div className="wized-card w-full p-2 md:p-8 h-full overflow-hidden flex flex-col relative">
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 opacity-20"></div>
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Ready to Learn?
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            Configure your quiz settings on the left and hit generate to create
            a custom challenge.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wized-card w-full p-2 md:p-8 h-full overflow-hidden flex flex-col relative justify-center">
        <div className="space-y-6 mt-4 px-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
            <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-14 bg-slate-100 dark:bg-slate-700/50 rounded-2xl"></div>
              <div className="h-14 bg-slate-100 dark:bg-slate-700/50 rounded-2xl"></div>
              <div className="h-14 bg-slate-100 dark:bg-slate-700/50 rounded-2xl"></div>
              <div className="h-14 bg-slate-100 dark:bg-slate-700/50 rounded-2xl"></div>
            </div>
          </div>
          <div className="flex justify-center mt-8 text-purple-500 font-medium items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Crafting your quiz...
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    // Re-calculate for display variables (derived state)
    let correctCount = 0;
    const incorrectQuestions = [];

    quizData.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correctIndex) {
        correctCount++;
      } else {
        incorrectQuestions.push({
          question: q.question,
          yourAnswer: q.options[selectedOptions[idx]],
          correctAnswer: q.options[q.correctIndex],
        });
      }
    });

    return (
      <div className="wized-card w-full p-4 md:p-8 h-full overflow-hidden flex flex-col relative bg-slate-50 dark:bg-slate-900">
        {/* Docs Overlay */}
        {showDocs && (
          <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <BookOpen className="text-purple-600" /> Project Documentation
                </h2>
                <button
                  onClick={() => {
                    playClick();
                    setShowDocs(false);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="space-y-8 text-slate-700 dark:text-slate-300">
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Current Features
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>AI Quiz Generation:</strong> Uses Gemini 1.5 Flash
                      to generate dynamic quizzes based on text or topics.
                    </li>
                    <li>
                      <strong>Wizard UI:</strong> A step-by-step, no-scroll
                      interface for better focus.
                    </li>
                    <li>
                      <strong>Bloom's Taxonomy:</strong> Tailors questions to
                      different cognitive levels (Recall, Analyze, etc.).
                    </li>
                    <li>
                      <strong>Smart Feedback:</strong> "Why?" explanation
                      feature provides instant AI tutoring.
                    </li>
                  </ul>
                </section>

                <section className="bg-purple-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-purple-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Future Roadmap (High-Level
                    Project)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block mb-1">
                        1. User Authentication (Auth0 / Firebase)
                      </span>
                      <p className="text-sm">
                        Allow users to save their progress, track improvement
                        over time, and compete on leaderboards.
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block mb-1">
                        2. Database Integration (PostgreSQL / Supabase)
                      </span>
                      <p className="text-sm">
                        Store generated quizzes to reduce API costs and build a
                        community library of study sets.
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block mb-1">
                        3. Advanced LLM Personas
                      </span>
                      <p className="text-sm">
                        Custom AI tutors (e.g., "Socratic Method", "Explain Like
                        I'm 5") for more personalized learning experiences.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-20"></div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg">
              <Flag className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Quiz Complete!
            </h2>
          </div>
          <button
            onClick={() => {
              playClick();
              setShowDocs(true);
            }}
            className="text-xs font-bold text-slate-400 hover:text-purple-600 flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Docs
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full pb-2">
            {/* 1. SCORE CARD (Large) */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/10"></div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-xs mb-1">
                  Your Score
                </p>
                <h3 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {scorePercentage}%
                </h3>
              </div>
              <div className="mt-4">
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {correctCount} / {quizData.length} Correct
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      scorePercentage >= 70 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 2. QUOTE CARD (Tall) */}
            <div className="md:row-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white text-center flex flex-col justify-center items-center shadow-lg shadow-purple-200 dark:shadow-none">
              <Quote className="w-10 h-10 text-white/20 mb-4" />
              <p className="text-lg md:text-xl font-medium leading-relaxed italic">
                "Learning is not attained by chance, it must be sought for with
                ardor and attended to with diligence."
              </p>
              <p className="mt-4 text-sm font-bold text-white/60 uppercase tracking-widest">
                — Abigail Adams
              </p>
            </div>

            {/* 3. THINGS TO LOOK FOR (Review) */}
            <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col min-h-[200px]">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-800 dark:text-white">
                  Things to Look For
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {incorrectQuestions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                    <Trophy className="w-12 h-12 mb-2 text-emerald-200" />
                    <p>Perfect score! Nothing to review.</p>
                  </div>
                ) : (
                  incorrectQuestions.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20"
                    >
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2">
                        {item.question}
                      </p>
                      <div className="flex gap-4 text-xs">
                        <div className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                          <X className="w-3 h-3" /> {item.yourAnswer}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> {item.correctAnswer}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4. ACTION CARD */}
            <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-3xl flex flex-col justify-center items-center border border-slate-100 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => {
                  playClick();
                  onReset();
                }}
                className="w-full h-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 rounded-3xl p-6"
              >
                <RotateCcw className="w-5 h-5" /> New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData[currentIndex];
  const userSelection = selectedOptions[currentIndex];
  const isAnswered = userSelection !== undefined;

  return (
    <div className="wized-card w-full p-4 md:p-8 h-full overflow-hidden flex flex-col relative">
      {/* Header Decoration */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 opacity-20"></div>

      <div className="flex-1 flex flex-col justify-center px-4 md:px-8 overflow-y-auto custom-scrollbar">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Question {currentIndex + 1} / {quizData.length}
          </span>
          <div className="h-2 w-32 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300 ease-out"
              style={{
                width: `${((currentIndex + 1) / quizData.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500"
          key={currentIndex}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((opt, i) => {
              let buttonClass =
                "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-800 dark:hover:text-purple-300 hover:shadow-md hover:shadow-purple-100 dark:hover:shadow-none";
              let iconClass =
                "bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 group-hover:bg-purple-200 group-hover:text-purple-700";

              if (isAnswered) {
                if (currentQuestion.correctIndex === i) {
                  // Correct Answer (always show green if answered)
                  buttonClass =
                    "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-md shadow-emerald-100 dark:shadow-none";
                  iconClass =
                    "bg-emerald-200/50 text-emerald-800 dark:text-emerald-700";
                } else if (userSelection === i) {
                  // User Selected Wrong Answer
                  buttonClass =
                    "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-800 dark:text-rose-400 shadow-md shadow-rose-100 dark:shadow-none";
                  iconClass = "bg-rose-200/50 text-rose-800 dark:text-rose-700";
                } else {
                  // Unselected Other Options
                  buttonClass =
                    "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-400 opacity-60";
                  iconClass =
                    "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600";
                }
              }

              return (
                <div key={i} className="relative group/option">
                  <button
                    onClick={() => handleOptionSelect(i)}
                    disabled={isAnswered}
                    className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 micro-bounce font-medium text-slate-700 dark:text-slate-200 relative overflow-hidden group w-full ${buttonClass}`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <span
                        className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold transition-colors ${iconClass}`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-lg pr-20 block">{opt}</span>
                    </div>
                  </button>

                  {/* Explain Button - ONLY visible if NOT answering/explaining already */}
                  {isAnswered &&
                    explanation?.index !== i &&
                    explainingIndex !== i && (
                      <div
                        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 transition-opacity ${
                          userSelection === i
                            ? "opacity-100"
                            : "opacity-0 group-hover/option:opacity-100"
                        }`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            handleExplainRequest(i, opt);
                          }}
                          className={`p-2 rounded-lg shadow-md transition-colors text-xs font-bold flex items-center gap-1 border whitespace-nowrap ${
                            userSelection === i &&
                            currentQuestion.correctIndex !== i
                              ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700 hover:bg-rose-200"
                              : "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 border-slate-100 dark:border-slate-600 hover:bg-purple-50 dark:hover:bg-slate-600"
                          }`}
                          title="Why is this right/wrong?"
                        >
                          <HelpCircle className="w-4 h-4" /> Why?
                        </button>
                      </div>
                    )}

                  {/* Explanation Box */}
                  {explanation?.index === i && (
                    <div className="mt-2 p-3 bg-purple-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 rounded-xl text-sm text-purple-800 dark:text-purple-300 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{explanation.text}</span>
                      </div>
                    </div>
                  )}

                  {/* Loader for this specific option */}
                  {explainingIndex === i && (
                    <div className="mt-2 p-3 flex items-center gap-2 text-sm text-purple-500 animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {isAnswered &&
            (userSelection === currentQuestion.correctIndex ? (
              <div className="mt-6 text-emerald-600 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle className="w-6 h-6" /> Correct! Well done.
              </div>
            ) : (
              <div className="mt-6 text-rose-500 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                <XCircle className="w-6 h-6" /> Incorrect. The correct answer is
                highlighted.
              </div>
            ))}
        </div>
      </div>

      <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6 px-4 md:px-8 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-purple-600 text-white shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-purple-300 transform active:scale-95 transition-all"
        >
          {currentIndex === quizData.length - 1 ? (
            <>
              Finish <Flag className="w-4 h-4" />
            </>
          ) : (
            <>
              Next <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay;
