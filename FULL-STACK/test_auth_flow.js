const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yfnlrnefqzdxwozygmbp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmbmxybmVmcXpkeHdvenlnbWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTgwNDgsImV4cCI6MjA2NDc3NDA0OH0.uDTKKVYdLx3xV11fl5UF0SyJl5HSeKa20knNfNknVlM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthFlow() {
    console.log("--- STARTING AUTH FLOW TEST ---");
    const uniqueId = Math.floor(Math.random() * 10000);
    const email = `test_user_process_${uniqueId}@internal.app`;
    const password = 'testPassword123!';

    console.log(`1. Attempting Signup for: ${email}`);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
        console.error('❌ Signup Failed:', signUpError.message);
        if (signUpError.message.includes("Signups not allowed")) {
            console.error("   -> ACTION REQUIRED: Enable 'Email provider' in Supabase Auth Settings.");
        }
        return;
    }

    console.log('✅ Signup Successful User ID:', signUpData.user?.id);
    console.log('   Session status:', signUpData.session ? 'Active (Email Confirmed/Disabled)' : 'None (Waiting for Confirmation)');

    if (!signUpData.session) {
        console.warn("⚠️  Start Session missing. Email confirmation is likely ENABLED in Supabase.");
        console.warn("   -> ACTION REQUIRED: Disable 'Confirm email' in Supabase Auth -> Providers -> Email.");
        // We cannot proceed to login if not confirmed, usually.
    }

    console.log(`2. Attempting Login for: ${email}`);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        console.error('❌ Login Failed:', signInError.message);
    } else {
        console.log('✅ Login Successful. Session Token:', signInData.session?.access_token?.substring(0, 20) + '...');
    }
    console.log("--- TEST COMPLETE ---");
}

testAuthFlow();
