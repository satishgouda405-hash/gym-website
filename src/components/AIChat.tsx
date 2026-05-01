import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';
import { X, Send, Bot, User, Flame } from 'lucide-react';

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hey there, champion! Welcome to Body Tone Fitness. I\'m your AI gym assistant. I can help you with membership plans, class schedules, equipment info, workout tips, or booking a visit. What can I help you crush today?' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  const chatMutation = trpc.gym.chatSend.useMutation({
    onSuccess: (data) => {
      setLocalMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;
    
    const userMsg = message.trim();
    setLocalMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setMessage('');
    
    if (isAuthenticated) {
      chatMutation.mutate({ message: userMsg });
    } else {
      // Fallback AI response for non-logged in users
      setTimeout(() => {
        const lowerMsg = userMsg.toLowerCase();
        let response = '';
        if (lowerMsg.includes('price') || lowerMsg.includes('membership') || lowerMsg.includes('plan')) {
          response = 'Our membership plans are designed for every fitness level! We offer Monthly (₹1,999), Quarterly (₹4,999), Half-Yearly (₹8,999), and Annual (₹14,999) plans. Each includes unlimited gym access, all group classes, and locker facilities. The Annual plan also includes 2 personal training sessions per month. Which plan interests you?';
        } else if (lowerMsg.includes('class') || lowerMsg.includes('schedule')) {
          response = 'We run classes 7 days a week! Highlights include HIIT Blast (Mon/Wed/Fri 6:00 AM), Power Yoga (Tue/Thu 7:00 AM), CrossFit (Mon/Wed/Fri 6:00 PM), Zumba (Tue/Thu/Sat 6:00 PM), and Spin Cycle (Daily 7:00 PM). Would you like me to book a class for you? (Login required for booking)';
        } else if (lowerMsg.includes('equipment') || lowerMsg.includes('machine')) {
          response = 'Body Tone Fitness features 3 floors of premium equipment! Floor 1: Cardio deck with treadmills, ellipticals, rowers, and StairMasters. Floor 2: Strength zone with dumbbells up to 50kg, Smith machines, cable stations, and power racks. Floor 3: Functional fitness with battle ropes, TRX, kettlebells, sleds, and a turf area. What would you like to train today?';
        } else if (lowerMsg.includes('location') || lowerMsg.includes('address')) {
          response = "We're located on the 4th floor of Arihant Elite Complex, above First Cry, Shirur Park, Vidya Nagar, Hubballi, Karnataka 580031. We're open 5:00 AM to 10:30 PM, 7 days a week. Call or WhatsApp us at +91 86601 69891 for directions!";
        } else if (lowerMsg.includes('offer') || lowerMsg.includes('discount')) {
          response = 'Current offers: 20% off on Annual memberships, Student discount (15% off with valid ID), Couple membership at ₹24,999/year, and a FREE 3-day trial for first-time visitors. Book your trial through WhatsApp or visit us directly!';
        } else {
          response = "Great question! At Body Tone Fitness, we're all about helping you achieve your goals. I can assist with membership plans, class bookings, equipment details, workout recommendations, or general gym info. Could you tell me more about what you're looking for?";
        }
        setLocalMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }, 800);
    }
  };

  const quickReplies = [
    'Membership prices?',
    'Class schedule',
    'Equipment info',
    'Free trial',
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          open 
            ? 'bg-[#2a201c] text-[#ff6b35] rotate-90' 
            : 'bg-gradient-to-r from-[#ff6b35] to-[#ff9f1c] text-[#120a08] hover:scale-110 magma-glow'
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] rounded-2xl overflow-hidden surface-01 border border-[#ff6b35]/30 shadow-2xl shadow-[#ff6b35]/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#2a201c] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff9f1c] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#120a08]" />
            </div>
            <div>
              <h4 className="font-bold text-[#f5f5f0] text-sm">Body Tone AI</h4>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-[#a89f9b]">Online</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-[#ff6b35]/10">
              <Flame className="w-3 h-3 text-[#ff6b35]" />
              <span className="text-xs text-[#ff6b35] font-medium">Gym Assistant</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {localMessages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-[#2a201c]' : 'bg-gradient-to-br from-[#ff6b35] to-[#ff9f1c]'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-[#a89f9b]" />
                  ) : (
                    <Bot className="w-4 h-4 text-[#120a08]" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#ff6b35] text-[#120a08] rounded-br-none'
                    : 'bg-[#2a201c] text-[#f5f5f0] rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff9f1c] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#120a08]" />
                </div>
                <div className="bg-[#2a201c] p-3 rounded-xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => { setMessage(reply); handleSend(); }}
                className="shrink-0 px-3 py-1.5 text-xs rounded-lg bg-[#2a201c] text-[#a89f9b] hover:text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-all border border-[#2a201c] hover:border-[#ff6b35]/30"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#2a201c] flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about plans, classes, equipment..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#2a201c] border border-transparent text-[#f5f5f0] placeholder-[#a89f9b]/50 text-sm focus:border-[#ff6b35] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!message.trim() || chatMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff9f1c] text-[#120a08] disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-[#ff6b35]/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
