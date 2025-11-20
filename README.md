# Smart Tuition Matching

Online platform connecting students with tutors in Bangladesh.

## Features
- 🔍 Search tutors by subject, location, salary
- 💬 Real-time chat between students and tutors
- ⭐ Review and rating system
- 👤 User authentication (student/tutor roles)
- 📊 Dynamic statistics and admin dashboard

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## Setup

1. Clone repository
```bash
git clone https://github.com/Hasib-2005/Smart-Tuition-Matching.git
```

2. Configure Supabase
- Create project at [supabase.com](https://supabase.com)
- Update `supabase-config.js` with your credentials
- Run SQL schema in Supabase SQL Editor

3. Deploy to Vercel
```bash
vercel deploy
```

## Database Schema

```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'tutor')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tutors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    varsity VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    to_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (from_email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (to_email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (reviewer_email) REFERENCES users(email) ON DELETE CASCADE
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE tutors DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
```

## Contributors
- Mohammad Hasibur Rahman
- Tithi Rani Das
- Toufiqul Hossain Siam
- Syed Ishmamul Hauqe
- Arman Nesar Samy

## License
MIT
