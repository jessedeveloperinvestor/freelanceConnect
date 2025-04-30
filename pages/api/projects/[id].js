import { withAuth } from '../../../utils/auth';
import { getProjectById, updateProject, deleteProject } from '../../../utils/db';
import { validateProject } from '../../../utils/validation';
import { getUserFromRequest } from '../../../utils/auth';

async function handler(req, res) {
  const user = getUserFromRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Get project ID from URL
  const { id } = req.query;
  
  // Get the project
  const project = getProjectById(id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // GET method to retrieve a specific project
  if (req.method === 'GET') {
    return res.status(200).json(project);
  }
  
  // Check if the user is the project owner
  if (project.clientId !== user.id) {
    return res.status(403).json({ error: 'You do not have permission to modify this project' });
  }
  
  // PUT method to update a project
  if (req.method === 'PUT') {
    try {
      const projectData = req.body;
      
      // Validate project data
      const { isValid, errors } = validateProject(projectData);
      
      if (!isValid) {
        return res.status(400).json({ errors });
      }
      
      // Update project
      const updatedProject = updateProject(id, projectData);
      
      if (!updatedProject) {
        return res.status(500).json({ error: 'Failed to update project' });
      }
      
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // DELETE method to delete a project
  if (req.method === 'DELETE') {
    try {
      const success = deleteProject(id);
      
      if (!success) {
        return res.status(500).json({ error: 'Failed to delete project' });
      }
      
      return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
