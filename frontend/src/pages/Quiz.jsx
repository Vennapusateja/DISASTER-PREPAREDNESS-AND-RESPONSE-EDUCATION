import React from "react";
import { apiJson } from "../services/api.js";

const TIMER_SECONDS = 30;

function TimerRing({ seconds, total }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const pct = seconds / total;
  const dash = circ * pct;
  const color = seconds <= 8 ? "#ef4444" : seconds <= 15 ? "#f59e0b" : "#6366f1";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg width="56" height="56" className="-rotate-90 absolute">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
        />
      </svg>
      <span className={`text-sm font-black z-10 ${seconds <= 8 ? "text-red-400" : seconds <= 15 ? "text-amber-400" : "text-indigo-400"}`}>{seconds}</span>
    </div>
  );
}

export default function Quiz({ token, onUpdateUser }) {
  const [quizzes, setQuizzes] = React.useState(null);
  const [activeQuizId, setActiveQuizId] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    apiJson("/api/quizzes").then(data => setQuizzes(data.quizzes));
  }, []);

  // Timer logic
  React.useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // auto-advance on timeout
          clearInterval(timerRef.current);
          handleTimeout();
          return TIMER_SECONDS;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive, currentIdx]);

  function resetTimer() {
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
  }

  function handleTimeout() {
    const quiz = quizzes?.find(q => q.id === activeQuizId);
    if (!quiz) return;
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(i => i + 1);
      resetTimer();
      setTimerActive(true);
    } else {
      submitQuiz();
    }
  }

  const startQuiz = (id) => {
    setActiveQuizId(id);
    setStep(1);
    setCurrentIdx(0);
    setAnswers({});
    setShowReview(false);
    resetTimer();
    setTimerActive(true);
  };

  const selectAnswer = (qnId, idx) => {
    setAnswers(prev => ({ ...prev, [qnId]: idx }));
  };

  const next = () => {
    const quiz = quizzes.find(q => q.id === activeQuizId);
    resetTimer();
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setTimerActive(true);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setTimerActive(false);
    clearInterval(timerRef.current);
    setLoading(true);
    try {
      const data = await apiJson(`/api/quizzes/${activeQuizId}/submit`, { method: "POST", body: { answers } });
      setResult(data.result);
      setStep(2);
      if (onUpdateUser) onUpdateUser();
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (!quizzes) return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Safety Certification</h1>
        <p className="text-slate-400 font-medium mt-2">Validate operational readiness and secure proficiency credentials.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="os-card animate-pulse">
            <div className="w-12 h-12 bg-white/5 rounded-2xl mb-6" />
            <div className="h-5 bg-white/5 rounded-lg mb-3 w-3/4" />
            <div className="h-3 bg-white/5 rounded-lg mb-2 w-full" />
            <div className="h-3 bg-white/5 rounded-lg mb-8 w-2/3" />
            <div className="h-10 bg-white/5 rounded-2xl w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === 0) {
    return (
      <div className="animate-fade-in space-y-10">
        <header>
          <h1 className="text-3xl lg:text-5xl font-black tracking-tighter gradient-text">Safety Certification</h1>
          <p className="text-slate-400 font-medium mt-2">Validate operational readiness and secure proficiency credentials.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quizzes.map(q => (
            <div key={q.id} className="os-card flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-indigo-500/20 shadow-lg group-hover:scale-110 transition-transform">🎖️</div>
                <h3 className="text-xl font-black mb-2">{q.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-3">Comprehensive assessment covering {q.count} core safety protocols.</p>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{TIMER_SECONDS}s per question</span>
                </div>
              </div>
              <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-black tracking-widest text-slate-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-400 transition-all uppercase" onClick={() => startQuiz(q.id)}>Begin Assessment</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const quiz = quizzes.find(q => q.id === activeQuizId);
  const qn = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  if (step === 1) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh] py-10">
        <div className="os-card w-full max-w-3xl p-8 lg:p-12">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocol {currentIdx + 1}/{quiz.questions.length}</div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{quiz.title}</div>
              <TimerRing seconds={timeLeft} total={TIMER_SECONDS} />
            </div>
          </div>
          
          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden mb-12">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
          </div>

          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight mb-12">{qn.text}</h2>

          <div className="grid grid-cols-1 gap-3">
            {qn.options.map((opt, i) => {
              const isSelected = answers[qn.id] === i;
              return (
                <button
                  key={i}
                  className={`flex items-center gap-5 p-5 rounded-[1.5rem] border text-left transition-all duration-200 group ${
                    isSelected
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-white scale-[1.01] shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900 border-transparent text-slate-400 hover:border-white/10 hover:bg-slate-800/50 hover:scale-[1.005]'
                  }`}
                  onClick={() => selectAnswer(qn.id, i)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${isSelected ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-600 group-hover:text-slate-400'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm md:text-base font-bold">{opt}</span>
                  {isSelected && <div className="ml-auto w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">✓</div>}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-10 border-t border-white/5">
            <button className="w-full sm:w-auto px-10 py-4 bg-white/5 rounded-2xl text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest" onClick={() => { if (currentIdx > 0) { setCurrentIdx(i => i - 1); resetTimer(); setTimerActive(true); } }}>Previous</button>
            <button
              className={`w-full sm:flex-1 py-5 rounded-2xl text-xs font-black tracking-widest uppercase transition-all ${answers[qn.id] === undefined ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95'}`}
              disabled={answers[qn.id] === undefined}
              onClick={next}
            >
              {currentIdx === quiz.questions.length - 1 ? (loading ? "Authenticating..." : "Finalize Certification") : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const quiz = quizzes.find(q => q.id === activeQuizId);
    return (
      <div className="animate-fade-in space-y-8 py-10 max-w-3xl mx-auto">
        <div className="os-card text-center p-10 lg:p-16">
          <div className="text-7xl mb-10 flex justify-center">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 shadow-2xl shadow-indigo-500/5">
              {result.scorePct > 70 ? "🎖️" : "📊"}
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-4">{result.scorePct}% Proficiency</h2>
          <p className="text-slate-400 font-medium text-base mb-12 max-w-sm mx-auto">{result.feedback}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="os-card bg-slate-900 border-white/5 p-6">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-2xl font-black text-white">{result.correct}/{result.total}</div>
            </div>
            <div className="os-card bg-slate-900 border-white/5 p-6">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Acquired</div>
              <div className="text-2xl font-black text-emerald-400">+{result.pointsAwarded}</div>
            </div>
          </div>

          {result.badgeEarned && (
            <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 justify-center">
              <span className="text-2xl">🏅</span>
              <div>
                <div className="text-xs font-black text-amber-400 uppercase tracking-widest">Badge Unlocked!</div>
                <div className="text-sm font-black text-white">{result.badgeEarned}</div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              className="flex-1 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
              onClick={() => setShowReview(!showReview)}
            >
              {showReview ? "Hide Review" : "📋 Review Answers"}
            </button>
            <button className="flex-1 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-200 active:scale-95 transition-all" onClick={() => { setStep(0); setShowReview(false); }}>
              Back to Academy
            </button>
          </div>
        </div>

        {/* Answer Review Panel */}
        {showReview && (
          <div className="os-card space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-lg border border-indigo-500/20">📋</div>
              <h3 className="text-lg font-black">Answer Review</h3>
            </div>
            {quiz.questions.map((q, i) => {
              const userAns = answers[q.id];
              const correct = result.correctAnswers[q.id];
              const isCorrect = userAns === correct;
              return (
                <div key={q.id} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`text-lg mt-0.5 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{isCorrect ? '✓' : '✗'}</span>
                    <p className="text-sm font-black text-white leading-relaxed">Q{i+1}. {q.text}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 ml-7">
                    {q.options.map((opt, j) => {
                      const isUserChoice = userAns === j;
                      const isCorrectChoice = correct === j;
                      return (
                        <div key={j} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          isCorrectChoice ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          isUserChoice && !isCorrect ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'text-slate-600'
                        }`}>
                          <span className="font-black">{String.fromCharCode(65+j)}.</span>
                          {opt}
                          {isCorrectChoice && <span className="ml-auto text-emerald-400 font-black">✓ Correct</span>}
                          {isUserChoice && !isCorrect && <span className="ml-auto text-red-400 font-black">✗ Your choice</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  return null;
}
