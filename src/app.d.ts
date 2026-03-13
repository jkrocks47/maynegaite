import type { SessionUser, MemberUser } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			user: SessionUser | null;
			member: MemberUser | null;
		}
	}
}

export {};
