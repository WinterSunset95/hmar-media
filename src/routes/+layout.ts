import { account } from "$lib/appwrite"
import { redirect } from "@sveltejs/kit"
import { auth } from "$lib/stores/auth.svelte";

export const ssr = false;

let isAppBooted = false;

export const load = async ({ url }) => {
  let currentUser = auth.user;

  if (!isAppBooted || !currentUser) {
    console.time("[Auth] Network Ping")
    try {
      currentUser = await account.get()
    } catch {
      currentUser = null
    }
    console.timeEnd("[Auth] Network Ping")
    isAppBooted = true;
  }

  const isAuthRoute = url.pathname.startsWith('/auth');

  if (!currentUser && !isAuthRoute) {
    throw redirect(307, '/auth')
  }

  if (currentUser && isAuthRoute) {
    throw redirect(307, '/home')
  }

  if (currentUser && url.pathname === '/') {
    throw redirect(307, '/home')
  }

  return {
    account: currentUser
  }
  
}
