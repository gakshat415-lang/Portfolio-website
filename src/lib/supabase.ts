import { createClient } from '@supabase/supabase-js';

// We fallback to mock URLs to ensure build passes before the user connects their real Supabase DB
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory mock arrays for testing before Supabase is connected
export const mockCommentsDB: any[] = [];
export const mockSubscribersDB: any[] = [];
