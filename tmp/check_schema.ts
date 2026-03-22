import { createClient } from './utils/supabase/server.ts';

async function checkSchema() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Fetch Error:', error);
  } else {
    console.log('Sample Data:', data);
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    }
  }
}

checkSchema();
