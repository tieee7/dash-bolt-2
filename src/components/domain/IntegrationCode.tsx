import React from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import { useDomain } from '../../context/DomainContext';

interface IntegrationCodeProps {
  integrationCode: string;
  copied: boolean;
  handleCopyCode: () => void;
}

export default function IntegrationCode({
  integrationCode,
  copied,
  handleCopyCode
}: IntegrationCodeProps) {
  const { currentDomain } = useDomain();
  
  // Generate the actual integration code that users will add to their website
  const embedCode = `<!-- Chatbot Integration -->
<script 
  src="http://localhost:5173/chatbot/${currentDomain?.id}/loader.js"
  data-chatbot-id="${currentDomain?.id}"
  data-env="development"
  async
></script>`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Integration Code</h3>
        <Code2 className="h-5 w-5 text-gray-500" />
      </div>
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm relative">
        <pre className="overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
        <button
          onClick={handleCopyCode}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Code
            </>
          )}
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          Add this code snippet to your website's HTML just before the closing &lt;/body&gt; tag
        </p>
        <p className="text-sm text-gray-600">
          The chatbot will automatically appear in the bottom-right corner of your website
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Development Mode:</strong> This integration code is configured for local development. 
            For production, the URL will be automatically updated to your production domain.
          </p>
        </div>
      </div>
    </div>
  );
}