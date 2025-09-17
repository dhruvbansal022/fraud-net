import React, { useRef } from 'react';
import DiroUploadWidget from '@/components/DiroUploadWidget';
import fraudnetLogo from '@/assets/image (1).png';
import { uploadSmartFeedback, submitSmartUpload } from '@/services/diro';
import { env } from '@/config/env';
// import { toast } from '@/components/ui/use-toast';

const Upload = () => {

  const lastDocIdRef = useRef<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const res = await uploadSmartFeedback({ file, buttonId: env.diro.defaultButtonId });
      console.log('rishabh-smartFeedback response:', res);
      lastDocIdRef.current = res.docid || null;
      if (lastDocIdRef.current) {
        console.log('rishabh-smartFeedback docid:', lastDocIdRef.current);
      }
      // toast({
      //   title: 'Document processed',
      //   description: `Type: ${res.document_type || 'Unknown'} • Doc ID: ${res.docid || '—'}`,
      // });
      return res;
    } catch (err: any) {
      console.error(err);
      // toast({
      //   title: 'Upload failed',
      //   description: err?.message || 'Something went wrong',
      //   variant: 'destructive',
      // });
      throw err;
    }
  };

  const handleRetry = () => {
    console.log('User clicked retry');
  };

  const handleSubmit = async () => {
    const docid = lastDocIdRef.current;
    if (!docid) {
      // toast({ title: 'No document to submit', description: 'Please upload a document first', variant: 'destructive' });
      return;
    }
    try {
      const res = await submitSmartUpload(docid);
      console.log('rishabh-smartUpload response:', res);
      if (res && res.error === false) {
        // toast({ title: 'Thank you', description: res.message || 'Document uploaded successfully.' });
        // DiroUploadWidget will show success via onSubmit callback
      } else {
        throw new Error(res?.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error(err);
      // toast({ title: 'Submit failed', description: err?.message || 'Something went wrong', variant: 'destructive' });
      throw err; // let widget handle failure state or keep current state
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-8 lg:pl-16">
        <div className="flex items-center">
          <img src={fraudnetLogo} alt="FraudNet" className="h-[48px] w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-8 lg:pl-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-1 lg:max-w-md">
            <h1 className="text-xl font-bold text-gray-900 mb-6 leading-tight">Document verification for seamless onboarding</h1>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-justify">To ensure a seamless onboarding experience and reduce the risk of discrepancies, FraudNet requires users to verify their documents.</p>
              
              <p className="text-justify">
                FraudNet partners with{' '}
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
            <div className="w-full max-w-md">
              <DiroUploadWidget 
                onFileUpload={handleFileUpload} 
                onRetry={handleRetry} 
                onSubmit={handleSubmit} 
                documentType="document" 
                periodRange="last 3 months" 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;