// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import 'xhr_polyfill'
import { serve } from 'std/server'
import { Configuration, OpenAIApi } from 'openai'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "create-embeddings-for-all" up and running!`)

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const { customOpenAiKey } = await req.json()

    const configuration = new Configuration({ apiKey: customOpenAiKey || Deno.env.get('OPENAI_API_KEY') })
    const openAi = new OpenAIApi(configuration)

    const responseData: { data: number[]; error: string } = {
      data: [],
      error: '',
    }

    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.from('journal').select('id, content, embedding').is('embedding', null)
    if (error) throw error

    if (data && data.length > 0) {
      await Promise.all(
        data.map(async (entry) => {
          const input = entry.content?.replace(/\n/g, ' ')
          if (!input || entry.embedding) return
          const embeddingResponse = await openAi.createEmbedding({ model: 'text-embedding-ada-002', input })

          const [{ embedding }] = embeddingResponse.data.data

          if (!embedding) throw new Error('Could not generate embedding for ' + entry.id)
          const { data: updatedData, error: updateError } = await supabaseClient
            .from('journal')
            .update({ embedding })
            .eq('id', entry.id)
          if (updateError) throw updateError
          responseData.data.push(entry?.id)
        })
      )
    } else {
      responseData.error = 'No empty embeddings found'
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.search('401') > 0 ? 401 : 500,
    })
  }
})
