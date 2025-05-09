
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  error: Error | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const errorMessage = error instanceof Error 
    ? error.message 
    : "There was an error processing your request. Please try again.";

  // Check if the error contains a specific message about Twitter API
  const isTwitterAPIError = errorMessage.includes("Twitter API") || 
                           errorMessage.includes("Twitter user not found");

  return (
    <div className="bg-sentiment-negative/5 border border-sentiment-negative/20 rounded-xl p-4 mt-4 custom-slide-up">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-sentiment-negative mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-sentiment-negative">Analysis Failed</h3>
          <p className="text-sm text-sentiment-negative/80 mt-1">
            {errorMessage}
          </p>
          <p className="text-xs text-sentiment-negative/70 mt-2">
            Note: This is a demo application. Data shown is simulated since real Twitter API connections are not enabled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
