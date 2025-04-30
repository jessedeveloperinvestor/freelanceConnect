import { getServiceById, updateService, deleteService } from '../../../utils/db';
import { validateService } from '../../../utils/validation';
import { withAuth } from '../../../utils/auth';

async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID do serviço é obrigatório' });
  }
  
  const service = getServiceById(Number(id));
  
  if (!service) {
    return res.status(404).json({ error: 'Serviço não encontrado' });
  }
  
  if (req.method === 'GET') {
    // Qualquer pessoa pode visualizar um serviço
    return res.status(200).json(service);
  }
  
  // Para operações de atualização e exclusão, o usuário deve estar autenticado
  // e ser o provedor do serviço
  if (!req.user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  if (service.providerId !== req.user.id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  if (req.method === 'PUT') {
    const { isValid, errors } = validateService(req.body);
    
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    const updatedService = updateService(Number(id), {
      ...req.body,
      providerId: req.user.id // Garante que o ID do provedor não seja alterado
    });
    
    if (!updatedService) {
      return res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
    
    return res.status(200).json(updatedService);
  }
  
  if (req.method === 'DELETE') {
    const result = deleteService(Number(id));
    
    if (!result) {
      return res.status(500).json({ error: 'Erro ao excluir serviço' });
    }
    
    return res.status(200).json({ message: 'Serviço excluído com sucesso' });
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}

// Removendo o withAuth para permitir acesso público à visualização via GET
export default handler;