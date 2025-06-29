
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DamageAssessment {
  id: string;
  incident_id?: string;
  image_url: string;
  original_filename?: string;
  assessment_result: any;
  damage_level?: 'none' | 'minor' | 'moderate' | 'severe' | 'critical';
  confidence_score?: number;
  detected_categories?: string[];
  estimated_cost?: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

interface UploadImageData {
  file: File;
  incident_id?: string;
}

export const useDamageAssessment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all damage assessments
  const { data: assessments = [], isLoading, error } = useQuery({
    queryKey: ['damage-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('damage_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DamageAssessment[];
    }
  });

  // Upload and analyze image
  const uploadAndAnalyze = useMutation({
    mutationFn: async (uploadData: UploadImageData) => {
      const { file, incident_id } = uploadData;
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('damage-assessment-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('damage-assessment-images')
        .getPublicUrl(fileName);

      // Create database record
      const { data: assessment, error: dbError } = await supabase
        .from('damage_assessments')
        .insert({
          incident_id,
          image_url: publicUrl,
          original_filename: file.name,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Call AI analysis edge function
      try {
        const { data: aiResult, error: aiError } = await supabase.functions.invoke('analyze-damage', {
          body: { 
            assessmentId: assessment.id,
            imageUrl: publicUrl 
          }
        });

        if (aiError) {
          console.error('AI Analysis Error:', aiError);
          // Update status to failed
          await supabase
            .from('damage_assessments')
            .update({ 
              processing_status: 'failed',
              error_message: aiError.message || 'AI analysis failed'
            })
            .eq('id', assessment.id);
        }

        return assessment;
      } catch (error) {
        console.error('Edge function error:', error);
        // Update status to failed
        await supabase
          .from('damage_assessments')
          .update({ 
            processing_status: 'failed',
            error_message: 'AI analysis service unavailable'
          })
          .eq('id', assessment.id);
        
        return assessment;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['damage-assessments'] });
      toast({
        title: "รูปภาพถูกอัปโหลดแล้ว",
        description: "กำลังดำเนินการวิเคราะห์ความเสียหาย...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัปโหลดรูปภาพได้",
        variant: "destructive",
      });
    }
  });

  // Delete assessment
  const deleteAssessment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('damage_assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['damage-assessments'] });
      toast({
        title: "ลบข้อมูลแล้ว",
        description: "ข้อมูลการประเมินความเสียหายถูกลบเรียบร้อยแล้ว",
      });
    },
    onError: (error: any) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถลบข้อมูลได้",
        variant: "destructive",
      });
    }
  });

  return {
    assessments,
    isLoading,
    error,
    uploadAndAnalyze: uploadAndAnalyze.mutate,
    deleteAssessment: deleteAssessment.mutate,
    isUploading: uploadAndAnalyze.isPending,
    isDeleting: deleteAssessment.isPending
  };
};
