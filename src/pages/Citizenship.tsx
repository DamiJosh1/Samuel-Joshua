import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Compass, Sparkles, BookOpen, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Question {
  qu: string;
  quFr: string;
  opts: string[];
  optsFr: string[];
  ans: number; // index of correct option
}

export default function Citizenship() {
  const { currentLang } = useApp();

  const questionsData: Question[] = [
    {
      qu: "Who is Canada's official Head of State?",
      quFr: "Qui est le chef d'État officiel du Canada ?",
      opts: ["The Prime Minister of Canada", "His Majesty King Charles III", "The Governor General", "The Chief Justice of Canada"],
      optsFr: ["Le Premier ministre du Canada", "Sa Majesté le Roi Charles III", "Le Gouverneur général", "Le Juge en chef du Canada"],
      ans: 1
    },
    {
      qu: "What are the three core branches of the Canadian Government system?",
      quFr: "Quels sont les trois pouvoirs fondamentaux du système de gouvernance canadien ?",
      opts: ["Executive, Legislative, and Judicial", "Federal, Provincial, and Municipal", "House of Commons, Senate, and Cabinet", "Crown, Parliament, and Premier"],
      optsFr: ["Exécutif, Législatif et Judiciaire", "Fédéral, Provincial et Municipal", "Chambre des communes, Sénat et Cabinet", "Couronne, Parlement et Ministre"],
      ans: 0
    },
    {
      qu: "What is the capital city of Canada?",
      quFr: "Quelle est la capitale nationale du Canada ?",
      opts: ["Toronto", "Montreal", "Vancouver", "Ottawa"],
      optsFr: ["Toronto", "Montréal", "Vancouver", "Ottawa"],
      ans: 3
    },
    {
      qu: "Which province currently holds the largest population in Canada?",
      quFr: "Quelle province compte actuellement la plus grande population au Canada ?",
      opts: ["Quebec", "Ontario", "British Columbia", "Alberta"],
      optsFr: ["Québec", "Ontario", "Colombie-Britannique", "Alberta"],
      ans: 1
    },
    {
      qu: "When was the Canadian Confederation formed?",
      quFr: "En quelle année la Confédération canadienne a-t-elle été formée ?",
      opts: ["July 1, 1867", "July 1, 1776", "July 1, 1982", "November 11, 1918"],
      optsFr: ["1er juillet 1867", "1er juillet 1776", "1er juillet 1982", "11 novembre 1918"],
      ans: 0
    }
  ];

  // Quiz interactive state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
  };

  const handleQuizSubmit = (e: any) => {
    e.preventDefault();
    if (Object.keys(userAnswers).length < questionsData.length) return;

    let calScore = 0;
    questionsData.forEach((item, idx) => {
      if (userAnswers[idx] === item.ans) {
        calScore += 1;
      }
    });

    setScore(calScore);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const isPass = score >= 4; // Passing is 80% (4 out of 5)

  return (
    <main className="mx-auto max-w-6xl w-full px-4 py-8 md:py-12 flex-grow space-y-10 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#333] border-b-2 border-[#af3c43] pb-2 mb-4">
          {currentLang === 'en' ? 'Canadian citizenship knowledge test' : 'Examen de connaissances de la citoyenneté'}
        </h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl text-sm md:text-base">
          {currentLang === 'en'
            ? 'Discover qualifications criteria to secure citizenship, prepare using the study guide "Discover Canada", or answer our simulated mock questions below.'
            : 'Prenez connaissance des exigences requises pour demander l\'attribution, révisez le recueil officiel et testez vos connaissances.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Mock Exam Simulator Container (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleQuizSubmit} className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base font-bold text-[#333] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#af3c43]" />
                {currentLang === 'en' ? 'Interactive Mock Exam Challenge' : 'Examen blanc simulé interactif'}
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {currentLang === 'en' ? `${answeredCount}/5 Answered` : `${answeredCount}/5 Répondu`}
              </span>
            </div>

            {/* Questions stack */}
            <div className="space-y-6">
              {questionsData.map((item, qIdx) => {
                const isCorrect = userAnswers[qIdx] === item.ans;
                return (
                  <div key={qIdx} className="space-y-3 border-b pb-5 last:border-b-0 last:pb-0">
                    <h3 className="text-sm font-bold text-gray-800">
                      {qIdx + 1}. {currentLang === 'en' ? item.qu : item.quFr}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.opts.map((opt, oIdx) => {
                        const isSelected = userAnswers[qIdx] === oIdx;
                        const optText = currentLang === 'en' ? opt : item.optsFr[oIdx];
                        
                        let optBg = "bg-gray-50 hover:bg-gray-100 border-gray-200";
                        if (isSelected) optBg = "bg-blue-50 border-blue-400 text-[#12365c]";
                        if (quizSubmitted) {
                          if (oIdx === item.ans) {
                            optBg = "bg-green-50 border-green-400 text-green-900";
                          } else if (isSelected && !isCorrect) {
                            optBg = "bg-red-50 border-red-400 text-red-900";
                          }
                        }

                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className={`border rounded-lg px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${optBg}`}
                          >
                            <span>{optText}</span>
                            {quizSubmitted && oIdx === item.ans && (
                              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission Buttons */}
            {!quizSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount < questionsData.length}
                className={`w-full font-bold text-sm py-3 rounded transition-colors text-white ${answeredCount < questionsData.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#af3c43] hover:bg-[#8f2f35] cursor-pointer'}`}
              >
                {currentLang === 'en' ? 'Grade My Knowledge Test' : 'Corriger mon examen blanc'}
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div className={`p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 ${isPass ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      {currentLang === 'en' ? 'Simulation Results:' : 'Résultat de la simulation :'}
                    </span>
                    <h3 className="text-lg font-extrabold flex items-center gap-1.5 justify-center sm:justify-start">
                      {isPass ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>{currentLang === 'en' ? 'PASS (80%+ Criterion Met)' : 'RÉUSSI (Critères remplis)'}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span>{currentLang === 'en' ? 'FAIL (Requires 4/5 answers)' : 'ÉCHEC (Nécessite 4 bonnes réponses)'}</span>
                        </>
                      )}
                    </h3>
                    <p className="text-xs text-opacity-80">
                      {currentLang === 'en'
                        ? 'To qualify for physical citizenship, you must answer at least 15 of 20 questions correctly on your official examination.'
                        : 'Pour obtenir votre citoyenneté, vous devez répondre à au moins 15 questions sur 20 lors de l\'examen réel.'}
                    </p>
                  </div>
                  <div className="text-center shrink-0">
                    <span className="text-3xl font-extrabold block">{score} / 5</span>
                    <span className="text-[10px] font-bold block uppercase">{currentLang === 'en' ? 'Correct Answers' : 'Bonnes réponses'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetQuiz}
                  className="w-full bg-[#335075] hover:bg-[#1c3552] text-white text-xs font-bold py-2.5 rounded flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Try Another Simulated Exam' : 'Recommencer l\'examen simulé'}</span>
                </button>
              </div>
            )}

          </form>
        </div>

        {/* Right Info Bar widget (col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-[#333] tracking-widest uppercase border-b pb-2 flex items-center gap-1">
              <Compass className="w-4 h-4 text-[#af3c43]" />
              {currentLang === 'en' ? 'Physical Requirements' : 'Critères physiques'}
            </h3>

            <div className="space-y-3.5 text-gray-650 leading-relaxed">
              <p>
                {currentLang === 'en'
                  ? 'Physical Presence: You must have been physically present in Canada for at least 1,095 days (3 years) during the 5 years immediately before your signing date.'
                  : 'Présence physique : Vous devez avoir été présent en personne au Canada pendant au moins 1 095 jours (3 ans) au cours des 5 dernières années.'}
              </p>
              <p>
                {currentLang === 'en'
                  ? 'Tax Filing: You must have filed your personal income taxes for at least 3 years during the eligible term matching physical residence.'
                  : 'Déclaration fiscale : Vous devez avoir produit vos déclarations de revenus personnelles pour au moins 3 années d\'imposition.'}
              </p>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
