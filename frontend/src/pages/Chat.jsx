
import { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send } from 'lucide-react';

export default function SearchDashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendQuery = async e => {
    e.preventDefault();
    if (!input.trim()) return;
    // add user message
    setMessages(m => [...m, { from: 'user', text: input }]);
    const q = input;
    setInput('');
    // call backend
    const { data } = await axios.post(
      `http://localhost:5000/api/search`,
      { query: q }
    );
    // format results
    const text =
      data.length === 0
        ? 'No matches found.'
        : data
            .map(
              p =>
                `🏠 ${p.bedrooms}br/${p.bathrooms}ba in ${p.location}, $${p.price} — ${p.info_text}`
            )
            .join('\n\n');
    setMessages(m => [...m, { from: 'bot', text }]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="p-4 bg-white border-b flex items-center">
        <MessageSquare className="mr-2" /> 
        <h1 className="text-xl font-semibold">Rental Chat Search</h1>
      </header>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.from === 'user'
                ? 'text-right'
                : 'text-left bg-white p-2 rounded-lg shadow'
            }
          >
            {msg.text.split('\n').map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <form
        onSubmit={sendQuery}
        className="p-4 bg-white border-t flex items-center space-x-2"
      >
        <input
          className="flex-1 border rounded-lg px-4 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe what you’re looking for…"
        />
        <button type="submit" className="p-2 bg-blue-600 rounded-full text-white">
          <Send />
        </button>
      </form>
    </div>
  );
}
