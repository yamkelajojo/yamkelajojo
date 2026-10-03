// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			githubDataStatus?: 503;
		}
		interface PageData {
			siteOrigin: string;
		}
		// interface PageState {}
		interface Platform {
			env?: Record<string, unknown>;
		}
	}
}

export {};
