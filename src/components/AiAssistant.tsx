import { useState, useRef, useEffect, FormEvent } from "react";
import { Sparkles, MessageSquare, Send, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export default function AiAssistant() {
  const { currentLang } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  // Initialize welcome messages on language change
  useEffect(() => {
    if (currentLang === "fr") {
      setMessages([
        {
          sender: "assistant",
          text: "Bonjour ! Je suis votre assistant virtuel Service Canada. Comment puis-je vous aider aujourd'hui avec vos démarches de biométrie, vos délais de 30 jours, ou vos passeports ?",
        },
      ]);
    } else {
      setMessages([
        {
          sender: "assistant",
          text: "Hello! I am your Service Canada Virtual Assistant. How can I help you today with biometrics submission rules, the 30-day instruction letters, or passport timelines?",
        },
      ]);
    }
  }, [currentLang]);

  // Auto-scroll to the bottom of the conversation window
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          lang: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "assistant", text: data.text }]);
    } catch (err) {
      console.error("AI fetch failed:", err);
      const fallbackMsg =
        currentLang === "fr"
          ? "Désolé, j'ai rencontré un problème pour me connecter au serveur d'IA. Veuillez réessayer dans quelques instants."
          : "Sorry, I had trouble reaching the AI assistant server. Please try again in a moment.";
      setMessages((prev) => [...prev, { sender: "assistant", text: fallbackMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const t =
    currentLang === "fr"
      ? {
          title: "Soutien IA Service Canada",
          subtitle: "Session sécurisée active",
          placeholder: "Posez votre question...",
          hint: "Ex: Comment obtenir ma lettre biométrique ?",
          btnOpen: "Aide IA en direct",
        }
      : {
          title: "Service Canada AI Support",
          subtitle: "Secure session active",
          placeholder: "Ask a question...",
          hint: "Eg: How do I schedule my biometrics appointment?",
          btnOpen: "Live AI Support",
        };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#af3c43] hover:bg-[#8f2f35] text-white font-bold text-xs px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer border border-[#af3c43]/40 focus:ring-2 focus:ring-offset-2 focus:ring-[#af3c43] outline-none"
          id="ai-floating-trigger-btn"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
          <span>{t.btnOpen}</span>
        </button>
      )}

      {/* Main chat modal wrapper */}
      {isOpen && (
        <div
          className="bg-white border border-gray-200 rounded-xl shadow-2xl w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
          id="ai-chat-window-panel"
        >
          {/* Header */}
          <div className="bg-[#26374a] text-white px-4 py-3.5 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="bg-[#af3c43] p-1.5 rounded-lg text-white">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm leading-none">{t.title}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1 font-mono">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {t.subtitle}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div
            ref={listRef}
            className="flex-grow overflow-y-auto p-4 bg-gray-55 space-y-3.5"
            id="ai-messages-list"
          >
            {messages.map((msg, index) => {
              const isAssistant = msg.sender === "assistant";
              return (
                <div
                  key={index}
                  className={`flex gap-2.5 items-start ${isAssistant ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAssistant
                        ? "bg-[#26374a] text-white"
                        : "bg-gradient-to-br from-[#af3c43] to-[#8f2f35] text-white"
                    }`}
                  >
                    {isAssistant ? "CA" : "U"}
                  </div>
                  <div
                    className={`max-w-[78%] rounded-xl px-3.5 py-2 text-xs md:text-[13px] leading-relaxed shadow-3xs ${
                      isAssistant
                        ? "bg-white text-gray-800 border border-gray-150 rounded-tl-none"
                        : "bg-[#2572b4] text-white rounded-tr-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Active loading state */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-[#26374a] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  CA
                </div>
                <div className="bg-white border border-gray-150 rounded-xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
          </div>

          {/* Form Input footer */}
          <div className="p-3.5 border-t bg-white space-y-2">
            <form onSubmit={handleSend} className="flex gap-2" id="ai-chat-input-form">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t.placeholder}
                className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none text-gray-800 focus:border-[#2572b4] focus:ring-1 focus:ring-[#2572b4]"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-[#2572b4] hover:bg-[#05355c] disabled:bg-gray-300 text-white p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center shrink-0"
                disabled={!inputVal.trim() || isLoading}
                id="ai-send-msg-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 italic text-center leading-normal">
              {t.hint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
