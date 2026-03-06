import { Button } from '@/components/ui/button';
import { Download, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ResumePreview({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "my_resume.md";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  if (!content) return null;

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 border border-gray-100 overflow-y-auto max-h-[800px] prose prose-sm md:prose-base dark:prose-invert">
        {/* Simulating markdown rendering for standard layout. Next step we could add a markdown parser. */}
        <pre className="whitespace-pre-wrap font-sans text-gray-800">{content}</pre>
      </div>
      
      <div className="flex gap-4 mt-6">
        <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2">
          {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Text'}
        </Button>
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download .md
        </Button>
      </div>
    </div>
  );
}
