// Supabase Configuration
const SUPABASE_URL = 'https://smyiiuycctamasvymptd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNteWlpdXljY3RhbWFzdnltcHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTg2ODksImV4cCI6MjA3OTIzNDY4OX0.VdZSA3q_9-2j5JIPc-iKkzn81SfgaVzzXXIXMfc0ak4';

// Initialize Supabase client with proper options
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false
    },
    global: {
        headers: {
            'Content-Type': 'application/json'
        }
    }
});

// Database helper functions
const db = {
    // Users table operations
    async createUser(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select();
        return { data, error };
    },

    async getUserByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .limit(1);
        return { data: data?.[0] || null, error };
    },

    async updateUserPassword(email, newPassword) {
        const { data, error } = await supabase
            .from('users')
            .update({ password: newPassword })
            .eq('email', email.toLowerCase());
        return { data, error };
    },

    // Tutors table operations
    async createOrUpdateTutor(tutorData) {
        const { data, error } = await supabase
            .from('tutors')
            .upsert([tutorData], { onConflict: 'email' })
            .select();
        return { data, error };
    },

    async getTutors(filters = {}) {
        let query = supabase.from('tutors').select('*');
        
        if (filters.subject) {
            query = query.ilike('subject', `%${filters.subject}%`);
        }
        if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.minSalary && filters.maxSalary) {
            query = query.gte('salary', filters.minSalary).lte('salary', filters.maxSalary);
        } else if (filters.minSalary) {
            query = query.gte('salary', filters.minSalary);
        } else if (filters.maxSalary) {
            query = query.lte('salary', filters.maxSalary);
        }

        const { data, error } = await query;
        console.log('Database query result:', { data, error, filters });
        return { data, error };
    },

    async deleteTutor(email) {
        const { data, error } = await supabase
            .from('tutors')
            .delete()
            .eq('email', email);
        return { data, error };
    },

    // Messages table operations
    async sendMessage(messageData) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                    from_email: messageData.from_email,
                    to_email: messageData.to_email,
                    from_name: messageData.from_name,
                    to_name: messageData.to_name,
                    text: messageData.text,
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) {
                console.error('Supabase insert error:', error);
            }
            return { data, error };
        } catch (e) {
            console.error('Network error sending message:', e);
            return { data: null, error: { message: 'Network error: ' + e.message } };
        }
    },

    async getMessages(userEmail) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`from_email.eq.${userEmail},to_email.eq.${userEmail}`)
            .order('created_at', { ascending: true });
        return { data, error };
    },

    // Reviews table operations
    async createReview(reviewData) {
        const { data, error } = await supabase
            .from('reviews')
            .insert([reviewData])
            .select();
        return { data, error };
    },

    async getReviews() {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
        return { data, error };
    },

    async getAverageRating() {
        const { data, error } = await supabase
            .rpc('get_average_rating');
        return { data, error };
    }
};

// Utility functions
const utils = {
    showLoading(element, text = 'Loading...') {
        if (element) {
            element.innerHTML = `<div style="text-align:center;padding:20px;color:#6b7280;">${text}</div>`;
        }
    },

    showError(element, message) {
        if (element) {
            element.innerHTML = `<div style="text-align:center;padding:20px;color:#ef4444;">❌ ${message}</div>`;
        }
    },

    async handleAsync(asyncFn, loadingElement = null, errorElement = null) {
        try {
            if (loadingElement) this.showLoading(loadingElement);
            const result = await asyncFn();
            return result;
        } catch (error) {
            console.error('Async operation failed:', error);
            if (errorElement) this.showError(errorElement, error.message);
            return { error };
        }
    }
};