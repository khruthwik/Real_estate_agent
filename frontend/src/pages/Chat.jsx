import React, { useState } from 'react';

export default function SearchBroker() {
  const [msgLog, setMsgLog] = useState([
    { from: 'bot', text: '👋 Hi, Im your AI real-estate broker. How can I help you today?' }
  ]);
  const [inbox, setInbox] = useState('');

  const send = async () => {
    if (!inbox.trim()) return;
    const userMsg = inbox;
    setMsgLog(log => [...log, { from: 'user', text: userMsg }]);
    setInbox('');

    // call /api/search first
    const searchRes = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userMsg })
    });
    const { exact, recommendations, ranked } = await searchRes.json();

    let reply;
    if (exact.length) {
      reply = `I found ${exact.length} exact match${
        exact.length > 1 ? 'es' : ''
      }.`;
    } else {
      reply = `No exact matches—here are some ${recommendations.length} you might like.`;
    }

    setMsgLog(log => [...log, { from: 'bot', text: reply }]);

    // show property cards
    const display = (exact.length ? ranked : recommendations).map(p => ({
      from: 'bot',
      text: `${p.title} — ¥${p.price}/mo, ${p.bedrooms}br · ${p.bathrooms}ba, ${
        p.features.petFriendly ? 'Pet-friendly, ' : ''
      }${p.features.parking ? 'Parking' : ''}`
    }));
    setMsgLog(log => [...log, ...display]);

    // if user wants to ask arbitrary things:
    if (!exact.length && !recommendations.length) {
      // fallback to raw chat
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const { reply: chatReply } = await chatRes.json();
      setMsgLog(log => [...log, { from: 'bot', text: chatReply }]);
    }
  };

  return (
    <div className="mx-auto bg-white rounded-xl shadow p-4 space-y-4 h-screen">
      <div className="h-64 overflow-y-auto border p-2 space-y-2 h-full">
        {msgLog.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                m.from === 'bot' ? 'bg-gray-200' : 'bg-blue-400 text-white'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          value={inbox}
          onChange={e => setInbox(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask me about properties…"
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
