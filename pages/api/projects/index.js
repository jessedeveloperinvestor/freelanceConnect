import { withAuth } from '../../../utils/auth';
import { createProject, getProjects, searchProjects } from '../../../utils/db';
import { validateProject } from '../../../utils/validation';
import { getUserFromRequest } from '../../../utils/auth';

async function handler(req, res) {
  const user = getUserFromRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // GET method to retrieve all projects or search
  if (req.method === 'GET') {
    try {
      const { keyword, category, budget, status } = req.query;
      
      // If query parameters are provided, search projects
      if (keyword || category || budget || status) {
        const projects = searchProjects({ keyword, category, budget, status });
        return res.status(200).json(projects);
      }
      
      // Otherwise, return all projects
      const projects = getProjects();
      return res.status(200).json(projects);
    } catch (error) {
      console.error('Error getting projects:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // POST method to create a new project
  if (req.method === 'POST') {
    try {
      // Only clients can create projects
      if (user.role !== 'client') {
        return res.status(403).json({ error: 'Only clients can create projects' });
      }
      
      const projectData = {
        ...req.body,
        clientId: user.id
      };
      
      // Validate project data
      const { isValid, errors } = validateProject(projectData);
      
      if (!isValid) {
        return res.status(400).json({ errors });
      }
      
      // Create project
      const newProject = createProject(projectData);
      
      return res.status(201).json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
