-- SMIT Connect Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  CONSTRAINT admins_username_key UNIQUE (username)
);

-- Insert default admin (username: admin, password: admin123)
INSERT INTO public.admins (name, username, password) 
VALUES ('Super Admin', 'admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Create student_registrations table
CREATE TABLE IF NOT EXISTS public.student_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  country TEXT NOT NULL,
  gender TEXT NOT NULL,
  course TEXT NOT NULL,
  class_preference TEXT NOT NULL,
  city TEXT NOT NULL,
  campus TEXT,
  
  full_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  dob DATE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  father_phone TEXT,
  id_number TEXT NOT NULL,
  father_id_number TEXT NOT NULL,
  address TEXT NOT NULL,
  
  computer_proficiency TEXT,
  last_qualification TEXT,
  hear_about TEXT,
  has_laptop TEXT,
  
  picture_url TEXT,
  
  status TEXT DEFAULT 'pending',
  roll_number TEXT,
  
  CONSTRAINT student_registrations_email_key UNIQUE (email)
);

-- Add missing columns to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image TEXT;

-- Add roll_number to student_registrations if not exists
ALTER TABLE public.student_registrations ADD COLUMN IF NOT EXISTS roll_number TEXT;

-- Add course and status columns to students if not exists
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS course TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Clear existing courses
DELETE FROM public.courses;

-- Insert new courses
INSERT INTO public.courses (name, description, category, duration, status, image) VALUES
  ('AI & Chatbot', 'Learn to build intelligent chatbots using AI and machine learning', 'Development', '5 months', 'open', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&q=80'),
  ('Python Programming', 'Master Python programming from basics to advanced concepts', 'Development', '3 months', 'open', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=640&q=80'),
  ('Flutter App Development', 'Build cross-platform mobile apps with Flutter', 'Development', '6 months', 'open', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&q=80'),
  ('Generative AI', 'Explore the world of generative AI and create amazing applications', 'Development', '4 months', 'open', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=640&q=80'),
  ('3D Animation', 'Create stunning 3D animations and visual effects', 'Designing', '6 months', 'open', 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=640&q=80'),
  ('Video Animation', 'Learn professional video animation techniques', 'Designing', '4 months', 'open', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=640&q=80'),
  ('Graphic Designing', 'Master graphic design tools and principles', 'Designing', '3 months', 'open', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=640&q=80'),
  ('3D Visualization', 'Create realistic 3D visualizations and renderings', 'Designing', '5 months', 'open', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&q=80'),
  ('IT Professional', 'Comprehensive IT professional certification program', 'Networking', '6 months', 'open', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80'),
  ('Cyber Security', 'Learn to protect systems and networks from cyber threats', 'Networking', '5 months', 'open', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&q=80'),
  ('Cisco Certified', 'Get Cisco certified and advance your networking career', 'Networking', '4 months', 'open', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&q=80'),
  ('IT Essentials', 'Learn fundamental IT skills and concepts', 'Networking', '3 months', 'open', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&q=80'),
  ('CCTV Camera Installation', 'Learn to install and maintain CCTV camera systems', 'Vocational', '2 months', 'open', 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=640&q=80'),
  ('Laptop Repairing', 'Master laptop hardware repair and troubleshooting', 'Vocational', '3 months', 'open', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=640&q=80'),
  ('Solar System Installation', 'Learn to install and maintain solar power systems', 'Vocational', '3 months', 'open', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=640&q=80'),
  ('R/O Plant Operator', 'Become a certified RO plant operator', 'Vocational', '2 months', 'open', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=640&q=80'),
  ('Mobile Repairing', 'Learn mobile phone repair and start your business', 'Entrepreneurship', '3 months', 'open', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=640&q=80'),
  ('Amazon FBA Master', 'Master Amazon FBA and start selling online', 'Entrepreneurship', '4 months', 'open', 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=640&q=80'),
  ('Freelancing', 'Learn how to succeed as a freelancer', 'Entrepreneurship', '2 months', 'open', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=640&q=80'),
  ('Shopify E-Commerce', 'Build and manage successful Shopify stores', 'Entrepreneurship', '3 months', 'open', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80');

-- Create students table (for enrolled students)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  cnic TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  password TEXT,
  is_active BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  CONSTRAINT students_roll_number_key UNIQUE (roll_number)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'present',
  CONSTRAINT attendance_status_check CHECK (status IN ('present', 'absent')),
  CONSTRAINT attendance_unique UNIQUE (student_id, date)
);

-- Create leaves table (for student leave requests)
CREATE TABLE IF NOT EXISTS public.leaves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  student_id UUID,
  student_name TEXT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  CONSTRAINT leaves_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read on admins" ON public.admins;
DROP POLICY IF EXISTS "Allow admins to update admins" ON public.admins;
DROP POLICY IF EXISTS "Allow public insert on student_registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow public read on student_registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow public update on student_registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Allow public read on courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public update on courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public insert on courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public all on students" ON public.students;
DROP POLICY IF EXISTS "Allow public all on leaves" ON public.leaves;

-- Create policies for public access (for development - adjust for production)
CREATE POLICY "Allow public read on admins" 
ON public.admins 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow admins to update admins" 
ON public.admins 
FOR ALL
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public insert on student_registrations" 
ON public.student_registrations 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public read on student_registrations" 
ON public.student_registrations 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public update on student_registrations" 
ON public.student_registrations 
FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read on courses" 
ON public.courses 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public update on courses" 
ON public.courses 
FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public insert on courses" 
ON public.courses 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public all on students" 
ON public.students 
FOR ALL
TO public 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public all on leaves" 
ON public.leaves 
FOR ALL
TO public 
USING (true)
WITH CHECK (true);

-- Attendance policies
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on attendance" ON public.attendance;
CREATE POLICY "Allow public all on attendance"
ON public.attendance
FOR ALL
TO public
USING (true)
WITH CHECK (true);
