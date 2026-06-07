import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  const { account } = await parent();
  if (!account) {
    throw redirect(303, '/auth')
  }
}
