import React, { useState, useRef, useEffect } from 'react';
import { CloudUpload, FileText, CheckCircle, XCircle, RefreshCw, AlertCircle, TriangleAlert, Calendar, User, MapPin, CreditCard, Loader2, AlertOctagon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export type WidgetState = 
  | 'upload' 
  | 'uploading' 
  | 'processing' 
  | 'validating' 
  | 'live-feedback'
  | 'verified' 
  | 'document-verified'
  | 'error' 
  | 'unprocessable'
  | 'success';

export interface ValidationField {
  name: string;
  icon: React.ReactNode;
  validated: boolean;
  required: boolean;
}

export interface DiroUploadWidgetProps {
  onFileUpload?: (file: File) => void;
  onRetry?: () => void;
  onSubmit?: () => void;
  className?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  periodRange?: string;
  documentType?: string;
}

const DiroUploadWidget: React.FC<DiroUploadWidgetProps> = ({
  onFileUpload,
  onRetry,
  onSubmit,
  className,
  acceptedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxFileSize = 10,
  periodRange = "last 3 months",
  documentType = "bank statement"
}) => {
  const [state, setState] = useState<WidgetState>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [validationFields, setValidationFields] = useState<ValidationField[]>([
    { name: 'Name', icon: null, validated: false, required: true },
    { name: 'Address', icon: null, validated: false, required: true },
    { name: 'Account number', icon: null, validated: false, required: true },
    { name: 'Period', icon: null, validated: false, required: true },
  ]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [verificationDetails, setVerificationDetails] = useState({
    documentId: 'DOC-2024-001234',
    fingerprint: 'SHA256:a1b2c3d4e5f6...',
    source: 'Chase Bank Portal'
  });
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const validationMessages = [
    "Extracting data…", 
    "Validating fields…",
    "Finalizing verification…"
  ];

  // Dynamic loader messages based on current state
  const getDynamicLoaderMessage = () => {
    if (state === 'uploading') {
      const messages = ["Uploading document…", "Validating data…"];
      return messages[currentMessageIndex % messages.length];
    } else if (state === 'processing') {
      const messages = ["Extracting fields…", "Processing document…"];
      return messages[currentMessageIndex % messages.length];
    } else if (state === 'validating') {
      const messages = ["Analyzing content…", "Finalizing validation…"];
      return messages[currentMessageIndex % messages.length];
    }
    return "Processing…";
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cycle through validation messages
  useEffect(() => {
    if (state === 'uploading' || state === 'processing' || state === 'validating') {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % 2); // Only 2 messages per state
      }, 1200); // Faster cycling
      
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    onFileUpload?.(file);
    setState('uploading');
    
    // Reset message index to start fresh for each upload
    setCurrentMessageIndex(0);
    
    // Simulate upload and processing flow with message resets
    setTimeout(() => {
      setState('processing');
      setCurrentMessageIndex(0); // Reset for processing state
    }, 1000);
    setTimeout(() => {
      setState('validating');
      setCurrentMessageIndex(0); // Reset for validating state
    }, 2500);
    setTimeout(() => {
      // 6 scenarios as requested - corrected order
      const scenarios = [
        // Scenario 1: Positive flow - show please review screen with all fields green
        { type: 'validation', name: true, address: true, account: true, period: true },
        // Scenario 2: Missing fields - one or two fields missing
        { type: 'validation', name: false, address: false, account: true, period: true },
        // Scenario 3: Missing period with error message
        { type: 'validation', name: true, address: true, account: true, period: false },
        // Scenario 4: Original document verified successfully screen
        { type: 'document-verified', name: true, address: true, account: true, period: true },
        // Scenario 5: Unprocessable image
        { type: 'unprocessable' },
        // Scenario 6: Something went wrong
        { type: 'error' },
      ];
      
      // Get current scenario using the current index (before incrementing)
      const currentIndex = scenarioIndex % scenarios.length;
      const currentScenario = scenarios[currentIndex];
      console.log('Executing Scenario', currentIndex + 1, ':', currentScenario);
      
      // Handle different scenario types
      if (currentScenario.type === 'error') {
        setState('error');
      } else if (currentScenario.type === 'unprocessable') {
        setState('unprocessable');
      } else if (currentScenario.type === 'document-verified') {
        // Set all fields as validated for document verified state
        setValidationFields(fields => 
          fields.map(field => ({ ...field, validated: true }))
        );
        setState('document-verified');
      } else if (currentScenario.type === 'validation') {
        // Handle validation scenarios (including positive flow)
        setValidationFields(fields => 
          fields.map(field => ({
            ...field,
            validated: field.name === 'Name' ? currentScenario.name :
                      field.name === 'Address' ? currentScenario.address :
                      field.name === 'Account number' ? currentScenario.account :
                      field.name === 'Period' ? currentScenario.period :
                      true
          }))
        );
        setState('verified');
      }
      
      // Increment scenario index AFTER processing the scenario
      setScenarioIndex(prev => prev + 1);
    }, 4000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRetry = () => {
    setState('upload');
    setUploadedFile(null);
    setValidationFields(fields => 
      fields.map(field => ({ ...field, validated: false }))
    );
    // Don't reset scenario index - let it continue cycling
    onRetry?.();
  };

  const handleSubmit = () => {
    setState('success');
    onSubmit?.();
  };

  const renderUploadState = () => (
    <div className="text-center">
      <div 
        className={cn(
          "border rounded-2xl p-8 cursor-pointer transition-all duration-300",
          "bg-upload-background border-upload-border hover:shadow-widget-hover",
          dragOver && "border-primary bg-primary/5 scale-[1.02]"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload className="w-16 h-16 mx-auto mb-6 text-muted-foreground stroke-1" />
        <h3 className="text-lg font-semibold mb-2">Upload your {documentType}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Drag and drop your file here, or click to browse
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2">
          Choose file
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Supports {acceptedFileTypes.join(', ')} • Max {maxFileSize}MB
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
      />
    </div>
  );

  const renderProgressState = () => {
    const progress = state === 'uploading' ? 30 : state === 'processing' ? 60 : 90;
    
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-6">{getDynamicLoaderMessage()}</h3>
        
        {/* Progress bar with percentage */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground ml-3 min-w-[3rem] text-right">{progress}%</span>
          </div>
        </div>
        
        {uploadedFile && (
          <div className="bg-progress-background border border-muted rounded-lg p-3 mt-4">
            <p className="text-sm text-muted-foreground font-medium">{uploadedFile.name}</p>
          </div>
        )}
      </div>
    );
  };

  const renderLiveFeedbackState = () => (
    <div>
      <div className="text-center mb-6">
        <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
        <h3 className="text-lg font-semibold mb-2">Validating fields...</h3>
        <p className="text-sm text-muted-foreground">
          We're checking the document for required information
        </p>
      </div>
      
      <div className="space-y-3">
        {validationFields.map((field, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-progress-background rounded-lg">
            {field.icon}
            <span className="text-sm font-medium flex-1">{field.name}</span>
            <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderValidationState = () => {
    const invalidFields = validationFields.filter(field => !field.validated);
    const allFieldsValid = invalidFields.length === 0;
    
    // Always show the "Please review" screen regardless of field validity
    return (
      <div>
        <div className="text-center mb-6">
          <h3 className="text-[18px] font-semibold">Please review</h3>
        </div>
        
        {/* Eye-catching badge display */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {validationFields.map((field, index) => (
            <div key={index} className="relative">
              <div 
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-widget-background border border-widget-border shadow-widget transition-all duration-200 hover:shadow-widget-hover cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredField(field.name)}
                onMouseLeave={() => setHoveredField(null)}
              >
                {/* Default content (icon + label) */}
                <div className={`flex items-center gap-2 w-full transition-all duration-300 ease-in-out ${
                  hoveredField === field.name && field.validated && (field.name === 'Account number' || field.name === 'Period')
                    ? 'opacity-0 transform translate-y-2' 
                    : 'opacity-100 transform translate-y-0'
                }`}>
                  {field.validated ? (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-error flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">
                      {field.name === 'Account number' ? 'Account no.' : field.name}
                    </div>
                  </div>
                </div>

                {/* Hover content (value) - only for Account number and Period when validated */}
                {field.validated && (field.name === 'Account number' || field.name === 'Period') && (
                  <div className={`absolute inset-0 flex items-center justify-center px-4 py-3 transition-all duration-300 ease-in-out ${
                    hoveredField === field.name 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform -translate-y-2 pointer-events-none'
                  }`}>
                    <span className="font-semibold text-foreground text-center">
                      {field.name === 'Account number' ? '****1234' : 'Jan 1–Jun 30, 2024'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {invalidFields.length > 0 && invalidFields.some(field => field.name === 'Period') && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-6 shadow-sm">
            <p className="text-sm text-error">
              14 days missing. Please upload Jan 1 to Jun 30, 2024 statement.
            </p>
          </div>
        )}

        {invalidFields.length > 0 && invalidFields.some(field => field.name === 'Name') && invalidFields.some(field => field.name === 'Address') && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-6 shadow-sm">
            <p className="text-sm text-error">
              Name and address is missing.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {
            setState('upload');
            setUploadedFile(null);
            setValidationFields(fields => 
              fields.map(field => ({ ...field, validated: false }))
            );
            // Don't reset scenario index - let it continue cycling
          }} className="flex-1">
            Try another
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit
          </Button>
        </div>
      </div>
    );
  };

  const renderErrorState = () => (
    <div className="text-center">
      <div className="w-[52px] h-[52px] mx-auto mb-4 bg-error rounded-full flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-[18px] font-semibold mb-2">Something went wrong</h3>
      <p className="text-[16px] text-muted-foreground mb-6">
        We couldn't complete your request. Please try again.
      </p>
      <div className="flex justify-center">
        <Button onClick={handleRetry} className="px-6">
          Try again
        </Button>
      </div>
    </div>
  );

  const renderUnprocessableState = () => (
    <div className="text-center">
      {/* Warning icon with amber background to match other states */}
      <div className="w-[52px] h-[52px] mx-auto mb-6 bg-warning rounded-full flex items-center justify-center">
        <TriangleAlert className="w-6 h-6 text-white" />
      </div>
      
      {/* Title with consistent font size */}
      <h3 className="text-lg font-semibold mb-6">Unprocessable image</h3>
      
      {/* Content container with plain background */}
      <div className="bg-progress-background border border-muted rounded-lg p-4 text-left mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Unable to process document. Please ensure:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Document is centered and well-lit</li>
          <li>• All corners are clearly visible</li>
          <li>• Background is clean, no shadows</li>
          <li>• Document is not tilted</li>
          <li>• Paper is flat (no folds)</li>
        </ul>
      </div>
      
      {/* Button with consistent styling */}
      <div className="flex justify-center">
        <Button onClick={handleRetry} className="px-6">
          Try again
        </Button>
      </div>
    </div>
  );

  const renderDocumentVerifiedState = () => (
    <div className="text-center">
      <CheckCircle className="w-[52px] h-[52px] mx-auto mb-4 text-info" />
      <h3 className="text-lg font-semibold mb-6">Original document verified successfully</h3>
      
      <div className="bg-progress-background border border-muted rounded-lg p-4 text-left mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground font-medium">Document ID:</span>
            <span className="text-sm font-mono text-foreground">{verificationDetails.documentId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground font-medium">Generated on:</span>
            <span className="text-sm text-foreground">December 10, 2024</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground font-medium">Document fingerprint:</span>
            <span className="text-sm font-mono text-foreground truncate">{verificationDetails.fingerprint}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground font-medium">Original source:</span>
            <span className="text-sm text-foreground">{verificationDetails.source}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setState('upload')} className="px-6">
          Try again
        </Button>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center">
      <CheckCircle className="w-[52px] h-[52px] mx-auto mb-4 text-success" />
      <h3 className="text-[22px] font-semibold mb-2">Thank you</h3>
      <p className="text-[17px] text-foreground">
        Submission successful
      </p>
    </div>
  );

  return (
    <div className={cn(
      "bg-widget-background border border-widget-border rounded-2xl w-full max-w-md mx-auto flex flex-col relative transition-all duration-300", 
      state === 'success' ? 'shadow-sm' : 'shadow-widget hover:shadow-widget-hover', 
      className
    )}>
      {/* Widget Content */}
      <div className="min-h-48 p-6 flex-1">
        {state === 'upload' && renderUploadState()}
        {(state === 'uploading' || state === 'processing' || state === 'validating') && renderProgressState()}
        {state === 'live-feedback' && renderLiveFeedbackState()}
        {state === 'verified' && renderValidationState()}
        {state === 'document-verified' && renderDocumentVerifiedState()}
        {state === 'error' && renderErrorState()}
        {state === 'unprocessable' && renderUnprocessableState()}
        {state === 'success' && renderSuccessState()}
      </div>
      
      {/* Powered by DIRO - Branding (hidden on success screen) */}
      {state !== 'success' && (
        <div className="flex items-center justify-end gap-1.5 px-6 pb-4">
          <span className="text-xs text-muted-foreground font-medium">Powered by</span>
          <img 
            src="/lovable-uploads/60eda7c0-d9e6-4f77-b30e-985d3c98e69b.png" 
            alt="DIRO" 
            className="h-3 opacity-70"
          />
        </div>
      )}
    </div>
  );
};

export default DiroUploadWidget;