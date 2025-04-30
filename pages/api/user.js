import { getUserFromRequest, withAuth } from '../../utils/auth';
import { getUserById, updateUser } from '../../utils/db';
import { validateProfile } from '../../utils/validation';
import { hashPassword } from '../../utils/auth';

async function handler(req, res) {
  // GET method to retrieve user info
  if (req.method === 'GET') {
    // Se um ID for fornecido, retorna informações públicas desse usuário
    if (req.query.id) {
      const user = getUserById(Number(req.query.id));
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Retorna apenas informações públicas
      const publicInfo = {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        paypalEmail: user.paypalEmail,
        createdAt: user.createdAt
      };
      
      return res.status(200).json(publicInfo);
    }
    
    // Caso contrário, recupera o próprio usuário
    const token = getUserFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = getUserById(token.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  }
  
  // PUT method to update user profile
  if (req.method === 'PUT') {
    const token = getUserFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = getUserById(token.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updateData = req.body;
    
    // Validate profile data
    const { isValid, errors } = validateProfile(updateData);
    
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    // If password is provided, hash it
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    
    // Update user
    const updatedUser = updateUser(token.id, updateData);
    
    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
    
    return res.status(200).json(updatedUser);
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
