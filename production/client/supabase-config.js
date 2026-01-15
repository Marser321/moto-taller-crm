// Supabase Configuration for Moto Taller App
const SUPABASE_URL = 'https://wygkeihgmolampvaonpr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z2tlaWhnbW9sYW1wdmFvbnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTE5MTgsImV4cCI6MjA4NDAyNzkxOH0.kJiWLnzcTz2Wj6BoyOfJl19ovMmVc2_xvyhFABtqq_0';

// Initialize Supabase Client (using REST API directly for simplicity)
const supabase = {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,
    
    // Generic fetch helper
    async query(table, method = 'GET', body = null, filters = '') {
        const url = `${this.url}/rest/v1/${table}${filters}`;
        const options = {
            method: method,
            headers: {
                'apikey': this.key,
                'Authorization': `Bearer ${this.key}`,
                'Content-Type': 'application/json',
                'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
            }
        };
        if (body) options.body = JSON.stringify(body);
        
        const res = await fetch(url, options);
        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Supabase error: ${res.status} - ${error}`);
        }
        
        // For GET, parse JSON. For others, return success indicator
        if (method === 'GET') {
            return await res.json();
        }
        return { success: true };
    },
    
    // Convenience methods
    async select(table, filters = '') {
        return this.query(table, 'GET', null, filters ? `?${filters}` : '');
    },
    
    async insert(table, data) {
        return this.query(table, 'POST', data);
    },
    
    async update(table, data, filters) {
        return this.query(table, 'PATCH', data, `?${filters}`);
    },
    
    async delete(table, filters) {
        return this.query(table, 'DELETE', null, `?${filters}`);
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}
