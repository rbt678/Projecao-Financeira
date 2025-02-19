// components/shared/ErrorMessage.tsx

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="text-red-500 text-center p-4">
      {message}
    </div>
  );
};

export default ErrorMessage;