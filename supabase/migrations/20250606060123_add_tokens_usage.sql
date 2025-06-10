ALTER TABLE public.profiles_private
ADD COLUMN tokens_used_month bigint DEFAULT 0,
ADD COLUMN tokens_used_total bigint DEFAULT 0,
ADD COLUMN tokens_last_reset timestamptz DEFAULT now();
