. Now I need to explain how to run the CLI. The user should:
1. Build it: npm run build
2. Run it globally: npm link (makes kvasar command available)
3. Or run directly: node dist/index.js <command>
4. Login first before using: kvasar login
5. Set environment variables for auth if needed
I'll provide clear instructions.
</think>
To run:
# Build
npm run build
# Install globally (makes `kvasar` command available)
npm link
# Or run directly
node dist/index.js <command>
Before using, login:
kvasar login
Set env vars if needed:
export AUTH0_DOMAIN=https://your-tenant.auth0.com
export AUTH0_CLIENT_ID=your_client_id
export AUTH0_AUDIENCE=https://api.kvasar.tech
export KVASAR_API_URL=https://api.kvasar.tech
The API base URL is now https://api.kvasar.tech by default.