import { useState } from 'react';

interface DebateControlsProps {
  onStart: (topic: string, position: string) => Promise<void>;
  disabled: boolean;
}

export function DebateControls({ onStart, disabled }: DebateControlsProps) {
  const [topic, setTopic] = useState('');
  const [position, setPosition] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !position.trim()) return;
    await onStart(topic, position);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Start a New Debate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Debate Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter the debate topic"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Your Position
          </label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your position (e.g., For, Against)"
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !topic.trim() || !position.trim()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          Start Debate
        </button>
      </form>
    </div>
  );
} 