const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yfnlrnefqzdxwozygmbp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmbmxybmVmcXpkeHdvenlnbWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTgwNDgsImV4cCI6MjA2NDc3NDA0OH0.uDTKKVYdLx3xV11fl5UF0SyJl5HSeKa20knNfNknVlM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProfiles() {
    console.log("--- Checking Profiles Table ---");
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${data.length} profiles.`);
    data.forEach((p, index) => {
        console.log(`\n${index + 1}. [${p.role.toUpperCase()}] ${p.email || p.phone}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Name: ${p.full_name}`);
        if (p.org_name) console.log(`   Org: ${p.org_name}`);
    });
}

listProfiles();
