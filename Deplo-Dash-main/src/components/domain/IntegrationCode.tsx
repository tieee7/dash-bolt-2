import React from 'react';
import { Code2, Copy, Check } from 'lucide-react';

interface IntegrationCodeProps {
  integrationCode: string;
  copied: boolean;
  handleCopyCode: () => Promise<void>;
}

export default function IntegrationCode({
  integrationCode,
  copied,
  handleCopyCode
}: IntegrationCodeProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Integration Code</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Test Page: <a href="/test-site.html" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">Open</a></span>
          <Code2 className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm relative">
        <pre className="overflow-x-auto">{integrationCode}</pre>
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
      <p className="mt-4 text-sm text-gray-600">
        Add this code snippet to your website's HTML just before the closing &lt;/body&gt; tag
      </p>
    </div>
  );
}