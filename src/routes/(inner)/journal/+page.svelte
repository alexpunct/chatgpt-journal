<script lang="ts">
	export let data: {
		journal_alex: {
			content: string;
		}[];
	};

	let { journal_alex } = data;
	$: ({ journal_alex } = data);
</script>

<div>
	<div class="container max-w-[1200px] mx-auto px-4 py-10 md:py-20 space-y-20">
		Hellow. <div>
			<ul>
				{#each journal_alex as entry}
					<li>{entry.content}</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
