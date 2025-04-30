import { hashPassword } from '../../utils/auth';
import { createUser, getUserByEmail, getUserByUsername } from '../../utils/db';
import { validateUser } from '../../utils/validation';
import { generateToken, setAuthCookie } from '../../utils/auth';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userData = req.body;
    
    // Validate user data
    const { isValid, errors } = validateUser(userData);
    
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    // Check if user already exists
    const existingEmail = getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const existingUsername = getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user with hashed password
    const newUser = createUser({
      ...userData,
      password: hashedPassword
    });
    
    // Generate JWT token
    const token = generateToken({ id: newUser.id, role: newUser.role });
    
    // Set auth cookie
    setAuthCookie(res, token);
    
    // Return user without password
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
