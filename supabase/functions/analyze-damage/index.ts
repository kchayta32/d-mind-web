
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentId, imageUrl } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update status to processing
    await supabase
      .from('damage_assessments')
      .update({ processing_status: 'processing' })
      .eq('id', assessmentId);

    console.log('Processing damage assessment for:', assessmentId);
    console.log('Image URL:', imageUrl);

    // TODO: Integrate your trained AI model here
    // For now, we'll simulate the analysis process
    
    // Simulated AI analysis results (replace with your actual model)
    const mockAnalysisResult = {
      damage_detected: true,
      damage_types: ['structural', 'water'],
      severity_score: 0.75,
      affected_areas: ['roof', 'walls', 'foundation'],
      estimated_repair_cost: 150000,
      confidence: 0.85,
      analysis_timestamp: new Date().toISOString(),
      model_version: '1.0.0'
    };

    // Determine damage level based on severity score
    let damageLevel = 'none';
    if (mockAnalysisResult.severity_score > 0.8) damageLevel = 'critical';
    else if (mockAnalysisResult.severity_score > 0.6) damageLevel = 'severe';
    else if (mockAnalysisResult.severity_score > 0.4) damageLevel = 'moderate';
    else if (mockAnalysisResult.severity_score > 0.2) damageLevel = 'minor';

    // Update assessment with results
    const { data: updatedAssessment, error: updateError } = await supabase
      .from('damage_assessments')
      .update({
        processing_status: 'completed',
        assessment_result: mockAnalysisResult,
        damage_level: damageLevel,
        confidence_score: mockAnalysisResult.confidence,
        detected_categories: mockAnalysisResult.damage_types,
        estimated_cost: mockAnalysisResult.estimated_repair_cost,
        processed_at: new Date().toISOString()
      })
      .eq('id', assessmentId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      assessment: updatedAssessment,
      message: 'Damage assessment completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-damage function:', error);
    
    // Try to update status to failed if we have the assessmentId
    try {
      const { assessmentId } = await req.json();
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      await supabase
        .from('damage_assessments')
        .update({ 
          processing_status: 'failed',
          error_message: error.message 
        })
        .eq('id', assessmentId);
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
