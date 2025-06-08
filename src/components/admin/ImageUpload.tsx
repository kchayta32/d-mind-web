
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "รูปภาพ" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "ไฟล์ไม่ถูกต้อง",
        description: "กรุณาเลือกไฟล์รูปภาพ",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "ไฟล์ใหญ่เกินไป",
        description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreviewUrl(dataUrl);
        onChange(dataUrl);
        setIsUploading(false);
        
        toast({
          title: "อัพโหลดสำเร็จ",
          description: "รูปภาพได้ถูกอัพโหลดแล้ว",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพโหลดรูปภาพได้",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* URL Input */}
      <div>
        <Label htmlFor="image-url" className="text-xs text-gray-600">URL รูปภาพ</Label>
        <Input
          id="image-url"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
      </div>

      {/* File Upload */}
      <div>
        <Label className="text-xs text-gray-600">หรืออัพโหลดจากเครื่อง</Label>
        <div className="mt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'กำลังอัพโหลด...' : 'เลือกไฟล์รูปภาพ'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <Label className="text-xs text-gray-600">ตัวอย่างรูปภาพ</Label>
          <div className="mt-1 relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-32 object-cover rounded-lg border"
              onError={() => {
                setPreviewUrl('');
                toast({
                  title: "ไม่สามารถโหลดรูปภาพได้",
                  description: "กรุณาตรวจสอบ URL รูปภาพ",
                  variant: "destructive",
                });
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
