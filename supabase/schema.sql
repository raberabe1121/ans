create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text not null,
  description text,
  url text,
  category text not null check (category in ('agent', 'vibe', 'oss', 'tool', 'unknown')),
  tags text[] default '{}',
  maker_x_id text not null,
  maker_x_username text not null,
  maker_x_name text,
  maker_x_avatar text,
  vote_count integer default 0,
  post_count integer default 1,
  first_posted_at timestamptz,
  last_posted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists x_posts (
  id uuid primary key default gen_random_uuid(),
  post_id text unique not null,
  product_id uuid references products(id) on delete cascade,
  content text not null,
  author_x_id text not null,
  author_x_username text not null,
  media_urls text[] default '{}',
  likes integer default 0,
  retweets integer default 0,
  posted_at timestamptz not null,
  collected_at timestamptz default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(product_id, user_id)
);

create table if not exists collect_logs (
  id uuid primary key default gen_random_uuid(),
  posts_found integer default 0,
  products_created integer default 0,
  products_updated integer default 0,
  error text,
  collected_at timestamptz default now()
);

alter table products enable row level security;
alter table x_posts enable row level security;
alter table votes enable row level security;

create policy "products_select" on products for select using (true);
create policy "x_posts_select" on x_posts for select using (true);
create policy "votes_insert" on votes for insert with check (auth.uid() = user_id);
create policy "votes_select" on votes for select using (true);

create index if not exists products_vote_count_idx on products (vote_count desc);
create index if not exists products_last_posted_at_idx on products (last_posted_at desc);
create index if not exists products_created_at_idx on products (created_at desc);
create index if not exists x_posts_product_id_posted_at_idx on x_posts (product_id, posted_at desc);
