import { getUserFromRequest } from '../../../utils/auth';
import * as db from '../../../utils/db';

async function handler(req, res) {
  // Verifica se o usuário está autenticado
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // GET - Buscar propostas 
  if (req.method === 'GET') {
    try {
      let proposals = [];
      
      // Filtrar por profissional
      if (req.query.professionalId) {
        proposals = await db.getProposalsByProfessionalId(req.query.professionalId);
      } 
      // Filtrar por projeto
      else if (req.query.projectId) {
        // Verificar se o usuário é dono do projeto ou o profissional que enviou a proposta
        const project = await db.getProjectById(req.query.projectId);
        if (project && (project.clientId === user.id || user.role === 'professional')) {
          proposals = await db.getProposalsByProjectId(req.query.projectId);
        } else {
          return res.status(403).json({ error: 'Acesso negado a estas propostas' });
        }
      } 
      // Se não tiver filtro e for admin, retorna todas
      else if (user.role === 'admin') {
        proposals = await db.getProposals();
      } 
      // Para clientes, retorna propostas de seus projetos
      else if (user.role === 'client') {
        const userProjects = await db.getProjectsByClientId(user.id);
        const projectIds = userProjects.map(p => p.id);
        proposals = await db.getProposalsByProjectIds(projectIds);
      } 
      // Para profissionais, retorna suas próprias propostas
      else if (user.role === 'professional') {
        proposals = await db.getProposalsByProfessionalId(user.id);
      }
      
      return res.status(200).json(proposals);
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar propostas' });
    }
  }
  
  // POST - Criar nova proposta
  if (req.method === 'POST') {
    try {
      // Apenas profissionais podem criar propostas
      if (user.role !== 'professional') {
        return res.status(403).json({ error: 'Apenas profissionais podem enviar propostas' });
      }
      
      const { projectId, price, deliveryTime, message } = req.body;
      
      if (!projectId || !price || !deliveryTime || !message) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
      
      // Verificar se o projeto existe e está aberto
      const project = await db.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }
      
      if (project.status !== 'open') {
        return res.status(400).json({ error: 'O projeto não está mais aberto para propostas' });
      }
      
      // Verifica se o profissional já enviou uma proposta para este projeto
      const existingProposal = await db.getProposalByProjectAndProfessional(projectId, user.id);
      if (existingProposal) {
        return res.status(400).json({ error: 'Você já enviou uma proposta para este projeto' });
      }
      
      // Criar a proposta
      const newProposal = {
        projectId,
        professionalId: user.id,
        price: parseFloat(price),
        deliveryTime: new Date(deliveryTime),
        message,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const createdProposal = await db.createProposal(newProposal);
      
      return res.status(201).json(createdProposal);
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      return res.status(500).json({ error: 'Erro interno ao criar proposta' });
    }
  }
  
  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}

export default handler;