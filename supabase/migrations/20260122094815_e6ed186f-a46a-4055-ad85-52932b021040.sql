-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'inspector', 'operator', 'viewer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create vehicles table for AutoInspect
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year TEXT,
  vin TEXT,
  color TEXT,
  mileage TEXT,
  license_plate TEXT,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'On-Hold', 'Sold')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inspection_reports table
CREATE TABLE public.inspection_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  inspector_id UUID REFERENCES auth.users(id),
  inspector_name TEXT,
  inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_validated BOOLEAN DEFAULT false,
  validated_by UUID REFERENCES auth.users(id),
  validated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_entries table for Kabalebo Ops
CREATE TABLE public.food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  item TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT,
  packaging TEXT,
  recorded_by TEXT,
  recorded_by_user_id UUID REFERENCES auth.users(id),
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fuel_entries table for Kabalebo Ops
CREATE TABLE public.fuel_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  liters NUMERIC NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Gasoline', 'Diesel')),
  target_machine TEXT,
  meter_start TEXT,
  meter_end TEXT,
  hours_start TEXT,
  hours_end TEXT,
  km_start TEXT,
  km_end TEXT,
  operator TEXT,
  operator_user_id UUID REFERENCES auth.users(id),
  photo_url TEXT,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parts_entries table for Kabalebo Ops
CREATE TABLE public.parts_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  part_name TEXT NOT NULL,
  part_number TEXT,
  machine_id TEXT,
  mechanic TEXT,
  mechanic_user_id UUID REFERENCES auth.users(id),
  work_order TEXT,
  condition TEXT CHECK (condition IN ('Nieuw', 'Gereviseerd')),
  reason TEXT,
  photo_url TEXT,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_entries ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user has any role (authenticated staff member)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Roles RLS Policies (only admins can manage)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Vehicles RLS Policies (staff can read, inspectors/admins can write)
CREATE POLICY "Staff can view vehicles"
  ON public.vehicles FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Inspectors can insert vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'inspector') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Inspectors can update vehicles"
  ON public.vehicles FOR UPDATE
  USING (public.has_role(auth.uid(), 'inspector') OR public.has_role(auth.uid(), 'admin'));

-- Inspection Reports RLS Policies
CREATE POLICY "Staff can view inspection reports"
  ON public.inspection_reports FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Inspectors can insert reports"
  ON public.inspection_reports FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'inspector') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Inspectors can update their own reports"
  ON public.inspection_reports FOR UPDATE
  USING (inspector_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Kabalebo tables RLS Policies (staff can read/write)
CREATE POLICY "Staff can view food entries"
  ON public.food_entries FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert food entries"
  ON public.food_entries FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update unlocked food entries"
  ON public.food_entries FOR UPDATE
  USING (public.is_staff(auth.uid()) AND (is_locked = false OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Staff can view fuel entries"
  ON public.fuel_entries FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert fuel entries"
  ON public.fuel_entries FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update unlocked fuel entries"
  ON public.fuel_entries FOR UPDATE
  USING (public.is_staff(auth.uid()) AND (is_locked = false OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Staff can view parts entries"
  ON public.parts_entries FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert parts entries"
  ON public.parts_entries FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update unlocked parts entries"
  ON public.parts_entries FOR UPDATE
  USING (public.is_staff(auth.uid()) AND (is_locked = false OR public.has_role(auth.uid(), 'admin')));

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inspection_reports_updated_at
  BEFORE UPDATE ON public.inspection_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();