import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aasbhuxqcgxtyzrgumbq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhc2JodXhxY2d4dHl6cmd1bWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMzMxNDksImV4cCI6MjA5OTkwOTE0OX0.XNJUUl-0IsX_cQ0Eue9h3h0MABc_Xr0HSjgFNhNBDuQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('projects').select('*');
  console.log('Projects error:', error);
  console.log('Projects data:', JSON.stringify(data, null, 2));
}

test();
