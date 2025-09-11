import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DiroUploadWidget from '@/components/DiroUploadWidget';
import vfsLogo from '@/assets/vfs-logo.png';

const Upload = () => {
  const [showUploadWidget, setShowUploadWidget] = useState(false);
  const [urn, setUrn] = useState('');

  const handleVerifyNow = () => {
    if (urn.trim()) {
      setShowUploadWidget(true);
    }
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  const handleRetry = () => {
    console.log('User clicked retry');
  };

  const handleSubmit = () => {
    console.log('Form submitted successfully');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-8">
        <div className="flex items-center">
          <img src={vfsLogo} alt="VFS Global" className="w-[148.77px] h-[48px]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-1 lg:max-w-lg">
            <h1 className="text-xl font-bold text-gray-900 mb-6 leading-tight">Document verification for seamless Visa processing in Malta</h1>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-justify">To ensure a seamless Visa processing experience and reduce the risk of discrepancies, VFS Global requires applicants to verify their documents.</p>
              
              <p className="text-justify">
                VFS Global partners with{' '}
                <a href="https://diro.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium underline hover:no-underline">DIRO</a>{' '}
                for this process, the leading provider of bank verification solutions trusted by F500 and Tier 1 global banks. Visit DIRO{' '}
                <a href="https://trust.diro.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:no-underline">
                  Trust Center
                </a>
                .
              </p>
              
              <p>
                Learn more about DIRO's{' '}
                <a href="https://diro.io/products/bank-account-verification/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:no-underline">document</a>{' '}
                verification solutions.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <a href="https://diro.io/term-condition/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:no-underline text-sm">
                Terms of Use
              </a>
              <a href="https://diro.io/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:no-underline text-sm">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Right Section - Widget (positioned center-right) */}
          <div className="lg:col-span-1 flex justify-center lg:justify-center lg:pl-8">
            {!showUploadWidget ? (
              <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Enter your URN
                  </h2>
                  <p className="text-gray-600 text-sm mb-6 text-justify">
                    Please enter your Unique Reference Number (URN) to proceed with the verification process.
                  </p>
                  
                  <div className="space-y-4">
                    <Input 
                      type="text" 
                      placeholder="Enter your URN" 
                      value={urn} 
                      onChange={(e) => setUrn(e.target.value)} 
                      className="w-full" 
                    />
                    <Button 
                      onClick={handleVerifyNow} 
                      className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg font-medium" 
                      style={{ backgroundColor: '#1A407A' }}
                    >
                      Proceed
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <DiroUploadWidget 
                  onFileUpload={handleFileUpload} 
                  onRetry={handleRetry} 
                  onSubmit={handleSubmit} 
                  documentType="bank statement" 
                  periodRange="last 3 months" 
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;