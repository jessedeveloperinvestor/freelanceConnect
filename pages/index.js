import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca usuário atual
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };
    
    fetchUserData();
  }, []);

  // Busca projetos e serviços recentes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar projetos recentes
        const projectsRes = await fetch('/api/projects?status=open&limit=3');
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setRecentProjects(projectsData);
        }
        
        // Buscar serviços recentes
        const servicesRes = await fetch('/api/services?limit=3');
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setRecentServices(servicesData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados recentes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Categorias de habilidades
  const skillCategories = [
    { name: 'Desenvolvimento', skills: ['React', 'Node.js', 'Python', 'PHP', 'WordPress'] },
    { name: 'Design', skills: ['Photoshop', 'Illustrator', 'UX/UI Design', 'Figma'] },
    { name: 'Marketing', skills: ['SEO', 'Marketing de Conteúdo', 'Redes Sociais', 'PPC'] },
    { name: 'Redação', skills: ['Artigos', 'Copywriting', 'Tradução', 'Revisão'] }
  ];

  return (
    <div>
      {/* Banner Hero */}
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        margin: '-2rem -1rem 2rem -1rem',
        padding: '3rem 1rem',
        borderRadius: '0 0 0.5rem 0.5rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: '#1e40af'
          }}>
            Rede Freelancer
          </h1>
          
          <p style={{ 
            fontSize: '1.5rem', 
            marginBottom: '2rem',
            maxWidth: '800px',
            color: '#334155'
          }}>
            Conectamos profissionais talentosos com clientes que precisam de seus serviços.
            Encontre o projeto perfeito ou ofereça suas habilidades hoje mesmo.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {!user ? (
              <>
                <Link href="/auth" style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.375rem',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}>
                  Entrar / Cadastrar
                </Link>
                
                <Link href="/search" style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #3b82f6',
                  color: '#3b82f6',
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}>
                  Procurar Projetos
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.375rem',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}>
                  Meu Dashboard
                </Link>
                
                {user.role === 'client' ? (
                  <Link href="/projects/new" style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #3b82f6',
                    color: '#3b82f6',
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}>
                    Publicar Projeto
                  </Link>
                ) : (
                  <Link href="/services/new" style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #3b82f6',
                    color: '#3b82f6',
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}>
                    Oferecer Serviço
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Como a Rede Freelancer Funciona
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>1</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Crie uma Conta
            </h3>
            <p style={{ color: '#4b5563' }}>
              Cadastre-se gratuitamente como cliente ou profissional para começar a usar a plataforma.
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>2</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {user?.role === 'client' ? 'Publique Projetos' : 'Encontre Projetos'}
            </h3>
            <p style={{ color: '#4b5563' }}>
              {user?.role === 'client' 
                ? 'Crie projetos detalhados descrevendo suas necessidades e orçamento desejado.'
                : 'Navegue por projetos publicados e envie propostas para aqueles que combinam com suas habilidades.'}
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>3</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Pagamento Seguro
            </h3>
            <p style={{ color: '#4b5563' }}>
              Utilize nosso sistema de pagamento seguro com processamento via Stripe e transferência para o profissional.
            </p>
          </div>
        </div>
      </div>

      {/* Projetos Recentes */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
            Projetos Recentes
          </h2>
          
          <Link href="/search" style={{
            fontSize: '0.875rem',
            color: '#3b82f6',
            textDecoration: 'none'
          }}>
            Ver todos os projetos →
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
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : recentProjects.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {recentProjects.map(project => (
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
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    marginRight: '0.5rem'
                  }}>
                    {project.category}
                  </span>
                </div>
                
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem' 
                }}>
                  {project.title}
                </h3>
                
                <p style={{ marginBottom: '1rem', color: '#4b5563', height: '3rem', overflow: 'hidden' }}>
                  {project.description.length > 100 
                    ? `${project.description.substring(0, 100)}...` 
                    : project.description}
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
                    <span style={{ fontWeight: 'bold' }}>Orçamento:</span>{' '}
                    <span style={{ color: '#047857' }}>R$ {project.budget.toFixed(2)}</span>
                  </div>
                  
                  <Link 
                    href={`/project/${project.id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: '2rem',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Não há projetos disponíveis no momento.
          </div>
        )}
      </div>

      {/* Categorias de Habilidades */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>
          Explore por Habilidades
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {skillCategories.map(category => (
            <div 
              key={category.name}
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
                marginBottom: '1rem' 
              }}>
                {category.name}
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {category.skills.map(skill => (
                  <Link 
                    key={skill} 
                    href={`/search?skill=${encodeURIComponent(skill)}`}
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      textDecoration: 'none'
                    }}
                  >
                    {skill}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
