<script lang="ts">
	// Standard Shadcn component imports
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
  import { AppwriteException, ID } from 'appwrite';
  import { Eye, EyeOff } from '@lucide/svelte';
  import { auth } from '$lib/stores/auth.svelte';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';

	// We will wire these into Appwrite's auth SDK later
	let email = $state('');
	let fullName = $state('');
	let password = $state('');
  let confirm = $state('');

  let showLoginPassword = $state(false);
  let showSignupPassword = $state(false);
  let showConfirmPassword = $state(false);
	
	let isLoading = $state(false);
  let errorMessage = $state('')

  $effect(() => {
    if (toast !== '' && errorMessage.length > 0) {
      toast(errorMessage)
    }
  })

	const handleLogin = async () => {
    if (!email || !password) {
      errorMessage = "Please fill in all fields"
      return;
    }

		isLoading = true;
    errorMessage = '';

    try {
      await auth.login(email, password)
      goto('/home')
    } catch (error) {
      if (error instanceof AppwriteException) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unexpected error occured."
      }
    } finally {
      isLoading = false;
    }
	};

	const handleSignup = async () => {
    if (!email || !password || !fullName) {
      errorMessage = "Please fill in all fields!"
      return;
    }
    if (password != confirm) {
      errorMessage = "Passwords do not match!"
      return;
    }

		isLoading = true;
    errorMessage = '';

    try {
      await auth.register(email, password, fullName)
      goto('/home')
    } catch (error) {
      if (error instanceof AppwriteException) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unexpected error occured."
      }
    } finally {
      isLoading = false;
    }
	};
</script>

<!-- 
  The inline style provides that specific "Obsidian Cinema" radial glow 
  that originates from the top center of the screen. 
-->
<div
	class="min-h-screen flex flex-col items-center justify-center p-4 antialiased selection:bg-primary selection:text-primary-foreground bg-background"
	style="background-image: radial-gradient(circle at top center, rgba(225, 29, 72, 0.15) 0%, var(--background) 50%);"
>
	<div class="w-full max-w-sm flex flex-col gap-6">
		
		<!-- Brand / Logo Area -->
		<div class="flex flex-col items-center text-center space-y-2 mb-2">
			<div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(225,29,72,0.3)]">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-primary-foreground">
					<path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
				</svg>
			</div>
			<h1 class="text-3xl font-bold tracking-tight">Hmar Media</h1>
			<p class="text-sm text-muted-foreground">Exclusive local cinema, anywhere.</p>
		</div>

		<!-- Main Auth Card -->
		<Card.Root class="border-border shadow-xl overflow-hidden bg-background">
			<Tabs.Root value="login" class="w-full">
				
				<!-- Tabs Header -->
				<div class="p-4 pb-0">
					<Tabs.List class="grid w-full grid-cols-2 bg-muted/50">
						<Tabs.Trigger value="login">Sign In</Tabs.Trigger>
						<Tabs.Trigger value="signup">Create Account</Tabs.Trigger>
					</Tabs.List>
				</div>

				<!-- Login Form -->
				<Tabs.Content value="login" class="mt-0">
					<Card.Content class="space-y-4 p-4 pt-4">
						<div class="space-y-2">
							<Label for="login-email">Email</Label>
							<Input id="login-email" type="email" placeholder="m.jackson@example.com" bind:value={email} class="bg-input/50" />
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<Label for="login-password">Password</Label>
								<a href="/forgot-password" class="text-xs text-primary hover:underline hover:text-primary/80 transition-colors">
									Forgot password?
								</a>
							</div>
              <div class="relative">
                <Input 
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••"
                  bind:value={password}
                  class="bg-input/50"
                />
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onclick={() => showLoginPassword = !showLoginPassword}
                >
                  {#if showLoginPassword}
                    <EyeOff />
                  {:else}
                    <Eye />
                  {/if}
                </button>
              </div>
						</div>
						<Button class="w-full mt-2" onclick={handleLogin} disabled={isLoading}>
							{isLoading ? 'Connecting...' : 'Sign In'}
						</Button>
					</Card.Content>
				</Tabs.Content>

				<!-- Signup Form -->
				<Tabs.Content value="signup" class="mt-0">
					<Card.Content class="space-y-4 p-4 pt-4">
						<div class="space-y-2">
							<Label for="signup-name">Full Name</Label>
							<Input id="signup-name" type="text" placeholder="John Doe" bind:value={fullName} class="bg-input/50" />
						</div>
						<div class="space-y-2">
							<Label for="signup-email">Email</Label>
							<Input id="signup-email" type="email" placeholder="m.jackson@example.com" bind:value={email} class="bg-input/50" />
						</div>
						<div class="space-y-2">
							<Label for="signup-password">Password</Label>
              <div class="relative">
                <Input
                  id="signup-password"
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="••••••••"
                  bind:value={password}
                  class="bg-input/50"
                />
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onclick={() => showSignupPassword = !showSignupPassword}
                >
                  {#if showSignupPassword}
                    <EyeOff />
                  {:else}
                    <Eye />
                  {/if}
                </button>
              </div>
						</div>
						<div class="space-y-2">
							<Label for="confirm-password">Confirm Password</Label>
              <div class="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  bind:value={confirm}
                  class="bg-input/50 {confirm && password !== confirm ? 'border-destructive focus-visible:ring-destructive' : ''}"
                />
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onclick={() => showConfirmPassword = !showConfirmPassword}
                >
                  {#if showConfirmPassword}
                    <EyeOff />
                  {:else}
                    <Eye />
                  {/if}
                </button>
              </div>
              {#if confirm && password !== confirm}
                <p class="text-xs text-destructive font-medium">Passwords do not match.</p>
              {/if}
						</div>
						<Button class="w-full mt-2" onclick={handleSignup} disabled={isLoading}>
							{isLoading ? 'Creating...' : 'Create Account'}
						</Button>
					</Card.Content>
				</Tabs.Content>
			</Tabs.Root>

			<!-- OAuth & Footer (Persists across both tabs) -->
			<Card.Footer class="flex flex-col border-t border-border bg-muted/10 p-4 pt-6 space-y-6">
				
				<div class="relative w-full">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t border-border"></span>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-muted/10 px-2 text-muted-foreground bg-background">Or continue with</span>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3 w-full">
					<!-- Note: using standard SVGs here to avoid forcing you to install lucide-svelte just for OAuth logos -->
					<Button variant="outline" class="w-full bg-transparent hover:bg-muted/50 border-border">
						<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
							<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
							<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
							<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
						</svg>
						Google
					</Button>
					
					<Button variant="outline" class="w-full bg-transparent hover:bg-muted/50 border-border text-foreground">
						<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
							<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
						</svg>
						GitHub
					</Button>
				</div>

				<div class="text-center text-xs text-muted-foreground leading-relaxed">
					By clicking continue, you agree to our <br/>
					<a href="/terms" class="underline underline-offset-4 hover:text-primary transition-colors">Terms of Service</a> and <a href="/privacy" class="underline underline-offset-4 hover:text-primary transition-colors">Privacy Policy</a>.
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
