import { getUserByEmail, getUserById } from '../../utils/db';
import { verifyPassword, generateToken, setAuthCookie } from '../../utils/auth';
import { validateLogin } from '../../utils/validation';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Validate login data
    const { isValid, errors } = validateLogin({ email, password });
    
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    // Find user by email
    const user = getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const passwordValid = await verifyPassword(password, user.password);
    
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });
    
    // Set auth cookie
    setAuthCookie(res, token);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
