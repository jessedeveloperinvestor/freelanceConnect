import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function MessageBox({ conversation, recipient, messages, onSendMessage }) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    onSendMessage({
      content: newMessage,
      senderId: user.id,
      recipientId: recipient.id,
      conversationId: conversation.id
    });
    
    setNewMessage('');
  };
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 flex items-center">
        <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center text-lg font-bold mr-3">
          {recipient.fullName ? recipient.fullName.charAt(0).toUpperCase() : recipient.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-medium">{recipient.fullName || recipient.username}</h3>
          <p className="text-xs opacity-75">{recipient.role === 'professional' ? 'Freelancer' : 'Client'}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {Object.keys(groupedMessages).map(date => (
          <div key={date}>
            <div className="text-center my-3">
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {formatDate(new Date(date))}
              </span>
            </div>
            
            {groupedMessages[date].map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.senderId === user.id ? 
                    'bg-blue-600 text-white rounded-br-none' : 
                    'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.senderId === user.id ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(message.createdAt)}
                    {message.read && message.senderId === user.id && (
                      <span className="ml-2">✓</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
