-- ============================================================
-- HARMONY Shapewear — Supabase Database Schema (Normalized)
-- Run this in Supabase SQL Editor → New Query → Run All
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  first_name    text not null,
  last_name     text not null,
  phone         text,
  password_hash text not null,
  points        integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ADDRESSES  (one user → many addresses)
-- ============================================================
create table if not exists addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  label      text not null,
  first_name text not null,
  last_name  text not null,
  address    text not null,
  city       text not null,
  district   text,
  zip_code   text,
  country    text not null default 'Türkiye',
  is_default boolean not null default false
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name_tr        text not null,
  name_en        text not null,
  description_tr text not null,
  description_en text not null,
  price          numeric(10,2) not null,
  sale_price     numeric(10,2),
  images         text[] not null default '{}',
  category       text not null check (category in ('bodysuits','shapewear','bras','briefs','sets')),
  sizes          text[] not null default '{}',
  material_tr    text,
  material_en    text,
  care_tr        text,
  care_en        text,
  is_new         boolean not null default false,
  is_featured    boolean not null default false,
  is_bestseller  boolean not null default false,
  tags           text[] not null default '{}',
  sku            text unique not null,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- PRODUCT COLORS  (one product → many colors)
-- ============================================================
create table if not exists product_colors (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name       text not null,
  hex        text not null,
  label_tr   text not null,
  label_en   text not null,
  unique (product_id, name)
);

-- ============================================================
-- PRODUCT STOCK  (one product + size + color → quantity)
-- ============================================================
create table if not exists product_stock (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size       text not null,
  color_name text not null,
  quantity   integer not null default 0 check (quantity >= 0),
  unique (product_id, size, color_name)
);

-- ============================================================
-- DISCOUNTS
-- ============================================================
create table if not exists discounts (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  type        text not null check (type in ('percentage','fixed')),
  value       numeric(10,2) not null,
  min_order   numeric(10,2),
  max_uses    integer,
  used_count  integer not null default 0,
  expiry_date date,
  is_active   boolean not null default true
);

-- ============================================================
-- BANNERS
-- ============================================================
create table if not exists banners (
  id             uuid primary key default gen_random_uuid(),
  title_tr       text not null,
  title_en       text not null,
  subtitle_tr    text not null,
  subtitle_en    text not null,
  image          text not null,
  image_mobile   text,
  link           text,
  button_text_tr text,
  button_text_en text,
  sort_order     integer not null default 0,
  is_active      boolean not null default true
);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  display_id       text unique not null,
  user_id          uuid references users(id) on delete set null,
  -- customer snapshot (denormalised so guest orders are self-contained)
  customer_first_name text not null,
  customer_last_name  text not null,
  customer_email      text not null,
  customer_phone      text not null,
  -- address snapshots
  shipping_first_name text not null,
  shipping_last_name  text not null,
  shipping_address    text not null,
  shipping_city       text not null,
  shipping_district   text,
  shipping_zip        text,
  shipping_country    text not null default 'Türkiye',
  billing_first_name  text not null,
  billing_last_name   text not null,
  billing_address     text not null,
  billing_city        text not null,
  billing_district    text,
  billing_zip         text,
  billing_country     text not null default 'Türkiye',
  -- totals
  subtotal         numeric(10,2) not null,
  shipping_cost    numeric(10,2) not null default 0,
  discount         numeric(10,2) not null default 0,
  total            numeric(10,2) not null,
  discount_code    text,
  status           text not null default 'pending'
                     check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  payment_id       text,
  tracking_number  text,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- ORDER ITEMS  (one order → many line items)
-- ============================================================
create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  -- snapshot fields (product may change after order)
  product_name_tr text not null,
  product_name_en text not null,
  product_sku     text not null,
  product_image   text,
  size            text not null,
  color_name      text not null,
  color_hex       text not null,
  unit_price      numeric(10,2) not null,
  quantity        integer not null check (quantity > 0)
);

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  user_name  text not null,
  order_id   uuid references orders(id) on delete set null,
  rating     integer not null check (rating between 1 and 5),
  comment    text not null,
  status     text not null default 'pending'
               check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  unique (product_id, user_id, order_id)
);

-- ============================================================
-- STOCK NOTIFICATIONS
-- ============================================================
create table if not exists stock_notifications (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  product_name text not null,
  size         text not null,
  color_name   text not null,
  color_hex    text not null,
  email        text not null,
  created_at   timestamptz not null default now(),
  unique (product_id, size, color_name, email)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_addresses_user_id           on addresses(user_id);
create index if not exists idx_product_colors_product_id   on product_colors(product_id);
create index if not exists idx_product_stock_product_id    on product_stock(product_id);
create index if not exists idx_orders_user_id              on orders(user_id);
create index if not exists idx_orders_status               on orders(status);
create index if not exists idx_orders_created_at           on orders(created_at desc);
create index if not exists idx_order_items_order_id        on order_items(order_id);
create index if not exists idx_order_items_product_id      on order_items(product_id);
create index if not exists idx_reviews_product_id          on reviews(product_id);
create index if not exists idx_reviews_status              on reviews(status);
create index if not exists idx_stock_notifications_product on stock_notifications(product_id);
create index if not exists idx_products_slug               on products(slug);
create index if not exists idx_products_category           on products(category);

-- ============================================================
-- ROW LEVEL SECURITY
-- All tables locked down; server-side service_role bypasses RLS.
-- Add user-scoped policies here when you integrate Supabase Auth.
-- ============================================================
alter table users               enable row level security;
alter table addresses           enable row level security;
alter table products            enable row level security;
alter table product_colors      enable row level security;
alter table product_stock       enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;
alter table banners             enable row level security;
alter table discounts           enable row level security;
alter table reviews             enable row level security;
alter table stock_notifications enable row level security;

-- Public read policies (storefront)
create policy "public can read products"            on products       for select using (true);
create policy "public can read product_colors"      on product_colors for select using (true);
create policy "public can read product_stock"       on product_stock  for select using (true);
create policy "public can read active banners"      on banners        for select using (is_active = true);
create policy "public can read approved reviews"    on reviews        for select using (status = 'approved');

-- All other writes go through the server via service_role key (bypasses RLS)
