
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  maxSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  isUploading = false, 
  maxSize = 10 
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false
  });

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {!preview && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer ${
                isDragActive ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 mb-4" />
              {isDragActive ? (
                <p className="text-lg">วางรูปภาพที่นี่...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">
                    ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                  </p>
                  <p className="text-sm text-gray-400">
                    รองรับไฟล์ JPG, PNG, WEBP (ขนาดไม่เกิน {maxSize} MB)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {fileRejections.length > 0 && (
        <div className="text-red-500 text-sm">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              ไฟล์ {file.name}:
              <ul className="list-disc list-inside ml-4">
                {errors.map(error => (
                  <li key={error.code}>
                    {error.code === 'file-too-large' 
                      ? `ไฟล์ใหญ่เกินไป (ขนาดสูงสุด ${maxSize} MB)`
                      : error.message
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearSelection}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Image className="h-4 w-4" />
                <span>{selectedFile?.name}</span>
                <span>({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={75} className="w-full" />
                  <p className="text-sm text-gray-500">กำลังอัปโหลดและวิเคราะห์...</p>
                </div>
              )}
              
              {!isUploading && (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpload}
                    className="flex-1"
                    disabled={!selectedFile}
                  >
                    อัปโหลดและวิเคราะห์
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearSelection}
                  >
                    ยกเลิก
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
