import { withAuth } from '../../../utils/auth';
import { createMessage, getUserConversations } from '../../../utils/db';
import { validateMessage } from '../../../utils/validation';
import { getUserFromRequest } from '../../../utils/auth';

async function handler(req, res) {
  const user = getUserFromRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // GET method to retrieve user's conversations
  if (req.method === 'GET') {
    try {
      const conversations = getUserConversations(user.id);
      return res.status(200).json(conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // POST method to create a new message
  if (req.method === 'POST') {
    try {
      const messageData = {
        ...req.body,
        senderId: user.id
      };
      
      // Generate conversationId if not provided
      if (!messageData.conversationId) {
        // Create a unique conversation ID based on the two users
        const users = [messageData.senderId, messageData.recipientId].sort();
        messageData.conversationId = `conv_${users.join('_')}`;
      }
      
      // Validate message data
      const { isValid, errors } = validateMessage(messageData);
      
      if (!isValid) {
        return res.status(400).json({ errors });
      }
      
      // Create message
      const newMessage = createMessage(messageData);
      
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
