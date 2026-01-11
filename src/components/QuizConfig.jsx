import React from "react";
import {
  Sparkles,
  FileText,
  Lightbulb,
  Loader2,
  Zap,
  BookOpen,
} from "lucide-react";

const QuizConfig = ({
  inputMode,
  setInputMode,
  content,
  setContent,
  config,
  setConfig,
  loading,
  onGenerate,
  onOpenDocs,
}) => {
  const bloomLevels = [
    { name: "Recall", desc: "Facts & Basic Concepts" },
    { name: "Analyze", desc: "Draw Connections" },
    { name: "Evaluate", desc: "Justify a Stand" },
    { name: "Create", desc: "Produce New Work" },
  ];

  return (
    <div className="wized-card w-full h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex items-center gap-3 p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Quiz Wizard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Design your challenge
          </p>
        </div>
        <button
          onClick={onOpenDocs}
          className="ml-auto p-2 text-slate-400 hover:text-purple-600 transition-colors"
          title="Project Docs"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setInputMode("text")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center ${
              inputMode === "text"
                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-md"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <FileText className="w-4 h-4 mr-2" /> Paste Text
          </button>
          <button
            onClick={() => setInputMode("topic")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center ${
              inputMode === "topic"
                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-md"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Lightbulb className="w-4 h-4 mr-2" /> Topic
          </button>
        </div>

        {/* Input Area */}
        <div className="relative group">
          <div className="absolute inset-0 bg-purple-200 dark:bg-purple-900/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <textarea
            className="relative w-full bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-50 dark:focus:ring-purple-900/30 transition-all h-28 text-slate-700 dark:text-slate-200 placeholder-slate-400 resize-none font-medium text-base leading-relaxed shadow-inner dark:shadow-none"
            placeholder={
              inputMode === "text"
                ? "Paste your notes here..."
                : "Enter a topic (e.g. 'Photosynthesis')"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Cognitive Target / Bloom's Taxonomy - Box Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider">
            Cognitive Target
          </label>
          <div className="grid grid-cols-2 gap-2">
            {bloomLevels.map((level) => (
              <button
                key={level.name}
                onClick={() =>
                  setConfig({ ...config, taxonomyLevel: level.name })
                }
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  config.taxonomyLevel === level.name
                    ? "border-purple-500 bg-purple-500/10 shadow-[0_0_12px_rgba(168,85,247,0.2)] dark:shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <div
                  className={`text-xs font-bold ${
                    config.taxonomyLevel === level.name
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {level.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  {level.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders - Compact Box Layout */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
          {/* Questions Slider */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Questions
              </label>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-700 rounded-lg text-purple-600 dark:text-purple-400 font-bold text-xs shadow-sm border border-slate-100 dark:border-slate-600">
                {config.count}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              className="w-full accent-purple-600 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer hover:accent-purple-500 transition-all"
              value={config.count}
              onChange={(e) =>
                setConfig({ ...config, count: parseInt(e.target.value) })
              }
            />
          </div>

          {/* Difficulty Slider */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Difficulty
              </label>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-700 rounded-lg text-purple-600 dark:text-purple-400 font-bold text-xs shadow-sm border border-slate-100 dark:border-slate-600">
                {config.difficulty}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full accent-purple-600 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer hover:accent-purple-500 transition-all"
              value={config.difficulty}
              onChange={(e) =>
                setConfig({ ...config, difficulty: parseInt(e.target.value) })
              }
            />
          </div>

          {/* Depth Slider */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Conceptual Depth
              </label>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-700 rounded-lg text-purple-600 dark:text-purple-400 font-bold text-xs shadow-sm border border-slate-100 dark:border-slate-600">
                {config.depth}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full accent-purple-600 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer hover:accent-purple-500 transition-all"
              value={config.depth}
              onChange={(e) =>
                setConfig({ ...config, depth: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer Button */}
      <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl micro-bounce shadow-xl shadow-purple-200/50 dark:shadow-purple-900/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all text-base flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 group-hover:animate-pulse" /> Generate
              Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizConfig;
