-- Fix chat histories RLS (n8n_chat_histories doesn't have user_id, only session_id)
DROP POLICY IF EXISTS "Users can view chat histories" ON n8n_chat_histories;
DROP POLICY IF EXISTS "Anyone can view chat histories" ON n8n_chat_histories;
DROP POLICY IF EXISTS "Users can view their own chat history" ON n8n_chat_histories;
DROP POLICY IF EXISTS "Public users can only view their session" ON n8n_chat_histories;
DROP POLICY IF EXISTS "System can manage chat history" ON n8n_chat_histories;

-- Only allow system/service to manage chat history to prevent data exposure
CREATE POLICY "Service role can manage chat history"
ON n8n_chat_histories
FOR ALL
TO service_role
USING (true);

-- Authenticated users can only see their session via edge function
-- No direct SELECT policy to prevent exposure

-- Fix damage assessments to require authentication for CREATE/UPDATE
DROP POLICY IF EXISTS "Anyone can create damage assessments" ON damage_assessments;
DROP POLICY IF EXISTS "Anyone can update damage assessments" ON damage_assessments;

CREATE POLICY "Authenticated users can create damage assessments"
ON damage_assessments
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update damage assessments"
ON damage_assessments
FOR UPDATE
TO authenticated
USING (true);