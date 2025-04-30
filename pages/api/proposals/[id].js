import { getUserFromRequest } from '../../../utils/auth';
import * as db from '../../../utils/db';

async function handler(req, res) {
  // Verifica se o usuário está autenticado
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const { id } = req.query;
  
  // Verificar se a proposta existe
  const proposal = await db.getProposalById(id);
  if (!proposal) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  
  // Verificar se o usuário tem permissão para acessar esta proposta
  const project = await db.getProjectById(proposal.projectId);
  const isOwner = project && project.clientId === user.id;
  const isProfessional = proposal.professionalId === user.id;
  const isAdmin = user.role === 'admin';
  
  if (!isOwner && !isProfessional && !isAdmin) {
    return res.status(403).json({ error: 'Acesso negado a esta proposta' });
  }

  // GET - Buscar detalhes da proposta
  if (req.method === 'GET') {
    try {
      // Adicionar detalhes do projeto e do profissional
      const professional = await db.getUserById(proposal.professionalId);
      
      const result = {
        ...proposal,
        project,
        professional: {
          id: professional.id,
          name: professional.name,
          email: professional.email,
          profilePicture: professional.profilePicture
        }
      };
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao buscar detalhes da proposta:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar detalhes da proposta' });
    }
  }
  
  // PUT - Atualizar proposta (apenas cliente pode aceitar/rejeitar)
  if (req.method === 'PUT') {
    try {
      // Apenas o cliente dono do projeto pode atualizar o status da proposta
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Apenas o cliente dono do projeto pode atualizar uma proposta' });
      }
      
      const { status } = req.body;
      
      if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido. Use "accepted" ou "rejected"' });
      }
      
      // Se a proposta for aceita, atualizar o status do projeto
      if (status === 'accepted') {
        // Atualizar o projeto para "in_progress" e associar ao profissional
        await db.updateProject(project.id, {
          status: 'in_progress',
          professionalId: proposal.professionalId,
          updatedAt: new Date()
        });
        
        // Rejeitar todas as outras propostas para este projeto
        const otherProposals = await db.getProposalsByProjectId(project.id);
        for (const otherProposal of otherProposals) {
          if (otherProposal.id !== proposal.id) {
            await db.updateProposal(otherProposal.id, {
              status: 'rejected',
              updatedAt: new Date()
            });
          }
        }
      }
      
      // Atualizar a proposta
      const updatedProposal = await db.updateProposal(id, {
        status,
        updatedAt: new Date()
      });
      
      return res.status(200).json(updatedProposal);
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      return res.status(500).json({ error: 'Erro interno ao atualizar proposta' });
    }
  }
  
  // DELETE - Excluir proposta (apenas o profissional que a criou pode excluir, se ainda estiver pendente)
  if (req.method === 'DELETE') {
    try {
      // Apenas o profissional que criou a proposta pode excluí-la
      if (!isProfessional && !isAdmin) {
        return res.status(403).json({ error: 'Apenas o profissional que criou a proposta pode excluí-la' });
      }
      
      // Verificar se a proposta ainda está pendente
      if (proposal.status !== 'pending') {
        return res.status(400).json({ error: 'Apenas propostas pendentes podem ser excluídas' });
      }
      
      await db.deleteProposal(id);
      
      return res.status(200).json({ message: 'Proposta excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      return res.status(500).json({ error: 'Erro interno ao excluir proposta' });
    }
  }
  
  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}

export default handler;