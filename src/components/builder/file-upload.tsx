'use client';

import { useState, useRef, DragEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.docx',
  maxSize = 10
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      return 'Please upload a PDF or DOCX file.';
    }

    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB.`;
    }

    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    try {
      await onFileSelect(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process file');
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-sm p-8 text-center transition-colors
          ${isDragging ? 'border-accent bg-accent/5' : 'border-border'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-accent/50'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
        />
        <div className="space-y-2">
          <p className="text-sm font-sans text-foreground/70">
            {isDragging ? 'Drop your file here' : 'Drag and drop your resume here'}
          </p>
          <p className="text-xs font-sans text-foreground/50">
            or click to browse
          </p>
          <p className="text-xs font-sans text-foreground/50">
            PDF or DOCX, max {maxSize}MB
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm font-sans text-red-600">{error}</p>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-sm font-sans text-foreground/70 text-center">
          Processing file...
        </div>
      )}
    </div>
  );
}
