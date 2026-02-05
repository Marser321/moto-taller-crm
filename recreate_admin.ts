
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wygkeihgmolampvaonpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z2tlaWhnbW9sYW1wdmFvbnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTE5MTgsImV4cCI6MjA4NDAyNzkxOH0.kJiWLnzcTz2Wj6BoyOfJl19ovMmVc2_xvyhFABtqq_0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function recreateAdmin() {
    console.log('Recreating admin user...')
    const { data, error } = await supabase.auth.signUp({
        email: 'fede@mototaller.com',
        password: 'admin123',
        options: {
            data: {
                name: 'Fede Morer',
                role: 'admin' // Just in case metadata assumes this
            }
        }
    })

    if (error) {
        console.error('Signup Error:', error)
    } else {
        console.log('Signup Success!')
        console.log('User ID:', data.user?.id)
        console.log('Check your email for confirmation or if auto-confirm is on, try logging in.')
    }
}

recreateAdmin()
