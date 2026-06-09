import { account } from "$lib/appwrite"
import { redirect } from "@sveltejs/kit"

export const ssr = false;

export const load = async ({ url }) => {
  let currentUser = null;

  try {
    currentUser = await account.get()
  } catch {
    currentUser = null
  }

  const isAuthRoute = url.pathname.startsWith('/auth');

  if (!currentUser && !isAuthRoute) {
    throw redirect(307, '/auth')
  }

  if (currentUser && isAuthRoute) {
    throw redirect(307, '/home')
  }

  return {
    account: currentUser
  }
  
}
