import fs from 'fs';
import path from 'path';

// Caminhos para os arquivos JSON
const usersPath = path.join(process.cwd(), 'public/data/users.json');
const projectsPath = path.join(process.cwd(), 'public/data/projects.json');
const servicesPath = path.join(process.cwd(), 'public/data/services.json');
const messagesPath = path.join(process.cwd(), 'public/data/messages.json');
const proposalsPath = path.join(process.cwd(), 'public/data/proposals.json');

// Função para ler dados de um arquivo JSON
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return [];
  }
};

// Função para escrever dados em um arquivo JSON
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Erro ao escrever no arquivo ${filePath}:`, error);
    return false;
  }
};

// Funções para usuários
export const getUsers = () => readData(usersPath);

export const getUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === Number(id));
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const getUserByUsername = (username) => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const createUser = (userData) => {
  const users = getUsers();
  const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  
  const newUser = {
    id: newId,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  if (writeData(usersPath, users)) {
    return newUser;
  }
  return null;
};

export const updateUser = (id, userData) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === Number(id));
  
  if (index === -1) return null;
  
  const updatedUser = {
    ...users[index],
    ...userData,
    id: users[index].id // Garantir que o ID não seja alterado
  };
  
  users[index] = updatedUser;
  
  if (writeData(usersPath, users)) {
    return updatedUser;
  }
  return null;
};

// Funções para projetos
export const getProjects = () => readData(projectsPath);

export const getProjectById = (id) => {
  const projects = getProjects();
  return projects.find(project => project.id === Number(id));
};

export const getProjectsByClientId = (clientId) => {
  const projects = getProjects();
  return projects.filter(project => project.clientId === Number(clientId));
};

export const createProject = (projectData) => {
  const projects = getProjects();
  const newId = projects.length > 0 ? Math.max(...projects.map(project => project.id)) + 1 : 1;
  
  const now = new Date().toISOString();
  const newProject = {
    id: newId,
    ...projectData,
    status: projectData.status || 'open',
    createdAt: now,
    updatedAt: now
  };
  
  projects.push(newProject);
  
  if (writeData(projectsPath, projects)) {
    return newProject;
  }
  return null;
};

export const updateProject = (id, projectData) => {
  const projects = getProjects();
  const index = projects.findIndex(project => project.id === Number(id));
  
  if (index === -1) return null;
  
  const updatedProject = {
    ...projects[index],
    ...projectData,
    id: projects[index].id, // Garantir que o ID não seja alterado
    updatedAt: new Date().toISOString()
  };
  
  projects[index] = updatedProject;
  
  if (writeData(projectsPath, projects)) {
    return updatedProject;
  }
  return null;
};

export const deleteProject = (id) => {
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.id !== Number(id));
  
  if (filteredProjects.length === projects.length) {
    return false; // Nenhum projeto foi removido
  }
  
  return writeData(projectsPath, filteredProjects);
};

// Funções para serviços
export const getServices = () => readData(servicesPath);

export const getServiceById = (id) => {
  const services = getServices();
  return services.find(service => service.id === Number(id));
};

export const getServicesByProviderId = (providerId) => {
  const services = getServices();
  return services.filter(service => service.providerId === Number(providerId));
};

export const createService = (serviceData) => {
  const services = getServices();
  const newId = services.length > 0 ? Math.max(...services.map(service => service.id)) + 1 : 1;
  
  const now = new Date().toISOString();
  const newService = {
    id: newId,
    ...serviceData,
    rating: 0,
    reviewCount: 0,
    createdAt: now,
    updatedAt: now
  };
  
  services.push(newService);
  
  if (writeData(servicesPath, services)) {
    return newService;
  }
  return null;
};

export const updateService = (id, serviceData) => {
  const services = getServices();
  const index = services.findIndex(service => service.id === Number(id));
  
  if (index === -1) return null;
  
  const updatedService = {
    ...services[index],
    ...serviceData,
    id: services[index].id, // Garantir que o ID não seja alterado
    updatedAt: new Date().toISOString()
  };
  
  services[index] = updatedService;
  
  if (writeData(servicesPath, services)) {
    return updatedService;
  }
  return null;
};

export const deleteService = (id) => {
  const services = getServices();
  const filteredServices = services.filter(service => service.id !== Number(id));
  
  if (filteredServices.length === services.length) {
    return false; // Nenhum serviço foi removido
  }
  
  return writeData(servicesPath, filteredServices);
};

// Funções para mensagens
export const getMessages = () => readData(messagesPath);

export const getConversationMessages = (conversationId) => {
  const messages = getMessages();
  return messages.filter(message => message.conversationId === conversationId);
};

export const getUserConversations = (userId) => {
  const messages = getMessages();
  const conversationIds = [...new Set(
    messages.filter(
      message => message.senderId === Number(userId) || message.receiverId === Number(userId)
    ).map(message => message.conversationId)
  )];
  
  return conversationIds;
};

export const createMessage = (messageData) => {
  const messages = getMessages();
  const newId = messages.length > 0 ? Math.max(...messages.map(message => message.id)) + 1 : 1;
  
  const newMessage = {
    id: newId,
    ...messageData,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  messages.push(newMessage);
  
  if (writeData(messagesPath, messages)) {
    return newMessage;
  }
  return null;
};

export const markMessagesAsRead = (conversationId, userId) => {
  const messages = getMessages();
  let updated = false;
  
  messages.forEach(message => {
    if (message.conversationId === conversationId && message.senderId !== Number(userId) && !message.read) {
      message.read = true;
      updated = true;
    }
  });
  
  if (updated) {
    return writeData(messagesPath, messages);
  }
  return true;
};

// Funções de busca
export const searchProjects = (query = {}) => {
  let projects = getProjects();
  
  if (query.term) {
    const term = query.term.toLowerCase();
    projects = projects.filter(project => 
      project.title.toLowerCase().includes(term) || 
      project.description.toLowerCase().includes(term)
    );
  }
  
  if (query.category) {
    projects = projects.filter(project => project.category === query.category);
  }
  
  if (query.skills && query.skills.length > 0) {
    projects = projects.filter(project => 
      query.skills.some(skill => project.skills.includes(skill))
    );
  }
  
  if (query.minBudget) {
    projects = projects.filter(project => project.budget >= Number(query.minBudget));
  }
  
  if (query.maxBudget) {
    projects = projects.filter(project => project.budget <= Number(query.maxBudget));
  }
  
  if (query.status) {
    projects = projects.filter(project => project.status === query.status);
  }
  
  return projects;
};

export const searchServices = (query = {}) => {
  let services = getServices();
  
  if (query.term) {
    const term = query.term.toLowerCase();
    services = services.filter(service => 
      service.title.toLowerCase().includes(term) || 
      service.description.toLowerCase().includes(term)
    );
  }
  
  if (query.category) {
    services = services.filter(service => service.category === query.category);
  }
  
  if (query.skills && query.skills.length > 0) {
    services = services.filter(service => 
      query.skills.some(skill => service.skills.includes(skill))
    );
  }
  
  if (query.minPrice) {
    services = services.filter(service => service.price >= Number(query.minPrice));
  }
  
  if (query.maxPrice) {
    services = services.filter(service => service.price <= Number(query.maxPrice));
  }
  
  if (query.minRating) {
    services = services.filter(service => service.rating >= Number(query.minRating));
  }
  
  return services;
};

export const searchProfessionals = (query = {}) => {
  let users = getUsers().filter(user => user.role === 'professional');
  
  if (query.term) {
    const term = query.term.toLowerCase();
    users = users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.bio.toLowerCase().includes(term)
    );
  }
  
  if (query.skills && query.skills.length > 0) {
    users = users.filter(user => 
      user.skills && query.skills.some(skill => user.skills.includes(skill))
    );
  }
  
  return users;
};

// Funções para propostas
export const getProposals = () => {
  // Se o arquivo não existir, cria um vazio
  if (!fs.existsSync(proposalsPath)) {
    writeData(proposalsPath, []);
    return [];
  }
  return readData(proposalsPath);
};

export const getProposalById = (id) => {
  const proposals = getProposals();
  return proposals.find(proposal => proposal.id === Number(id));
};

export const getProposalsByProfessionalId = (professionalId) => {
  const proposals = getProposals();
  return proposals.filter(proposal => proposal.professionalId === Number(professionalId));
};

export const getProposalsByProjectId = (projectId) => {
  const proposals = getProposals();
  return proposals.filter(proposal => proposal.projectId === Number(projectId));
};

export const getProposalsByProjectIds = (projectIds) => {
  const proposals = getProposals();
  return proposals.filter(proposal => projectIds.includes(proposal.projectId));
};

export const getProposalByProjectAndProfessional = (projectId, professionalId) => {
  const proposals = getProposals();
  return proposals.find(proposal => 
    proposal.projectId === Number(projectId) && 
    proposal.professionalId === Number(professionalId)
  );
};

export const createProposal = (proposalData) => {
  const proposals = getProposals();
  const newId = proposals.length > 0 ? Math.max(...proposals.map(proposal => proposal.id)) + 1 : 1;
  
  const newProposal = {
    id: newId,
    ...proposalData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  proposals.push(newProposal);
  
  if (writeData(proposalsPath, proposals)) {
    return newProposal;
  }
  return null;
};

export const updateProposal = (id, proposalData) => {
  const proposals = getProposals();
  const index = proposals.findIndex(proposal => proposal.id === Number(id));
  
  if (index === -1) return null;
  
  const updatedProposal = {
    ...proposals[index],
    ...proposalData,
    id: proposals[index].id, // Garantir que o ID não seja alterado
    updatedAt: new Date().toISOString()
  };
  
  proposals[index] = updatedProposal;
  
  if (writeData(proposalsPath, proposals)) {
    return updatedProposal;
  }
  return null;
};

export const deleteProposal = (id) => {
  const proposals = getProposals();
  const filteredProposals = proposals.filter(proposal => proposal.id !== Number(id));
  
  if (filteredProposals.length === proposals.length) {
    return false; // Nenhuma proposta foi removida
  }
  
  return writeData(proposalsPath, filteredProposals);
};