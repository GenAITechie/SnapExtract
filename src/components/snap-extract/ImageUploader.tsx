
'use client';

import { ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileText, Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  onExtract: () => void;
  isExtracting: boolean;
  selectedFileNames: string[] | null;
  previewDataUris: string[] | null;
}

export function ImageUploader({
  onImageSelect,
  onExtract,
  isExtracting,
  selectedFileNames,
  previewDataUris
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageSelect(Array.from(files));
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="bill-image-upload" className="text-base font-medium">Upload Bill Image(s)</Label>
        <div
          className="mt-2 flex flex-col justify-center items-center w-full min-h-64 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
          onClick={handleUploadAreaClick}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) onImageSelect(Array.from(files));
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="space-y-1 text-center">
            {previewDataUris && previewDataUris.length > 0 ? (
              previewDataUris.length === 1 ? (
                <Image 
                  src={previewDataUris[0]} 
                  alt="Selected bill preview" 
                  width={200} 
                  height={200} 
                  className="mx-auto max-h-48 w-auto object-contain rounded-md"
                  data-ai-hint="bill preview"
                />
              ) : (
                <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-2 bg-secondary/50 rounded-md">
                  {previewDataUris.map((uri, index) => (
                    <Image 
                      key={index} 
                      src={uri} 
                      alt={`Preview ${index + 1}`} 
                      width={80} 
                      height={80} 
                      className="object-contain rounded-md border bg-background shadow-sm"
                      data-ai-hint="bill preview"
                    />
                  ))}
                </div>
              )
            ) : (
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            )}
             {previewDataUris && previewDataUris.length > 1 && (
              <p className="text-xs text-muted-foreground pt-1">{previewDataUris.length} images selected</p>
            )}
            <div className="flex text-sm text-muted-foreground">
              <span className="relative rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                Click to upload
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
            <Input
              id="bill-image-upload"
              name="bill-image-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple 
            />
          </div>
        </div>
      </div>

      {selectedFileNames && selectedFileNames.length > 0 && (
        <div className="p-3 bg-secondary rounded-md text-sm space-y-1">
          <div className="flex items-center font-medium">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Selected Files:
          </div>
          <ul className="list-disc list-inside pl-2 text-xs text-muted-foreground max-h-24 overflow-y-auto">
            {selectedFileNames.map((name, index) => (
              <li key={index} className="truncate">{name}</li>
            ))}
          </ul>
        </div>
      )}

      <Button
        onClick={onExtract}
        disabled={!selectedFileNames || selectedFileNames.length === 0 || isExtracting}
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
