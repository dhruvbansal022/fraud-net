import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import DiroUploadWidget from './DiroUploadWidget';
import fraudnetLogo from '../assets/fraudnet-logo-new.png';
const LandingPage = () => {
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };
  const handleRetry = () => {
    console.log('User clicked retry');
  };
  const handleSubmit = () => {
    console.log('Form submitted successfully');
  };
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-8">
        <div className="flex items-center">
          <img src={fraudnetLogo} alt="FraudNet" className="w-[185px] h-[48px]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-1">
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

          {/* Center Section - Widget */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-full max-w-md">
              <DiroUploadWidget onFileUpload={handleFileUpload} onRetry={handleRetry} onSubmit={handleSubmit} documentType="document" periodRange="last 3 months" />
            </div>
          </div>

          {/* Right Section - FAQs */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Frequently asked questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-0">
              <AccordionItem value="item-1" className="border-b border-gray-200 px-0">
                <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-4">
                  What information will be shared?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>Your uploaded document will not be shared with FraudNet. Only the fields requested, such as name, address, account number and IBAN will be shared. All other data will be purged.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-200 px-0">
                <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-4">
                  Can I upload a modified version of my document?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>Verification works best when you provide the original, unaltered document. Your privacy is protected—we only share the requested fields. Any changes or tampering may affect the document's authenticity. Once submitted, verification starts immediately and is usually completed within 24 hours.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-200 px-0">
                <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-4">
                  Why should I trust DIRO?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>DIRO is trusted by F500 and Tier 1 global banks in consumer and enterprise verifications across 195 countries. Its solution is used to verify bank account ownership, and other documents to eliminate fraud, email spoofing, and impersonation issues.</span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>Visit DIRO to learn more about{' '}
                        <a href="https://diro.io/products/bank-account-verification/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:no-underline">
                          bank account verification
                        </a>
                        .
                      </span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-200 px-0">
                <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-4">
                  How DIRO creates a new global standard?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>DIRO's solution eliminates the possibility of document fraud, email spoofing, and impersonation issues.</span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>DIRO's ephemeral architecture of each session does not permit, or make possible, any storage of passwords or other login credentials. This makes the solution particularly applicable to bank account verification and proof of address in consumer and enterprise onboarding to eliminate fraud.</span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>DIRO's verification of bank statements provides verification of selected source data directly from the bank without the possibility of tampering.</span>
                    </li>
                    <li className="flex">
                      <span className="mr-2">•</span>
                      <span>KYC (Know Your Customer) is mostly a manual process with uploads of simple PDFs which is open to tampering, fake, and stolen data. This can lead to fraud and money laundering.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>;
};
export default LandingPage;