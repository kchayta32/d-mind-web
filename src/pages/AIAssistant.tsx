
import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionGuide from '@/components/QuestionGuide';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { useAIChat } from '@/hooks/useAIChat';

const AIAssistant = () => {
  const navigate = useNavigate();
  const {
    message,
    setMessage,
    messages,
    isLoading,
    handleQuestionSelect,
    handleSendMessage
  } = useAIChat();

  // Show guide only when there's just the initial message
  const showQuestionGuide = messages.length === 1;

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <ChatHeader onGoBack={handleGoBack} />

      <QuestionGuide 
        onQuestionSelect={handleQuestionSelect}
        isVisible={showQuestionGuide}
      />

      <ChatMessages messages={messages} isLoading={isLoading} />

      <ChatInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AIAssistant;
