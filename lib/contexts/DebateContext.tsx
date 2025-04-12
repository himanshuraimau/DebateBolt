'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Debate, Message, DebateState } from '@/types/debate';
import { analyzeArgument, generateDebateResponse, generateDebateFeedback } from '@/lib/services/cerebras';

interface DebateContextType {
  debate: Debate | null;
  state: DebateState;
  error: string | null;
  startDebate: (topic: string, position: string) => Promise<void>;
  sendMessage: (content: string, analysis?: {
    score: number;
    feedback: string;
    rebuttals: string[];
    deliveryTips: string;
    userScore: number;
  }) => Promise<void>;
  endDebate: () => Promise<void>;
  resetDebate: () => void;
}

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export function DebateProvider({ children }: { children: React.ReactNode }) {
  const [debate, setDebate] = useState<Debate | null>(null);
  const [state, setState] = useState<DebateState>('idle');
  const [error, setError] = useState<string | null>(null);

  const startDebate = useCallback(async (topic: string, position: string) => {
    try {
      setState('loading');
      setError(null);

      const initialMessage = await generateDebateResponse([
        {
          role: 'user',
          content: `I am taking the ${position} position on the topic: ${topic}. Please provide an opening statement.`
        }
      ]);

      const newDebate: Debate = {
        id: Date.now().toString(),
        topic,
        position,
        messages: [
          {
            id: '1',
            role: 'assistant',
            content: initialMessage,
            timestamp: new Date().toISOString()
          }
        ],
        feedback: null,
        userScore: 0,
        createdAt: new Date().toISOString()
      };

      setDebate(newDebate);
      setState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start debate');
      setState('error');
    }
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    analysis?: {
      score: number;
      feedback: string;
      rebuttals: string[];
      deliveryTips: string;
      userScore: number;
    }
  ) => {
    if (!debate) return;

    try {
      setState('loading');
      setError(null);

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...debate.messages, userMessage];
      setDebate(prev => prev ? { ...prev, messages: updatedMessages } : null);

      const aiResponse = await generateDebateResponse([
        ...updatedMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setDebate(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiMessage],
        userScore: analysis?.userScore ?? prev.userScore
      } : null);
      setState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setState('error');
    }
  }, [debate]);

  const endDebate = useCallback(async () => {
    if (!debate) return;

    try {
      setState('loading');
      setError(null);

      const feedback = await generateDebateFeedback(
        debate.messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      );

      setDebate(prev => prev ? {
        ...prev,
        feedback
      } : null);
      setState('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end debate');
      setState('error');
    }
  }, [debate]);

  const resetDebate = useCallback(() => {
    setDebate(null);
    setState('idle');
    setError(null);
  }, []);

  return (
    <DebateContext.Provider value={{
      debate,
      state,
      error,
      startDebate,
      sendMessage,
      endDebate,
      resetDebate
    }}>
      {children}
    </DebateContext.Provider>
  );
}

export function useDebate() {
  const context = useContext(DebateContext);
  if (context === undefined) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
} 