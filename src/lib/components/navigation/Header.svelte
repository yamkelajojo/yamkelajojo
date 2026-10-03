<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { getFeaturedProjects } from '$lib/data/projects';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { currentPath = '/' }: { currentPath?: string } = $props();

	let mobileMenuOpen = $state(false);
	let commandOpen = $state(false);
	let commandQuery = $state('');
	let isDark = $state(false);

	const PRIMARY_NAV = [
		{ label: 'Home', href: '/' },
		{ label: 'Work', href: '/work' },
		{ label: 'About', href: '/about' },
		{ label: 'Experience', href: '/experience' },
		{ label: 'GitHub', href: '/github' },
		{ label: 'CV', href: '/cv' },
		{ label: 'Contact', href: '/contact' }
	];

	const QUICK_JUMP_ITEMS = [
		...PRIMARY_NAV.map((item) => ({
			title: item.label,
			subtitle: `Navigate to ${item.label}`,
			href: item.href,
			category: 'Pages'
		})),
		{
			title: 'Labs & Engineering Experiments',
			subtitle: 'Technical notes on GitHub normalizers, PostGIS, NLP, and security labs',
			href: '/labs',
			category: 'Pages'
		},
		...getFeaturedProjects().map((project) => ({
			title: project.title,
			subtitle: project.subtitle,
			href: `/work/${project.slug}`,
			category: 'Case Studies'
		}))
	];

	const filteredQuickJump = $derived.by(() => {
		const q = commandQuery.trim().toLowerCase();
		if (!q) return QUICK_JUMP_ITEMS;
		return QUICK_JUMP_ITEMS.filter(
			(item) =>
				item.title.toLowerCase().includes(q) ||
				item.subtitle.toLowerCase().includes(q) ||
				item.category.toLowerCase().includes(q)
		);
	});

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function toggleTheme() {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		const nextDark = !root.classList.contains('theme-dark');
		root.classList.remove('theme-light', 'theme-dark');
		root.classList.add(nextDark ? 'theme-dark' : 'theme-light');
		root.setAttribute('data-theme', nextDark ? 'dark' : 'light');
		isDark = nextDark;
		try {
			localStorage.setItem('yj-theme', nextDark ? 'dark' : 'light');
		} catch {
			// ignore storage restrictions
		}
	}

	function handleGlobalKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			commandOpen = !commandOpen;
		}
	}

	$effect(() => {
		if (typeof document !== 'undefined') {
			isDark = document.documentElement.classList.contains('theme-dark');
		}
	});
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<header
	class="sticky top-0 z-40 border-b backdrop-blur-md"
	style="background-color: color-mix(in srgb, var(--bg-canvas) 90%, transparent); border-color: var(--border-subtle);"
>
	<div class="editorial-container flex h-16 items-center justify-between gap-4">
		<!-- Brand Identity -->
		<a
			href="/"
			class="group inline-flex items-center gap-3 text-sm font-semibold tracking-tight"
			aria-label="Yamkela Jojo — Home"
		>
			<span
				class="inline-flex h-8 w-8 items-center justify-center rounded border text-xs font-bold transition-colors"
				style="font-family: var(--font-mono); background-color: var(--text-primary); color: var(--bg-canvas); border-color: var(--text-primary);"
			>
				YJ
			</span>
			<span class="flex flex-col leading-tight">
				<span class="font-semibold" style="color: var(--text-primary);">Yamkela Jojo</span>
				<span
					class="text-[11px]"
					style="font-family: var(--font-mono); color: var(--text-muted);"
				>
					Full-Stack &amp; Software Dev
				</span>
			</span>
		</a>

		<!-- Desktop Navigation -->
		<nav aria-label="Primary" class="hidden lg:flex lg:items-center lg:gap-1">
			{#each PRIMARY_NAV as item (item.href)}
				{@const active = isActive(item.href, currentPath)}
				<a
					href={item.href}
					aria-current={active ? 'page' : undefined}
					class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
					style={active
						? 'background-color: var(--accent-soft); color: var(--accent-primary); font-weight: 600;'
						: 'color: var(--text-secondary);'}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Action Controls (Quick Jump, CV Download, Theme, Mobile Trigger) -->
		<div class="flex items-center gap-2">
			<!-- Bits UI Quick-Jump Command Dialog -->
			<Dialog.Root bind:open={commandOpen}>
				<Dialog.Trigger
					class="inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors"
					style="border-color: var(--border-subtle); background-color: var(--bg-surface); color: var(--text-secondary); font-family: var(--font-mono);"
					aria-label="Open quick navigation dialog"
				>
					<Icon name="search" size={14} />
					<span class="hidden sm:inline">Quick Jump</span>
					<kbd
						class="hidden rounded border px-1 py-0.5 text-[10px] sm:inline-block"
						style="border-color: var(--border-subtle); color: var(--text-muted);"
					>
						⌘K
					</kbd>
				</Dialog.Trigger>

				<Dialog.Portal>
					<Dialog.Overlay
						class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
					/>
					<Dialog.Content
						class="fixed top-[14%] left-1/2 z-50 w-[min(92vw,36rem)] -translate-x-1/2 rounded-lg border p-4 shadow-2xl"
						style="background-color: var(--bg-surface); border-color: var(--border-strong); color: var(--text-primary);"
					>
						<div class="flex items-center justify-between border-b pb-3" style="border-color: var(--border-subtle);">
							<Dialog.Title class="text-sm font-semibold">
								Quick Navigation &amp; Case Study Index
							</Dialog.Title>
							<Dialog.Close
								class="inline-flex h-7 w-7 items-center justify-center rounded border text-xs"
								style="border-color: var(--border-subtle); color: var(--text-muted);"
								aria-label="Close quick navigation"
							>
								<Icon name="close" size={14} />
							</Dialog.Close>
						</div>

						<Dialog.Description class="sr-only">
							Search routes and featured engineering case studies across Yamkela Jojo’s portfolio.
						</Dialog.Description>

						<div class="mt-3">
							<label for="quick-jump-input" class="sr-only">Filter pages or projects</label>
							<input
								id="quick-jump-input"
								type="search"
								bind:value={commandQuery}
								placeholder="Type a page or project name (e.g., GreenBidder, Laravel, GitHub, CV)..."
								class="w-full rounded-md border px-3 py-2 text-sm"
								style="background-color: var(--bg-canvas); border-color: var(--border-subtle); color: var(--text-primary);"
							/>
						</div>

						<ul class="mt-3 max-h-72 divide-y overflow-y-auto" style="border-color: var(--border-subtle);">
							{#each filteredQuickJump as entry (entry.href)}
								<li>
									<a
										href={entry.href}
										onclick={() => {
											commandOpen = false;
											commandQuery = '';
										}}
										class="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:opacity-90"
									>
										<div>
											<p class="text-sm font-medium" style="color: var(--text-primary);">
												{entry.title}
											</p>
											<p class="text-xs" style="color: var(--text-muted);">
												{entry.subtitle}
											</p>
										</div>
										<span
											class="shrink-0 rounded border px-1.5 py-0.5 text-[10px]"
											style="font-family: var(--font-mono); border-color: var(--border-subtle); color: var(--text-muted);"
										>
											{entry.category}
										</span>
									</a>
								</li>
							{:else}
								<li class="py-6 text-center text-sm" style="color: var(--text-muted);">
									No matching pages or case studies found.
								</li>
							{/each}
						</ul>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>

			<!-- Direct CV PDF Download Button on Desktop -->
			<a
				href="/resume/yamkela-jojo-cv.pdf"
				download="Yamkela-Jojo-CV.pdf"
				class="hidden items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors sm:inline-flex"
				style="border-color: var(--accent-primary); background-color: var(--accent-primary); color: #ffffff; font-family: var(--font-mono);"
			>
				<Icon name="download" size={14} />
				<span>Download CV</span>
			</a>

			<!-- Theme Toggle -->
			<button
				type="button"
				onclick={toggleTheme}
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
				style="border-color: var(--border-subtle); background-color: var(--bg-surface); color: var(--text-secondary);"
				aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
				title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
			>
				{#if isDark}
					<Icon name="sun" size={16} />
				{:else}
					<Icon name="moon" size={16} />
				{/if}
			</button>

			<!-- Bits UI Mobile Navigation Drawer -->
			<div class="lg:hidden">
				<Dialog.Root bind:open={mobileMenuOpen}>
					<Dialog.Trigger
						class="inline-flex h-9 w-9 items-center justify-center rounded-md border"
						style="border-color: var(--border-subtle); background-color: var(--bg-surface); color: var(--text-primary);"
						aria-label="Open navigation menu"
					>
						<Icon name="menu" size={18} />
					</Dialog.Trigger>

					<Dialog.Portal>
						<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />
						<Dialog.Content
							class="fixed top-0 right-0 z-50 flex h-full w-[min(86vw,22rem)] flex-col justify-between border-l p-6 shadow-2xl"
							style="background-color: var(--bg-canvas); border-color: var(--border-strong); color: var(--text-primary);"
						>
							<div>
								<div class="flex items-center justify-between border-b pb-4" style="border-color: var(--border-subtle);">
									<Dialog.Title class="text-sm font-semibold">
										Site Navigation
									</Dialog.Title>
									<Dialog.Close
										class="inline-flex h-8 w-8 items-center justify-center rounded-md border"
										style="border-color: var(--border-subtle); color: var(--text-secondary);"
										aria-label="Close navigation menu"
									>
										<Icon name="close" size={16} />
									</Dialog.Close>
								</div>

								<Dialog.Description class="sr-only">
									Primary navigation links for Yamkela Jojo’s portfolio.
								</Dialog.Description>

								<nav aria-label="Mobile Primary" class="mt-4 flex flex-col gap-1">
									{#each PRIMARY_NAV as item (item.href)}
										{@const active = isActive(item.href, currentPath)}
										<a
											href={item.href}
											aria-current={active ? 'page' : undefined}
											onclick={() => {
												mobileMenuOpen = false;
											}}
											class="flex items-center justify-between rounded-md px-3 py-2.5 text-base font-medium"
											style={active
												? 'background-color: var(--accent-soft); color: var(--accent-primary); font-weight: 600;'
												: 'color: var(--text-primary);'}
										>
											<span>{item.label}</span>
											<Icon name="arrow-right" size={15} />
										</a>
									{/each}
									<a
										href="/labs"
										onclick={() => {
											mobileMenuOpen = false;
										}}
										class="mt-2 flex items-center justify-between rounded-md border px-3 py-2 text-sm"
										style="border-color: var(--border-subtle); color: var(--text-secondary); font-family: var(--font-mono);"
									>
										<span>/Labs (Technical Notes)</span>
										<Icon name="terminal" size={14} />
									</a>
								</nav>
							</div>

							<div class="border-t pt-4" style="border-color: var(--border-subtle);">
								<a
									href="/resume/yamkela-jojo-cv.pdf"
									download="Yamkela-Jojo-CV.pdf"
									class="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold"
									style="background-color: var(--accent-primary); color: #ffffff;"
								>
									<Icon name="download" size={16} />
									<span>Download CV (PDF)</span>
								</a>
							</div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</div>
		</div>
	</div>
</header>
