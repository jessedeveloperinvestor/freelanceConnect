import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ProtectedRoute from '../components/ProtectedRoute';
import MessageBox from '../components/MessageBox';
import { useAuth } from '../hooks/useAuth';

function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id: conversationId, recipient: recipientId } = router.query;
  const [activeConversation, setActiveConversation] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [error, setError] = useState('');
  
  // Fetch conversations
  const { data: conversations, mutate: mutateConversations } = useSWR('/api/messages');
  
  // Fetch messages for active conversation
  const { data: messages, mutate: mutateMessages } = useSWR(
    activeConversation ? `/api/messages/${activeConversation.id}` : null
  );
  
  // Fetch recipient user data if recipientId is provided
  const { data: recipientData } = useSWR(
    recipientId ? `/api/user/${recipientId}` : null
  );
  
  // Set active conversation based on URL parameters
  useEffect(() => {
    if (!conversations) return;
    
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else if (recipientId && recipientData) {
      // Check if a conversation with this recipient already exists
      const existingConversation = conversations.find(c => c.otherUserId === recipientId);
      
      if (existingConversation) {
        setActiveConversation(existingConversation);
        // Update URL without reloading the page
        router.push(`/messages?id=${existingConversation.id}`, undefined, { shallow: true });
      } else {
        // Create a new conversation object
        setActiveConversation({
          id: `conv_${[user.id, recipientId].sort().join('_')}`,
          otherUserId: recipientId,
          otherUserName: recipientData.fullName || recipientData.username,
          unread: 0,
          latestMessage: { createdAt: new Date().toISOString() }
        });
      }
      
      setRecipient(recipientData);
    }
  }, [conversations, conversationId, recipientId, recipientData, router, user]);
  
  // Set recipient from active conversation
  useEffect(() => {
    if (!activeConversation || recipient) return;
    
    const fetchRecipient = async () => {
      try {
        const response = await fetch(`/api/user/${activeConversation.otherUserId}`);
        if (response.ok) {
          const userData = await response.json();
          setRecipient(userData);
        } else {
          throw new Error('Failed to fetch recipient data');
        }
      } catch (error) {
        console.error('Error fetching recipient:', error);
        setError('Failed to load recipient information');
      }
    };
    
    fetchRecipient();
  }, [activeConversation, recipient]);
  
  const handleSendMessage = async (messageData) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      
      // Update messages list
      mutateMessages(messages ? [...messages, newMessage] : [newMessage], false);
      
      // If this is a new conversation, update the conversations list
      if (!conversations?.find(c => c.id === activeConversation.id)) {
        const newConversation = {
          ...activeConversation,
          latestMessage: newMessage
        };
        
        mutateConversations(
          conversations ? [newConversation, ...conversations] : [newConversation],
          false
        );
      } else {
        // Update existing conversation with latest message
        mutateConversations(
          conversations.map(c => 
            c.id === activeConversation.id 
              ? { ...c, latestMessage: newMessage }
              : c
          ),
          false
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };
  
  if (!user) {
    return null; // Protected route handles redirection
  }
  
  return (
    <div className="min-h-[600px] flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex-grow bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r h-full">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              {!conversations ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet.</p>
                  <p className="text-sm mt-1">Start by messaging someone!</p>
                </div>
              ) : (
                conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setActiveConversation(conversation);
                      router.push(`/messages?id=${conversation.id}`, undefined, { shallow: true });
                    }}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold mr-3">
                        {conversation.otherUserName?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium truncate">{conversation.otherUserName}</h3>
                          {conversation.latestMessage && (
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.latestMessage.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {conversation.latestMessage && (
                          <p className="text-sm text-gray-600 truncate">{conversation.latestMessage.content}</p>
                        )}
                      </div>
                      {conversation.unread > 0 && (
                        <div className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Message Area */}
          <div className="w-2/3 flex flex-col h-full">
            {activeConversation && recipient ? (
              <MessageBox
                conversation={activeConversation}
                recipient={recipient}
                messages={messages || []}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center p-6">
                  <i className="fas fa-comments text-gray-300 text-6xl mb-4"></i>
                  <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                  <p>Select a conversation or start a new one by messaging someone.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  );
}
