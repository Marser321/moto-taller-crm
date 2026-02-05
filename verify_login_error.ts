
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wygkeihgmolampvaonpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z2tlaWhnbW9sYW1wdmFvbnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTE5MTgsImV4cCI6MjA4NDAyNzkxOH0.kJiWLnzcTz2Wj6BoyOfJl19ovMmVc2_xvyhFABtqq_0'

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin() {
    console.log('Testing login for fede@mototaller.com with DUMMY password...')
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'fede@mototaller.com',
        password: 'wrongpassword123'
    })

    if (error) {
        console.log('Auth Error Received:')
        console.log('Status:', error.status)
        console.log('Message:', error.message)

        if (error.message.includes('Database error') || error.status === 500) {
            console.error('FAIL: Database error persists.')
        } else if (error.message.includes('Invalid login credentials') || error.status === 400) {
            console.log('SUCCESS: Schema error is GONE. (Invalid credentials expected)')
        } else {
            console.log('UNKNOWN ERROR:', error)
        }
    } else {
        console.log('Login somehow succeeded with wrong password?')
    }
}

testLogin()
