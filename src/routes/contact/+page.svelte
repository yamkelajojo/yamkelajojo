<script lang="ts">
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<SeoHead
	title="Contact & Professional Links"
	description="Connect with Yamkela Jojo through LinkedIn, GitHub, and a downloadable CV, or validate a message draft before reaching out."
	path="/contact"
/>

<section class="py-section-compact sm:py-section-regular">
	<div class="editorial-container">
		<div class="grid gap-10 lg:grid-cols-12">
			<!-- Left Column: Direct Channels & CV Access -->
			<div class="lg:col-span-5">
				<p class="section-kicker">Direct Channels</p>
				<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--text-primary);">
					Get in Touch
				</h1>
				<p class="mt-3 text-base leading-relaxed" style="color: var(--text-secondary);">
					Whether you are hiring for a full-stack or software engineering role, reviewing project work, or discussing a technical collaboration in Durban or remotely, you can reach me through the verified channels below.
				</p>

				<div class="mt-7 space-y-4">
					{#each data.profile.socialLinks as link (link.id)}
						<a
							href={link.href}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noopener noreferrer' : undefined}
							download={link.id === 'cv' ? 'Yamkela-Jojo-CV.pdf' : undefined}
							class="editorial-card flex items-start justify-between gap-4 p-4 transition-colors"
						>
							<div>
								<p class="text-sm font-semibold" style="color: var(--text-primary);">
									{link.label}
								</p>
								<p class="mt-1 text-xs" style="color: var(--text-secondary);">
									{link.description}
								</p>
							</div>
							<span style="color: var(--accent-primary);">
								{#if link.id === 'cv'}
									<Icon name="download" size={16} />
								{:else}
									<Icon name="arrow-up-right" size={16} />
								{/if}
							</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Right Column: Accessible Contact Message Form -->
			<div class="lg:col-span-7">
				<div class="editorial-card p-6 sm:p-8">
					<p class="section-kicker">Message Draft</p>
					<h2 class="mt-1 text-xl font-bold" style="color: var(--text-primary);">
						Validate a Message Draft
					</h2>
					<p class="mt-1 text-xs" style="color: var(--text-muted);">
						This form validates and sanitizes a draft but does not send or store it. Use LinkedIn or GitHub to get in touch.
					</p>

					{#if form?.success}
						<div
							role="status"
							class="mt-6 rounded-lg border p-5"
							style="border-color: var(--status-pro-border); background-color: var(--status-pro-bg); color: var(--status-pro-text);"
						>
							<p class="text-sm font-bold">
								Your draft passed server-side validation, {form.recipientName}.
							</p>
							<p class="mt-1 text-xs">
								Nothing was sent or stored. Your sanitized draft remains in the form; use LinkedIn or GitHub to contact me.
							</p>
						</div>
					{/if}

					<form method="POST" class="mt-6 space-y-4" novalidate>
						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label for="contact-name" class="block text-xs font-semibold" style="color: var(--text-primary);">
									Your Name <span aria-hidden="true" style="color: var(--accent-primary);">*</span>
								</label>
								<input
									id="contact-name"
									name="name"
									type="text"
									required
									value={form?.values?.name ?? ''}
									aria-invalid={form?.errors?.name ? 'true' : undefined}
									aria-describedby={form?.errors?.name ? 'error-name' : undefined}
									class="mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
									style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
								/>
								{#if form?.errors?.name}
									<p id="error-name" class="mt-1 text-xs" style="color: var(--accent-primary);">
										{form.errors.name}
									</p>
								{/if}
							</div>

							<div>
								<label for="contact-email" class="block text-xs font-semibold" style="color: var(--text-primary);">
									Email Address <span aria-hidden="true" style="color: var(--accent-primary);">*</span>
								</label>
								<input
									id="contact-email"
									name="email"
									type="email"
									required
									value={form?.values?.email ?? ''}
									aria-invalid={form?.errors?.email ? 'true' : undefined}
									aria-describedby={form?.errors?.email ? 'error-email' : undefined}
									class="mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
									style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
								/>
								{#if form?.errors?.email}
									<p id="error-email" class="mt-1 text-xs" style="color: var(--accent-primary);">
										{form.errors.email}
									</p>
								{/if}
							</div>
						</div>

						<div>
							<label for="contact-subject" class="block text-xs font-semibold" style="color: var(--text-primary);">
								Subject <span aria-hidden="true" style="color: var(--accent-primary);">*</span>
							</label>
							<input
								id="contact-subject"
								name="subject"
								type="text"
								required
								value={form?.values?.subject ?? ''}
								aria-invalid={form?.errors?.subject ? 'true' : undefined}
								aria-describedby={form?.errors?.subject ? 'error-subject' : undefined}
								class="mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
								style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
							/>
							{#if form?.errors?.subject}
								<p id="error-subject" class="mt-1 text-xs" style="color: var(--accent-primary);">
									{form.errors.subject}
								</p>
							{/if}
						</div>

						<div>
							<label for="contact-message" class="block text-xs font-semibold" style="color: var(--text-primary);">
								Message <span aria-hidden="true" style="color: var(--accent-primary);">*</span>
							</label>
							<textarea
								id="contact-message"
								name="message"
								rows="5"
								required
								aria-invalid={form?.errors?.message ? 'true' : undefined}
								aria-describedby={form?.errors?.message ? 'error-message' : undefined}
								class="mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
								style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
							>{form?.values?.message ?? ''}</textarea>
							{#if form?.errors?.message}
								<p id="error-message" class="mt-1 text-xs" style="color: var(--accent-primary);">
									{form.errors.message}
								</p>
							{/if}
						</div>

						<button
							type="submit"
							class="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
							style="background-color: var(--accent-primary); color: var(--text-on-accent);"
						>
							<span>Validate Draft</span>
							<Icon name="arrow-right" size={16} />
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
