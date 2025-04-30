import { searchProjects, searchServices, searchProfessionals } from '../../utils/db';

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, ...query } = req.query;
    
    if (!type) {
      return res.status(400).json({ error: 'Search type is required' });
    }
    
    let results = [];
    
    switch (type) {
      case 'projects':
        results = searchProjects(query);
        break;
      case 'services':
        results = searchServices(query);
        break;
      case 'professionals':
        results = searchProfessionals(query);
        break;
      default:
        return res.status(400).json({ error: 'Invalid search type' });
    }
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
