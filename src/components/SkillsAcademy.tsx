import React from 'react';
import { Course, UserProfile, ChatMessage } from '../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface SkillsAcademyProps {
  profile: UserProfile;
  courses: Course[];
  onModifyProfile: (updater: Partial<UserProfile>) => void;
  triggerAIContext: (instructions: string, prompt: string, history: ChatMessage[]) => Promise<string>;
}

export default function SkillsAcademy({
  profile,
  courses,
  onModifyProfile,
  triggerAIContext,
}: SkillsAcademyProps) {
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = React.useState<number>(0);
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [quizStatus, setQuizStatus] = React.useState<'idle' | 'success' | 'fail'>('idle');
  const [notification, setNotification] = React.useState<string | null>(null);

  // AI Tutor state
  const [tutorMessages, setTutorMessages] = React.useState<ChatMessage[]>([
    {
      id: 'init-tutor',
      sender: 'assistant',
      text: 'Greetings! I am your personal eTopia AI Tutor. Ask me any question concerning your active course chapters to start real-time interactive mentoring.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [tutorInput, setTutorInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const quizQuestions: Record<string, { q: string; opts: string[]; ans: string }> = {
    'crs-1': {
      q: 'Which of the following is core to "Responsible Prompt Engineering" in civic AI development?',
      opts: [
        'A. Maximizing conversational tokens without restriction schemas.',
        'B. Declaring strict response MimeTypes and adding negative instructions to prevent model bias.',
        'C. Exposing internal API keys to the client browser logs.',
      ],
      ans: 'B',
    },
    'crs-2': {
      q: 'What distinguishes a Circular Economy from a traditional Linear Economy model?',
      opts: [
        'A. Standard waste elimination by recycling structural outputs back into design loops.',
        'B. Maximizing raw metal mining extraction volumes.',
        'C. Doubling carbon output in transportation vectors.',
      ],
      ans: 'A',
    },
  };

  const handleTutorSendMessage = async (text: string) => {
    if (!text.trim() || !selectedCourse) return;

    const userMsg: ChatMessage = {
      id: `tut-usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTutorMessages(prev => [...prev, userMsg]);
    setTutorInput('');
    setIsTyping(true);

    try {
      const prompt = `Active Course: ${selectedCourse.title}.
Chapter being digested: "${selectedCourse.chapters[activeChapterIndex]}".
User asks: ${text}.
Resolve their doubts with an academic tutoring perspective.`;

      const response = await triggerAIContext('mentor', prompt, tutorMessages);

      const assMsg: ChatMessage = {
        id: `tut-ass-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTutorMessages(prev => [...prev, assMsg]);
    } catch (e) {
      setTutorMessages(prev => [
        ...prev,
        {
          id: `tut-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Tutor connection failed. Please ensure GEMINI_API_KEY is configured.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!selectedCourseId || !selectedOption) return;
    const model = quizQuestions[selectedCourseId];
    if (!model) return;

    if (selectedOption.startsWith(model.ans)) {
      setQuizStatus('success');

      // Dispense Course Reward
      onModifyProfile({
        xp: profile.xp + (selectedCourse?.xpWorth || 100),
        reputationPoints: profile.reputationPoints + (selectedCourse?.xpWorth || 100),
        impactScore: profile.impactScore + 50,
      });

      setNotification(`Outstanding! You scored 100% on the milestone evaluation! Awarded +${selectedCourse?.xpWorth} XP and +50 Impact Index Units.`);
    } else {
      setQuizStatus('fail');
      setNotification('Incorrect option selection. Re-read the chapter guidelines and try again.');
    }

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="glass-card bg-gradient-to-r from-indigo-500/10 via-white/[0.01] to-emerald-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <GraduationCap className="h-6 w-6 text-indigo-400" />
            <h2 className="text-white text-lg md:text-xl font-bold font-sans tracking-tight">
              Learning & Skills Academy
            </h2>
          </div>
          <p className="text-slate-450 text-xs mt-1.5 leading-relaxed">
            Access curated microlearning classes, query real-time AI tutors continuously, take certification quizzes, and unlock valuable badges on the eTopia chain.
          </p>
        </div>

        {selectedCourseId && (
          <button
            onClick={() => {
              setSelectedCourseId(null);
              setShowQuiz(false);
              setQuizStatus('idle');
              setSelectedOption(null);
            }}
            className="glass-button-secondary text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            ← Back to Courses Room
          </button>
        )}
      </div>

      {notification && (
        <div className="bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 p-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer hover:text-white">✕</button>
        </div>
      )}

      {!selectedCourseId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Courses List */}
          {courses.map(crs => (
            <div
              key={crs.id}
              onClick={() => {
                setSelectedCourseId(crs.id);
                setActiveChapterIndex(0);
              }}
              className="glass-card p-6 rounded-2xl cursor-pointer hover:border-white/10 hover:bg-white/[0.03] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                    {crs.level} LEVEL
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-450">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{crs.chapters.length} Modules</span>
                  </div>
                </div>

                <h3 className="text-white text-base font-bold mt-4 leading-tight">
                  {crs.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  {crs.description}
                </p>

                <p className="text-slate-505 text-[11px] mt-4">
                  Led by: <span className="text-slate-350 font-semibold">{crs.instructorName}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Reward Pool</p>
                  <p className="text-amber-400 font-mono font-bold text-xs">+{crs.xpWorth} XP Repute</p>
                </div>
                <button className="glass-button-secondary text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer">
                  Access Syllabus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Syllabus navigator */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <h3 className="text-white text-xs uppercase font-mono font-bold tracking-wider text-slate-450 border-b border-white/5 pb-2">
              Class chapters progress
            </h3>
            
            <div className="space-y-1.5">
              {selectedCourse?.chapters.map((chap, idx) => {
                const isActive = activeChapterIndex === idx;
                const isPast = activeChapterIndex > idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setShowQuiz(false);
                      setQuizStatus('idle');
                      setSelectedOption(null);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition text-xs flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold shadow-[0_0_8px_#818cf815]'
                        : isPast
                        ? 'bg-white/5 text-slate-450 font-medium'
                        : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-350'
                    }`}
                  >
                    <span>{idx + 1}. {chap}</span>
                    {isPast && <CheckCircle2 className="h-4 w-4 text-indigo-455 flex-shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>

            {/* Quiz Trigger button */}
            <button
              onClick={() => {
                setShowQuiz(true);
                setQuizStatus('idle');
                setSelectedOption(null);
              }}
              className="w-full glass-button-primary text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Unlock Milestone Badge (Quiz)</span>
            </button>
          </div>

          {/* Active Workstation / AI Tutor workspace */}
          <div className="lg:col-span-2 space-y-6">
            
            {showQuiz ? (
              /* Multiple Choice Quiz */
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <h4 className="text-white text-base font-bold border-b border-white/5 pb-3 flex items-center gap-1.5">
                  <Award className="h-5 w-5 text-indigo-400 animate-bounce" /> Quiz Assessment: {selectedCourse?.title}
                </h4>

                <div className="mt-5 space-y-4">
                  <p className="text-white font-medium text-xs md:text-sm leading-relaxed">
                    {quizQuestions[selectedCourseId]?.q}
                  </p>

                  <div className="space-y-2 text-xs">
                    {quizQuestions[selectedCourseId]?.opts.map(opt => {
                      const isOptSelected = selectedOption === opt[0];
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (quizStatus !== 'success') {
                              setSelectedOption(opt[0]);
                            }
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                            isOptSelected
                              ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300 font-semibold'
                              : 'glass-card-nested border-white/5 text-slate-300 hover:border-white/10'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-slate-500 font-mono">
                      State Score tracker: {quizStatus === 'success' ? '100% ACCURATE' : 'PENDING'}
                    </span>

                    {quizStatus !== 'success' && (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={!selectedOption}
                        className="glass-button-primary disabled:opacity-50 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Submit Test Option
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Lesson body with integrated AI Tutor Chat */
              <div className="space-y-6">
                {/* Lesson body placeholder context */}
                <div className="glass-card p-6 rounded-2xl">
                  <h4 className="text-white text-base font-bold">
                    Chapter Vetting: "{selectedCourse?.chapters[activeChapterIndex]}"
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans mt-3">
                    This module outlines safe parameters for community deployment on eTopia. Review constraints of data protection, secure escrow validation checklists, and local cooperative bylaws before advancing. Ask our integrated AI Tutor in the workspace below for direct, continuous context audits.
                  </p>
                </div>

                {/* AI Tutor Chat */}
                <div className="glass-card p-0 rounded-2xl border border-white/5 flex flex-col h-[320px] overflow-hidden">
                  <div className="bg-white/[0.02] py-2.5 px-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs text-white font-bold flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-455 fill-indigo-400" /> Lesson Copilot Tutor
                    </span>
                    <span className="bg-indigo-500/10 text-indigo-305 border border-indigo-500/20 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                      ONLINE
                    </span>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
                    {tutorMessages.map((m, index) => {
                      const isAss = m.sender === 'assistant';
                      return (
                        <div key={index} className={`flex ${isAss ? 'justify-start' : 'justify-end'}`}>
                          <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed border ${
                            isAss ? 'glass-card-nested border-white/5 text-slate-300' : 'bg-indigo-500/15 text-indigo-250 border-indigo-400/20 font-medium'
                          }`}>
                            <p>{m.text}</p>
                            <span className={`text-[8px] block text-right mt-1.5 ${isAss ? 'text-slate-500' : 'text-indigo-400/65'}`}>
                              {m.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="glass-card-nested border-white/5 rounded-2xl p-2.5 flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                          <span>AI Tutor drafting response lesson...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message entry form */}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleTutorSendMessage(tutorInput);
                    }}
                    className="p-2.5 bg-white/[0.02] border-t border-white/5 flex gap-2"
                  >
                    <input
                      type="text"
                      value={tutorInput}
                      onChange={e => setTutorInput(e.target.value)}
                      placeholder="Ask our AI Tutor concerning this chapters data..."
                      className="flex-1 glass-input rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-550 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!tutorInput.trim()}
                      className="glass-button-primary disabled:opacity-50 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer"
                    >
                      Query Tutor
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
