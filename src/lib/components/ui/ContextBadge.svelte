<script lang="ts">
	import { getSkillContextMeta } from '$lib/data/skills';
	import type { ExperienceType, SkillContext } from '$lib/types';

	let {
		context,
		experienceType,
		compact = false
	}: {
		context?: SkillContext;
		experienceType?: ExperienceType;
		compact?: boolean;
	} = $props();

	const badgeInfo = $derived.by(() => {
		if (experienceType) {
			if (experienceType === 'professional') {
				return {
					label: 'Professional Employment',
					className: 'badge-pro',
					title: 'Paid full-stack web engineering employment'
				};
			}
			if (experienceType === 'training') {
				return {
					label: 'Structured Training / Learnership',
					className: 'badge-training',
					title: 'Full-time structured technical training and applied learnership'
				};
			}
			return {
				label: 'Apprenticeship',
				className: 'badge-handson',
				title: 'Early-career web development apprenticeship'
			};
		}

		const resolvedContext = context ?? 'hands-on';
		const meta = getSkillContextMeta(resolvedContext);
		const classMap: Record<SkillContext, string> = {
			professional: 'badge-pro',
			'hands-on': 'badge-handson',
			training: 'badge-training',
			learning: 'badge-learning',
			exploring: 'badge-exploring'
		};

		return {
			label: compact ? meta.shortLabel : meta.label,
			className: classMap[resolvedContext],
			title: meta.description
		};
	});
</script>

<span
	class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium tracking-tight {badgeInfo.className}"
	style="font-family: var(--font-mono);"
	title={badgeInfo.title}
>
	{badgeInfo.label}
</span>
