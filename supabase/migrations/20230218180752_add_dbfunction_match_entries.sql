drop function if exists match_documents;

create or replace function match_entries (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  user_id uuid,
  entry_day date,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    journal.id as id,
    journal.user_id as user_id,
    journal.day as entry_day,
    journal.content as content,
    1 - (journal.embedding <=> query_embedding) as similarity
  from journal
  where 1 - (journal.embedding <=> query_embedding) > similarity_threshold
  order by journal.embedding <=> query_embedding
  limit match_count;
end;
$$;

create index on journal 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
