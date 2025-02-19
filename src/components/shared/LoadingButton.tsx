// components/shared/LoadingButton.tsx
// Botão com estado de carregamento

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    children: React.ReactNode;
  }
  
  const LoadingButton: React.FC<LoadingButtonProps> = ({ isLoading, children, ...props }) => {
    return (
      <button {...props} disabled={isLoading || props.disabled}>
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">
              {/* Ícone de carregamento (pode ser um SVG) */}
              ⚙️
            </span>
            Carregando...
          </>
        ) : (
          children
        )}
      </button>
    );
  };
  
  export default LoadingButton;