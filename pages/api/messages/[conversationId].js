import { withAuth } from '../../../utils/auth';
import { getConversationMessages, markMessagesAsRead } from '../../../utils/db';
import { getUserFromRequest } from '../../../utils/auth';

async function handler(req, res) {
  const user = getUserFromRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Get conversation ID from URL
  const { conversationId } = req.query;
  
  // GET method to retrieve messages for a conversation
  if (req.method === 'GET') {
    try {
      const messages = getConversationMessages(conversationId);
      
      // Check if user is part of this conversation
      const userInConversation = messages.some(
        message => message.senderId === user.id || message.recipientId === user.id
      );
      
      if (!userInConversation && messages.length > 0) {
        return res.status(403).json({ error: 'You do not have permission to view this conversation' });
      }
      
      // Mark messages as read
      markMessagesAsRead(conversationId, user.id);
      
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // PUT method to mark messages as read
  if (req.method === 'PUT') {
    try {
      const updated = markMessagesAsRead(conversationId, user.id);
      
      if (updated) {
        return res.status(200).json({ message: 'Messages marked as read' });
      } else {
        return res.status(200).json({ message: 'No messages to mark as read' });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
