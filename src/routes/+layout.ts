import { account } from "$lib/appwrite"
export const ssr = false;
export const prerender = true;

export const load  = async () => {
  try {
    return {
      account: await account.get()
    }
  } catch {
    return {
      account: null
    }
  }
}
