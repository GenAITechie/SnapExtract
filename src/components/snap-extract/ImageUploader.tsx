'use client';

import { ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileText, Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onExtract: () => void;
  isExtracting: boolean;
  selectedFileName: string | null;
  previewDataUri: string | null;
}

export function ImageUploader({
  onImageSelect,
  onExtract,
  isExtracting,
  selectedFileName,
  previewDataUri
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="bill-image-upload" className="text-base font-medium">Upload Bill Image</Label>
        <div
          className="mt-2 flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
          onClick={handleUploadAreaClick}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) onImageSelect(file);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="space-y-1 text-center">
            {previewDataUri ? (
              <Image 
                src={previewDataUri} 
                alt="Selected bill preview" 
                width={200} 
                height={200} 
                className="mx-auto max-h-48 w-auto object-contain rounded-md" 
                data-ai-hint="bill preview"
              />
            ) : (
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            )}
            <div className="flex text-sm text-muted-foreground">
              <span className="relative rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                Click to upload
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            <Input
              id="bill-image-upload"
              name="bill-image-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {selectedFileName && (
        <div className="flex items-center p-3 bg-secondary rounded-md text-sm">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          <span>Selected: <span className="font-medium">{selectedFileName}</span></span>
        </div>
      )}

      <Button
        onClick={onExtract}
        disabled={!selectedFileName || isExtracting}
        className="w-full text-base py-3"
        size="lg"
      >
        {isExtracting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Extracting...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-5 w-5" />
            Extract Data
          </>
        )}
      </Button>
    </div>
  );
}
