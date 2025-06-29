
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  Trash2,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

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

interface AssessmentCardProps {
  assessment: DamageAssessment;
  onView: (assessment: DamageAssessment) => void;
  onDelete: (id: string) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  onView,
  onDelete
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'วิเคราะห์เสร็จแล้ว';
      case 'processing':
        return 'กำลังวิเคราะห์';
      case 'failed':
        return 'วิเคราะห์ไม่สำเร็จ';
      default:
        return 'รอการวิเคราะห์';
    }
  };

  const getDamageLevelColor = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'severe':
        return 'bg-orange-500 text-white';
      case 'moderate':
        return 'bg-yellow-500 text-black';
      case 'minor':
        return 'bg-blue-500 text-white';
      case 'none':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getDamageLevelText = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'วิกฤติ';
      case 'severe':
        return 'รุนแรง';
      case 'moderate':
        return 'ปานกลาง';
      case 'minor':
        return 'เล็กน้อย';
      case 'none':
        return 'ไม่มีความเสียหาย';
      default:
        return 'ไม่ระบุ';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            {assessment.original_filename || 'รูปภาพไม่มีชื่อ'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(assessment.processing_status)}
            <span className="text-sm text-gray-600">
              {getStatusText(assessment.processing_status)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Image Preview */}
        <div className="relative">
          <img
            src={assessment.image_url}
            alt="Damage assessment"
            className="w-full h-48 object-cover rounded-lg"
          />
          {assessment.processing_status === 'processing' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p>กำลังวิเคราะห์...</p>
              </div>
            </div>
          )}
        </div>

        {/* Assessment Results */}
        {assessment.processing_status === 'completed' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ระดับความเสียหาย:</span>
              <Badge className={getDamageLevelColor(assessment.damage_level)}>
                {getDamageLevelText(assessment.damage_level)}
              </Badge>
            </div>

            {assessment.confidence_score && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ความแม่นยำ:</span>
                <span className="text-sm">
                  {(assessment.confidence_score * 100).toFixed(1)}%
                </span>
              </div>
            )}

            {assessment.estimated_cost && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ค่าซ่อมแซมประมาณ:</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(assessment.estimated_cost)}
                </span>
              </div>
            )}

            {assessment.detected_categories && assessment.detected_categories.length > 0 && (
              <div>
                <span className="text-sm font-medium">ประเภทความเสียหาย:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {assessment.detected_categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {assessment.processing_status === 'failed' && assessment.error_message && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">เกิดข้อผิดพลาด:</p>
                <p>{assessment.error_message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>อัปโหลดเมื่อ: {format(new Date(assessment.created_at), 'dd/MM/yyyy HH:mm')}</p>
          {assessment.processed_at && (
            <p>วิเคราะห์เสร็จเมื่อ: {format(new Date(assessment.processed_at), 'dd/MM/yyyy HH:mm')}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(assessment)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            ดูรายละเอียด
          </Button>
          
          {assessment.processing_status === 'completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(assessment.image_url, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(assessment.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentCard;
