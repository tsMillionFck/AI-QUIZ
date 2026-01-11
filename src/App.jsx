import { useState, useEffect } from "react";
import "./App.css";
import QuizConfig from "./components/QuizConfig";
import QuizDisplay from "./components/QuizDisplay";
import { Sun, Moon } from "lucide-react";

const AI_KEY = import.meta.env.VITE_AI_KEY;

function App() {
  const [inputMode, setInputMode] = useState("text"); // 'text' or 'topic'
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [showDocs, setShowDocs] = useState(false);
  const [config, setConfig] = useState({
    count: 5,
    difficulty: 5,
    taxonomyLevel: "Recall",
    depth: 5,
  });
  const [weakPoints, setWeakPoints] = useState([]); // For future adaptive logic
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark Mode Class on Wrapper
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const generateQuiz = async () => {
    if (!content.trim()) {
      alert("Please provide content or a topic.");
      return;
    }

    setLoading(true);
    setQuizData(null);

    const getBloomDescription = (level) => {
      const map = {
        Recall: "Facts & Basic Concepts",
        Analyze: "Draw Connections",
        Evaluate: "Justify a Stand",
        Create: "Produce New Work",
      };
      return map[level] || "General Knowledge";
    };

    const prompt = `
  ACT AS: A Senior Educational Architect.
  TASK: Generate a ${config.count}-question quiz in strict JSON format.
  
  CONTEXT: ${content}
  
  TAXONOMY FOCUS (Bloom's): ${config.taxonomyLevel} 
  (Targeting: ${getBloomDescription(config.taxonomyLevel)})
  
  ADAPTIVE PARAMETERS:
  - Difficulty: ${config.difficulty}/10
  - Conceptual Depth: ${config.depth}/10
  - Adaptive Logic: If difficulty > 7, include 1 "Bridge Question" (easier) and 1 "Stretch Question" (complex).
  ${
    weakPoints.length > 0
      ? `- Remedial Focus: Include 2 questions specifically on: ${weakPoints.join(
          ", "
        )}`
      : ""
  }

  OUTPUT FORMAT:
  [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0,
      "bloomLevel": "${config.taxonomyLevel}",
      "explanation": "Brief logic for the correct answer.",
      "bridge": boolean (true if this is a foundation question)
    }
  ]
  
  RETURN ONLY THE ARRAY. NO PROSE.
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${AI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await response.json();

      if (!data.candidates || !data.candidates[0].content) {
        console.error("No valid response from AI", data);
        alert("AI returned an empty or error response. Check Quota or Key.");
        setLoading(false);
        return;
      }

      const rawText = data.candidates[0].content.parts[0].text;
      let cleanText = rawText;
      const jsonStart = cleanText.indexOf("[");
      const jsonEnd = cleanText.lastIndexOf("]");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
      }

      const cleanJson = JSON.parse(cleanText);
      setQuizData(cleanJson);
    } catch (error) {
      console.error("Error fetching AI:", error);
      alert("Failed to generate quiz. See console for details.");
    }
    setLoading(false);
  };

  const generateExplanation = async (question, option, isCorrect) => {
    try {
      const prompt = `
      ACT AS: A Tutor.
      CONTEXT: The user is taking a quiz.
      QUESTION: "${question.question}"
      SELECTED OPTION: "${option}"
      STATUS: ${isCorrect ? "CORRECT" : "INCORRECT"}
      
      TASK: Explain in 1-2 sentences why this option is ${
        isCorrect ? "correct" : "incorrect"
      }. Be encouraging but factual.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not generate explanation."
      );
    } catch (error) {
      console.error("Error generating explanation:", error);
      return "Failed to get explanation. Please try again.";
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
    setLoading(false);
    // Optional: Keep config or reset it? User probably wants to tweak config.
    // We already keep 'config' state, so it persists. Good.
  };

  return (
    <div className="h-screen w-screen overflow-hidden p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 font-sans antialiased text-slate-800 transition-colors duration-300 dark:bg-slate-950 bg-slate-50">
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg transition-all hover:scale-110 active:scale-95 text-slate-600 dark:text-yellow-400 group flex items-center justify-center"
      >
        {darkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5 text-slate-400 group-hover:text-purple-600" />
        )}
      </button>

      {/* SECTION 1: CONFIGURATION (Left Panel - 38.2%) */}
      <div className="w-full md:w-[38.2%] h-full flex-shrink-0">
        <QuizConfig
          inputMode={inputMode}
          setInputMode={setInputMode}
          content={content}
          setContent={setContent}
          config={config}
          setConfig={setConfig}
          loading={loading}
          onGenerate={generateQuiz}
          onOpenDocs={() => setShowDocs(true)}
        />
      </div>

      {/* SECTION 2: DISPLAY (Right Panel - 61.8%) */}
      <div className="w-full md:flex-1 h-full min-h-0">
        <QuizDisplay
          loading={loading}
          quizData={quizData}
          onExplain={generateExplanation}
          onReset={resetQuiz}
          showDocs={showDocs}
          setShowDocs={setShowDocs}
        />
      </div>
    </div>
  );
}

export default App;
