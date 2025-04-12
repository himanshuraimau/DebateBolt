"use client"

import { useState } from 'react';
import { useDebate } from '@/lib/contexts/DebateContext';
import { DebateControls } from '@/components/debate/DebateControls';
import { DebateMessages } from '@/components/debate/DebateMessages';
import { DebateFeedback } from '@/components/debate/DebateFeedback';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function DebatePage() {
  const { debate, state, error, startDebate, sendMessage, endDebate, resetDebate } = useDebate();
  const [input, setInput] = useState('');

  const handleStartDebate = async (topic: string, position: string) => {
    await startDebate(topic, position);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  const handleEndDebate = async () => {
    await endDebate();
  };

  if (state === 'loading') {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={resetDebate} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {!debate ? (
          <DebateControls
            onStart={handleStartDebate}
            disabled={state === 'loading'}
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{debate.topic}</h1>
              <p className="text-gray-600">Position: {debate.position}</p>
            </div>
            
            <DebateMessages messages={debate.messages} />
            
            {state === 'active' && (
              <div className="mt-8">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full p-4 border rounded-lg mb-4"
                  rows={4}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={state === 'loading'}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            )}
            
            {state === 'completed' && debate.feedback && (
              <DebateFeedback feedback={debate.feedback} />
            )}
            
            {state === 'active' && (
              <button
                onClick={handleEndDebate}
                className="mt-8 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                End Debate
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
