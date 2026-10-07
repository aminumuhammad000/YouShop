-- YouShop Supabase schema + seed data
-- Run this file in Supabase SQL Editor.
-- The backend should use SUPABASE_SERVICE_ROLE_KEY for these tables.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  phone_number text,
  role text not null default 'user' check (role in ('user', 'vendor', 'driver', 'admin')),
  is_banned boolean not null default false,
  is_verified boolean not null default false,
  profile_picture text,
  store_name text,
  business_category text,
  business_description text,
  business_address text,
  state text,
  city text,
  store_logo text,
  store_cover text,
  vendor_status text,
  driver_status text,
  vehicle_type text,
  license_number text,
  plate_number text,
  is_online boolean not null default false,
  rating numeric(3,2) not null default 5.00,
  completed_trips integer not null default 0,
  driver_city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  discount_price numeric(12,2),
  stock integer not null default 0,
  sku text,
  category text,
  image_url text,
  images text[] not null default '{}',
  vendor_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.users(id) on delete set null,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  payment_method text,
  items jsonb not null default '[]'::jsonb,
  total_price numeric(12,2) not null default 0,
  status text not null default 'placed',
  order_number text unique,
  driver_id uuid references public.users(id) on delete set null,
  delivery_otp text,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chats (
  id text primary key,
  name text not null,
  avatar_color text default '#1B8A78',
  last_message text default '',
  last_message_time timestamptz default now(),
  unread integer not null default 0,
  participants text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id text not null references public.chats(id) on delete cascade,
  from_me boolean not null default false,
  text text,
  is_voice boolean not null default false,
  duration text,
  sent_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id text primary key,
  code text not null unique,
  discount_percent integer not null check (discount_percent between 1 and 100),
  active boolean not null default true,
  expiry_date timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id text primary key,
  title text not null,
  message text not null,
  target text not null default 'all',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.system_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  details text,
  level text not null default 'info' check (level in ('info', 'warn', 'error')),
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists chat_messages_chat_id_idx on public.chat_messages(chat_id);
create index if not exists system_logs_created_at_idx on public.system_logs(created_at desc);

-- Sample admin/customer accounts.
-- Password for these demo accounts is: admin123
insert into public.users (id, name, email, password_hash, phone_number, role, is_verified)
values
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@youshop.local', '$2a$10$rLeDdYRoUWGcH4UZYHliHOeeF5fkaLqYVIQz/kjnyh5BiVe1Ltvya', '09000000000', 'admin', true),
  ('00000000-0000-0000-0000-000000000002', 'Usman Hashim', 'usman@example.com', '$2a$10$rLeDdYRoUWGcH4UZYHliHOeeF5fkaLqYVIQz/kjnyh5BiVe1Ltvya', '09044922410', 'user', true),
  ('00000000-0000-0000-0000-000000000003', 'Amina Yusuf', 'amina@example.com', '$2a$10$rLeDdYRoUWGcH4UZYHliHOeeF5fkaLqYVIQz/kjnyh5BiVe1Ltvya', '09045550123', 'user', true),
  ('00000000-0000-0000-0000-000000000004', 'Karim Foods', 'vendor@example.com', '$2a$10$rLeDdYRoUWGcH4UZYHliHOeeF5fkaLqYVIQz/kjnyh5BiVe1Ltvya', '09041112233', 'vendor', true)
on conflict (id) do nothing;

insert into public.categories (id, name, description)
values
  ('cat-food', 'Food', 'Gourmet foods and local dishes'),
  ('cat-drinks', 'Drinks', 'Beverages, juices and zobos'),
  ('cat-electronics', 'Electronics', 'Gadgets and accessories'),
  ('cat-clothing', 'Clothing', 'Apparel and fashion')
on conflict (id) do nothing;

insert into public.products (id, name, description, price, stock, sku, category, image_url, images, vendor_id)
values
  ('product-suya', 'SUYA', 'Spicy grilled skewered chicken seasoned with yaji pepper.', 2500, 18, 'SUYA-001', 'Food', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', array['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'], '00000000-0000-0000-0000-000000000004'),
  ('product-zobo', 'CHILLED ZOBO', 'Refreshing hibiscus drink brewed with ginger and cloves.', 500, 42, 'ZOBO-001', 'Drinks', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800', array['https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800'], '00000000-0000-0000-0000-000000000004'),
  ('product-tuwon', 'TUWON SHINKAFA', 'A traditional Nigerian rice dish with a smooth, satisfying texture.', 2000, 9, 'TUWON-001', 'Food', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800', array['https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800'], '00000000-0000-0000-0000-000000000004'),
  ('product-masa', 'MASA', 'Soft traditional Nigerian rice cakes served with a spicy sauce.', 2000, 0, 'MASA-001', 'Food', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', array['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'], '00000000-0000-0000-0000-000000000004')
on conflict (id) do nothing;

insert into public.orders (id, user_id, customer_name, customer_email, customer_phone, shipping_address, payment_method, items, total_price, status, order_number, timeline)
values
  ('order-demo-001', '00000000-0000-0000-0000-000000000002', 'Usman Hashim', 'usman@example.com', '09044922410', 'Kano, Nigeria', 'Cash on Delivery', '[{"productId":"product-suya","name":"SUYA","price":2500,"quantity":1,"imageUrl":"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"}]'::jsonb, 2500, 'processing', 'YS-10001', '[{"status":"placed","label":"Order placed"},{"status":"processing","label":"Preparing order"}]'::jsonb),
  ('order-demo-002', '00000000-0000-0000-0000-000000000003', 'Amina Yusuf', 'amina@example.com', '09045550123', 'Kaduna, Nigeria', 'Card', '[{"productId":"product-zobo","name":"CHILLED ZOBO","price":500,"quantity":2,"imageUrl":"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800"}]'::jsonb, 1000, 'delivered', 'YS-10002', '[{"status":"placed","label":"Order placed"},{"status":"delivered","label":"Delivered"}]'::jsonb)
on conflict (id) do nothing;

insert into public.chats (id, name, avatar_color, last_message, unread, participants)
values
  ('chat-demo-001', 'Tasty Bites Restaurant', '#1B8A78', 'Your order is ready for dispatch.', 2, array['00000000-0000-0000-0000-000000000002']),
  ('chat-demo-002', 'Amina Yusuf', '#E86A4A', 'Thank you, I received my order.', 0, array['00000000-0000-0000-0000-000000000003'])
on conflict (id) do nothing;

insert into public.chat_messages (chat_id, from_me, text)
values
  ('chat-demo-001', true, 'Hello, can you confirm the order status?'),
  ('chat-demo-001', false, 'Your order is ready for dispatch.'),
  ('chat-demo-002', false, 'Thank you, I received my order.');

insert into public.coupons (id, code, discount_percent, active, expiry_date)
values
  ('coupon-welcome10', 'WELCOME10', 10, true, now() + interval '90 days'),
  ('coupon-food20', 'FOOD20', 20, true, now() + interval '30 days'),
  ('coupon-old', 'OLD25', 25, false, now() - interval '10 days')
on conflict (id) do nothing;

insert into public.notifications (id, title, message, target, read)
values
  ('notification-launch', 'Welcome to YouShop', 'Your store command center is ready.', 'all', true),
  ('notification-stock', 'Stock reminder', 'SUYA and ZOBO are performing well this week.', 'admins', false)
on conflict (id) do nothing;

insert into public.system_logs (action, details, level)
values
  ('SYSTEM_READY', 'Supabase seed data initialized', 'info'),
  ('CREATE_PRODUCT', 'Created product: SUYA', 'info'),
  ('ORDER_ALERT', 'Order YS-10001 requires fulfillment', 'warn');

-- Optional development-only policies.
-- Keep these disabled for production if the backend uses the service-role key.
-- alter table public.products enable row level security;
-- create policy "public can read products" on public.products for select using (true);
