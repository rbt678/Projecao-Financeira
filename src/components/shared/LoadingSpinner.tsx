// components/shared/LoadingSpinner.tsx
// Componente simples para exibir um spinner de carregamento

const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  };
  
  export default LoadingSpinner;