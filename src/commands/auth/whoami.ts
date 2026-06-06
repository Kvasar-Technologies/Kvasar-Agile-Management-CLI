import { Command } from 'commander';
import { authService } from '../../core/auth.js';

export interface WhoAmIResult {
	success: boolean;
	user?: any;
	message?: string;
}

/**
 * Execute whoami operation (used by both CLI and MCP)
 */
export async function executeWhoami(): Promise<WhoAmIResult> {
	try {
		// Reuse the shared auth validation path so whoami respects the
		// same token validity rules as other authenticated commands.
		await authService.getAccessToken();
	} catch (error: any) {
		return {
			success: false,
			message: 'Not authenticated. Run `kvasar login` first.',
		};
	}

	const user = await authService.whoami();
	if (!user) {
		return {
			success: false,
			message: 'Not authenticated. Run `kvasar login` first.',
		};
	}

	return {
		success: true,
		user,
	};
}

export const whoamiCommand = new Command('whoami')
	.description('Display information about the currently authenticated user')
	.option('--json', 'Output in JSON format')
	.action(async (options) => {
		try {
			const result = await executeWhoami();
			if (!result.success) {
				throw new Error(result.message);
			}
			const user = result.user!;
			if (options.json) {
				console.log(JSON.stringify(user, null, 2));
			} else {
				console.log('Authenticated as:');
				if (user.name) {
					console.log(` Name: ${user.name}`);
				}
				if (user.email) {
					console.log(` Email: ${user.email}`);
				}
				if (user.sub) {
					console.log(` User ID: ${user.sub}`);
				}
				// Check for organization info from Kvasar custom claim
				const orgId = user['https://api.kvasar.io/org_id'];
				if (orgId) {
					console.log(` Organization: ${orgId}`);
				}
			}
		} catch (error: any) {
			console.error('Error:', error.message);
			process.exit(1);
		}
	});
