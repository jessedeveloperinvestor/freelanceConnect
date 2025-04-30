import { getServices, createService } from '../../../utils/db';
import { validateService } from '../../../utils/validation';
import { withAuth } from '../../../utils/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    // Qualquer pessoa pode visualizar serviços, não precisa de autenticação
    const services = getServices();
    return res.status(200).json(services);
  } 
  
  if (req.method === 'POST') {
    // Apenas usuários autenticados podem criar serviços
    if (!req.user) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { isValid, errors } = validateService(req.body);
    
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    const serviceData = {
      ...req.body,
      providerId: req.user.id
    };
    
    const newService = createService(serviceData);
    
    if (!newService) {
      return res.status(500).json({ error: 'Erro ao criar serviço' });
    }
    
    return res.status(201).json(newService);
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}

// Removendo o withAuth para permitir acesso público à listagem de serviços via GET
export default handler;