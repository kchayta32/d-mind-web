import React from 'react';

const RagComparison: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/rag-web/index.html"
        title="LLM Performance Comparison and RAG Analytics Dashboard"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
};

export default RagComparison;
