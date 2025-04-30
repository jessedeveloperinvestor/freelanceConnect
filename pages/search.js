import { useState } from 'react';
import Link from 'next/link';

export default function Search() {
  const [searchType, setSearchType] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Projetos de exemplo
  const exampleProjects = [
    {
      id: 1,
      title: 'Desenvolvimento de site de e-commerce',
      description: 'Preciso de um desenvolvedor para criar uma loja online completa com carrinho de compras e pagamento.',
      budget: 3000,
      category: 'Desenvolvimento Web'
    },
    {
      id: 2,
      title: 'Design de logotipo para empresa',
      description: 'Busco designer para criar um logotipo profissional para minha nova empresa de tecnologia.',
      budget: 500,
      category: 'Design Gráfico'
    }
  ];
  
  // Serviços de exemplo
  const exampleServices = [
    {
      id: 1,
      title: 'Desenvolvimento de aplicativo React Native',
      description: 'Desenvolvo aplicativos móveis de alta qualidade com React Native para iOS e Android.',
      price: 2500,
      category: 'Desenvolvimento Mobile'
    },
    {
      id: 2,
      title: 'Edição e produção de vídeos',
      description: 'Ofereço serviços profissionais de edição de vídeo para marketing e redes sociais.',
      price: 350,
      category: 'Produção de Vídeo'
    }
  ];
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Encontre {searchType === 'projects' ? 'Projetos' : 'Serviços'}
      </h1>
      
      {/* Barra de pesquisa */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setSearchType('projects')}
            style={{
              padding: '0.5rem 1rem',
              background: searchType === 'projects' ? '#3b82f6' : '#e5e7eb',
              color: searchType === 'projects' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Projetos
          </button>
          <button 
            onClick={() => setSearchType('services')}
            style={{
              padding: '0.5rem 1rem',
              background: searchType === 'services' ? '#3b82f6' : '#e5e7eb',
              color: searchType === 'services' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Serviços
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder={`Pesquisar ${searchType === 'projects' ? 'projetos' : 'serviços'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
          />
          <button
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
            Buscar
          </button>
        </div>
      </div>
      
      {/* Resultados da Pesquisa */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {searchType === 'projects' ? 'Projetos Disponíveis' : 'Serviços Oferecidos'}
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          {searchType === 'projects' ? (
            exampleProjects.map(project => (
              <div 
                key={project.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {project.title}
                </h3>
                <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                  {project.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#047857' }}>
                    R$ {project.budget}
                  </span>
                  <span style={{ 
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    {project.category}
                  </span>
                </div>
              </div>
            ))
          ) : (
            exampleServices.map(service => (
              <div 
                key={service.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                  {service.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#047857' }}>
                    A partir de R$ {service.price}
                  </span>
                  <span style={{ 
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    {service.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}