-- Projects Database Schema for CV API Microservice
-- This table stores portfolio projects data

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    project_type VARCHAR(20) NOT NULL CHECK (project_type IN ('company', 'personal', 'freelance')),
    status VARCHAR(20) NOT NULL DEFAULT 'planned' CHECK (status IN ('completed', 'in_progress', 'planned', 'archived')),
    technologies TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    priority INTEGER DEFAULT 50 CHECK (priority >= 0 AND priority <= 100),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority DESC);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_type_status ON projects(project_type, status);
CREATE INDEX IF NOT EXISTS idx_projects_featured_priority ON projects(is_featured, priority DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status_date ON projects(status, created_at DESC);

-- Insert some sample projects for testing
INSERT INTO projects (title, description, project_type, status, technologies, features, github_url, live_url, priority, is_featured) VALUES 
(
    'CV Portfolio Website',
    'A modern, responsive portfolio website built with React and Node.js microservices architecture.',
    'personal',
    'completed',
    ARRAY['React', 'Node.js', 'Express', 'Supabase', 'Tailwind CSS'],
    ARRAY['Responsive Design', 'Contact Form', 'Project Showcase', 'Admin Dashboard'],
    'https://github.com/example/cv-portfolio',
    'https://portfolio.example.com',
    90,
    TRUE
),
(
    'E-commerce API',
    'RESTful API for e-commerce platform with user authentication, product management, and payment processing.',
    'freelance',
    'completed',
    ARRAY['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Stripe API'],
    ARRAY['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Processing'],
    'https://github.com/example/ecommerce-api',
    NULL,
    85,
    TRUE
),
(
    'Task Management App',
    'A collaborative task management application for team productivity.',
    'company',
    'in_progress',
    ARRAY['React', 'TypeScript', 'Node.js', 'MongoDB', 'Socket.io'],
    ARRAY['Real-time Updates', 'Team Collaboration', 'File Attachments', 'Time Tracking'],
    'https://github.com/example/task-manager',
    'https://tasks.example.com',
    75,
    FALSE
) ON CONFLICT (id) DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON projects TO authenticated;
-- GRANT SELECT ON projects TO anon;
