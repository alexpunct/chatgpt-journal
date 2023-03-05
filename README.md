# Chat Journal (ChatGPT + Your journal/diary)

This is the opensource application that powers [`ChatJournal.Ai`](https://www.chatjournal.ai). It's an app that allows users to store their journal/diary entries and chat with ChatGPT using the journal as context. The users can choose among a few different agents to chat to.

The application is built using:

- [Svelte](https://github.com/sveltejs/svelte) and [Sveltekit](https://github.com/sveltejs/kit)
- [SkeletonUI](https://github.com/skeletonlabs/skeleton) and [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) (a big part of the UI layout is based on their Docs website)
- [Supabase](https://github.com/supabase/supabase-js)
- The ChatGPT interactions are built using Supabase edge functions which you can find in the `supabase_functions` folder in this repo (you need to [deploy them yourself](https://github.com/supabase/supabase/tree/master/examples/edge-functions))

# Setup Dev environment

- Sign up to Supabase or setup it locally using the Docker containers (use the migrations in the `supabase` folder)
- Add the environment variables (see the `.env.local.example` file)
- Start the app (`npm run dev`)

# Deployment to production

Currently, chatjournal.ai is deployed to Vercel using their Sveltekit recipe for building the app.

# Community

Contributions are welcome!

# Discord

[Join the Discord here](https://discord.gg/REYCS3HuM4)
