import { account } from "$lib/appwrite";
import { ID } from "appwrite";
import type { Models } from "appwrite";

class AuthState {
  user = $state<Models.User<Models.Preferences> | null>(null);

  async check() {
    try {
      this.user = await account.get()
    } catch {
      this.user = null
    }
    return this.user
  }

  async login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password)
    await this.check()
  }

  async register(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name)
    await this.login(email, password)
  }

  async logout() {
    try {
      await account.deleteSession('current')
    } catch {
      alert("Error logging out. Please contact the administrator.")
    } finally {
      this.user = null
    }
  }
}

export const auth = new AuthState();

