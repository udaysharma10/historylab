-- Free-tier revision (decision 2026-07-12, Neha + Uday): Chapter 1 is no
-- longer free — Section 1 is the free in-chapter preview; the rest of Ch1 is
-- a ₹199 product like Ch2. NO grandfathering of pilot accounts (clean
-- conversion data). Supersedes decision "Free = Chapter 1" in plan §0.

alter table products add column if not exists preview_section text;

update products
set is_free = false,
    price_paise = 19900,
    list_price_paise = 49900,
    preview_section = 's1',
    name = 'Chapter 1 — The Rise of Nationalism in Europe'
where id = 'c10-hist-ch1';

-- Admins bypass entitlements (they had no ch1 rows since ch1 was free-tier).
create or replace function has_access(p_user uuid, p_chapter text)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from products where id = p_chapter and is_free and active)
      or exists (select 1 from entitlements where user_id = p_user and chapter_id = p_chapter)
      or exists (select 1 from admins where user_id = p_user)
$$;
