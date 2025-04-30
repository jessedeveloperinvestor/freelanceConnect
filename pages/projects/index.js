import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Projects() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    minBudget: '',
    maxBudget: '',
    searchTerm: ''
  });
  
  // Estados de propostas
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalData, setProposalData] = useState({
    projectId: null,
    price: '',
    deliveryTime: '',
    message: ''
  });
  
  // Verifica se o usuário está autenticado e é profissional
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          if (userData && userData.role === 'professional') {
            setUser(userData);
          } else {
            // Redirecionar se não for profissional
            router.push('/auth');
          }
        } else {
          // Redirecionar se não estiver autenticado
          router.push('/auth');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setError('Erro ao verificar suas credenciais. Por favor, faça login novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Carrega projetos quando o usuário estiver autenticado
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, filters]);
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Construir query string com os filtros
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minBudget) queryParams.append('minBudget', filters.minBudget);
      if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget);
      if (filters.searchTerm) queryParams.append('term', filters.searchTerm);
      
      // Apenas projetos abertos
      queryParams.append('status', 'open');
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetch(`/api/projects${query}`);
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        throw new Error('Falha ao buscar projetos');
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      setError('Não foi possível carregar os projetos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      category: '',
      minBudget: '',
      maxBudget: '',
      searchTerm: ''
    });
  };
  
  const openProposalModal = (projectId) => {
    setProposalData({
      projectId,
      price: '',
      deliveryTime: '',
      message: ''
    });
    
    // Aqui você abriria um modal, mas para simplificar, redirecionamos para uma página
    router.push(`/proposals/new?projectId=${projectId}`);
  };
  
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
  
  // Categorias para filtros
  const categories = [
    'Todas Categorias',
    'Desenvolvimento Web',
    'Design Gráfico',
    'Marketing Digital',
    'Tradução',
    'Redação',
    'Desenvolvimento Mobile',
    'Edição de Vídeo',
    'Suporte Técnico',
    'Outros'
  ];
  
  return (
    <div>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem' 
      }}>
        Projetos Abertos
      </h1>
      
      <p style={{ marginBottom: '2rem', color: '#4b5563' }}>
        Encontre projetos que correspondam às suas habilidades e envie propostas
      </p>
      
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
      
      {/* Filtros */}
      <div style={{ 
        padding: '1.5rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}>
          Filtrar Projetos
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ minWidth: '200px', flex: 1 }}>
            <label 
              htmlFor="searchTerm" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Buscar
            </label>
            <input
              id="searchTerm"
              name="searchTerm"
              type="text"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
              placeholder="Palavras-chave"
            />
          </div>
          
          <div style={{ minWidth: '200px', flex: 1 }}>
            <label 
              htmlFor="category" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category === 'Todas Categorias' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ minWidth: '150px', flex: 1 }}>
            <label 
              htmlFor="minBudget" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Orçamento Mínimo
            </label>
            <input
              id="minBudget"
              name="minBudget"
              type="number"
              min="0"
              value={filters.minBudget}
              onChange={handleFilterChange}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
              placeholder="R$ Min"
            />
          </div>
          
          <div style={{ minWidth: '150px', flex: 1 }}>
            <label 
              htmlFor="maxBudget" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Orçamento Máximo
            </label>
            <input
              id="maxBudget"
              name="maxBudget"
              type="number"
              min="0"
              value={filters.maxBudget}
              onChange={handleFilterChange}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
              placeholder="R$ Max"
            />
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={resetFilters}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              marginRight: '0.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Limpar
          </button>
          <button
            onClick={fetchProjects}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Filtrar
          </button>
        </div>
      </div>
      
      {/* Lista de projetos */}
      <div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    marginRight: '0.5rem'
                  }}>
                    {project.category}
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
                
                <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
                  {project.description.length > 150 
                    ? `${project.description.substring(0, 150)}...` 
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
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold' }}>Orçamento:</span>{' '}
                      <span style={{ color: '#047857' }}>R$ {project.budget.toFixed(2)}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>Prazo:</span>{' '}
                      <span>{new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => openProposalModal(project.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Enviar Proposta
                    </button>
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
              Não foram encontrados projetos que correspondam aos critérios de busca.
            </p>
            <button
              onClick={resetFilters}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}