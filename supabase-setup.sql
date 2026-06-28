create table if not exists public.foods (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  description text not null default '',
  image text not null default '',
  badge text not null default 'SELLER',
  seller_phone text not null,
  status text not null default 'available' check (status in ('available', 'sold-out', 'expired')),
  deleted boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.foods enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.foods to anon, authenticated;

drop policy if exists "Public can read visible foods" on public.foods;
create policy "Public can read visible foods"
on public.foods
for select
to anon, authenticated
using (true);

drop policy if exists "Public can add seller foods" on public.foods;
create policy "Public can add seller foods"
on public.foods
for insert
to anon, authenticated
with check (deleted = false);

drop policy if exists "Public can update food status" on public.foods;
create policy "Public can update food status"
on public.foods
for update
to anon, authenticated
using (true)
with check (true);

insert into public.foods (id, name, category, price, description, image, badge, seller_phone, status)
values
  ('classic-zinger', 'Classic Zinger', 'Burger', 8.00, 'Crispy chicken burger with lettuce, mayo and soft bun.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', 'POPULAR', '60176354253', 'available'),
  ('creamy-zinger', 'Creamy Zinger', 'Burger', 9.00, 'Chicken burger with creamy sauce, cheese and fresh vegetables.', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80', 'HOT', '60176354253', 'available'),
  ('nasi-lemak-ayam', 'Nasi Lemak Ayam', 'Nasi', 7.50, 'Nasi lemak with fried chicken, sambal, cucumber and egg.', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80', 'POPULAR', '60176354253', 'available'),
  ('carbonara-pasta', 'Creamy Carbonara', 'Pasta', 10.00, 'Creamy pasta with chicken slices and mushroom sauce.', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80', 'NEW', '60176354253', 'available'),
  ('fried-rice', 'Nasi Goreng Kampus', 'Nasi', 6.50, 'Spicy fried rice with egg, chicken and vegetables.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80', 'SAVE', '60176354253', 'available'),
  ('iced-tea', 'Teh Ais Kaw', 'Minuman', 2.50, 'Cold milk tea, suitable for lunch break.', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80', 'COOL', '60176354253', 'available'),
  ('choco-muffin', 'Chocolate Muffin', 'Kuih', 3.00, 'Soft chocolate muffin baked fresh for students.', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80', 'NEW', '60176354253', 'available'),
  ('fries-box', 'Cheesy Fries Box', 'Snack', 5.00, 'Crispy fries with cheese sauce and spicy seasoning.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80', 'HOT', '60176354253', 'available')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can upload food images" on storage.objects;
create policy "Public can upload food images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'food-images');

drop policy if exists "Public can read food images" on storage.objects;
create policy "Public can read food images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'food-images');
