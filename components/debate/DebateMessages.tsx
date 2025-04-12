import { Message } from '@/types/debate';

interface DebateMessagesProps {
  messages: Message[];
}

export function DebateMessages({ messages }: DebateMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.role === 'user'
              ? ' ml-auto max-w-[80%]'
              : ' mr-auto max-w-[80%]'
          }`}
        >
          <div className="text-sm text-gray-500 mb-1">
            {message.role === 'user' ? 'You' : 'AI'}
          </div>
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className="text-xs text-gray-400 mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
} 