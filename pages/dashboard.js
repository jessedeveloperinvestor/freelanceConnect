import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dados do dashboard
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [proposals, setProposals] = useState([]);
  
  // Busca dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Não está autenticado, redirecionar para login
          router.push('/auth');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setError('Erro ao carregar os dados do usuário. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  // Carrega dados específicos baseados no tipo de usuário
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        if (user.role === 'client') {
          // Buscar projetos do cliente
          const projectsRes = await fetch('/api/projects?clientId=' + user.id);
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            setProjects(projectsData);
          }
        } else if (user.role === 'professional') {
          // Buscar serviços do profissional
          const servicesRes = await fetch('/api/services?providerId=' + user.id);
          if (servicesRes.ok) {
            const servicesData = await servicesRes.json();
            setServices(servicesData);
          }
          
          // Buscar propostas enviadas
          const proposalsRes = await fetch('/api/proposals?professionalId=' + user.id);
          if (proposalsRes.ok) {
            const proposalsData = await proposalsRes.json();
            setProposals(proposalsData);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar seus dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  if (loading && !user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ 
          border: '4px solid #f3f4f6', 
          borderTopColor: '#3b82f6', 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          margin: '0 auto',
          animation: 'spin 1s linear infinite' 
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  // Se não tiver usuário autenticado
  if (!user) {
    return null; // Component vai ser redirecionado para auth pelo useEffect
  }
  
  return (
    <div>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem' 
      }}>
        Dashboard
      </h1>
      
      {error && (
        <div style={{ 
          padding: '0.75rem',
          marginBottom: '1.5rem',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '0.375rem'
        }}>
          {error}
        </div>
      )}
      
      {/* Perfil do usuário */}
      <div style={{ 
        padding: '1.5rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}>
              Olá, {user.name}
            </h2>
            <p style={{ color: '#4b5563' }}>
              {user.role === 'client' 
                ? 'Bem-vindo ao seu painel de cliente'
                : 'Bem-vindo ao seu painel de profissional'}
            </p>
          </div>
          
          <Link href="/profile" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            textDecoration: 'none'
          }}>
            Editar Perfil
          </Link>
        </div>
      </div>
      
      {/* Conteúdo específico baseado no tipo de usuário */}
      {user.role === 'client' ? (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold' 
            }}>
              Meus Projetos
            </h2>
            
            <Link href="/projects/new" style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Criar Novo Projeto
            </Link>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                border: '4px solid #f3f4f6', 
                borderTopColor: '#3b82f6', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                margin: '0 auto',
                animation: 'spin 1s linear infinite' 
              }} />
            </div>
          ) : projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map(project => (
                <div 
                  key={project.id}
                  style={{ 
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ 
                      display: 'inline-block',
                      backgroundColor: project.status === 'open' ? '#e0f2fe' : '#f0fdf4',
                      color: project.status === 'open' ? '#0369a1' : '#166534',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      marginRight: '0.5rem'
                    }}>
                      {project.status === 'open' ? 'Aberto' : 'Em Andamento'}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Publicado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem' 
                  }}>
                    {project.title}
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '1rem',
                    marginTop: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>Orçamento:</span>{' '}
                      <span style={{ color: '#047857' }}>R$ {project.budget.toFixed(2)}</span>
                    </div>
                    
                    <div>
                      <Link 
                        href={`/project/${project.id}`}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontWeight: 'bold'
                        }}
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Você ainda não possui projetos.
              </p>
              <Link 
                href="/projects/new"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Criar Meu Primeiro Projeto
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Dashboard do Profissional */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold' 
            }}>
              Meus Serviços
            </h2>
            
            <Link href="/services/new" style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Criar Novo Serviço
            </Link>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                border: '4px solid #f3f4f6', 
                borderTopColor: '#3b82f6', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                margin: '0 auto',
                animation: 'spin 1s linear infinite' 
              }} />
            </div>
          ) : services.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {services.map(service => (
                <div 
                  key={service.id}
                  style={{ 
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem' 
                  }}>
                    {service.title}
                  </h3>
                  
                  <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
                    {service.description.length > 150 
                      ? `${service.description.substring(0, 150)}...` 
                      : service.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '1rem',
                    marginTop: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>Preço:</span>{' '}
                      <span style={{ color: '#047857' }}>R$ {service.price.toFixed(2)}</span>
                    </div>
                    
                    <div>
                      <Link 
                        href={`/service/${service.id}`}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontWeight: 'bold'
                        }}
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Você ainda não possui serviços cadastrados.
              </p>
              <Link 
                href="/services/new"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Cadastrar Meu Primeiro Serviço
              </Link>
            </div>
          )}
          
          {/* Propostas Enviadas */}
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Minhas Propostas
            </h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ 
                  border: '4px solid #f3f4f6', 
                  borderTopColor: '#3b82f6', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  margin: '0 auto',
                  animation: 'spin 1s linear infinite' 
                }} />
              </div>
            ) : proposals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {proposals.map(proposal => (
                  <div 
                    key={proposal.id}
                    style={{ 
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ 
                        display: 'inline-block',
                        backgroundColor: proposal.status === 'pending' ? '#fef3c7' : '#f0fdf4',
                        color: proposal.status === 'pending' ? '#92400e' : '#166534',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        marginRight: '0.5rem'
                      }}>
                        {proposal.status === 'pending' ? 'Pendente' : 'Aceita'}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Enviada em {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem' 
                    }}>
                      {proposal.project?.title || 'Projeto'}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '1rem',
                      marginTop: '0.5rem'
                    }}>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>Valor Proposto:</span>{' '}
                        <span style={{ color: '#047857' }}>R$ {proposal.price.toFixed(2)}</span>
                      </div>
                      
                      <div>
                        <Link 
                          href={`/project/${proposal.projectId}`}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '0.375rem',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                          }}
                        >
                          Ver Projeto
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Você ainda não enviou propostas para projetos.
                </p>
                <Link 
                  href="/projects"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Explorar Projetos
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}