# Preview Smoke Testing

Automated preview smoke tests may seed the existing onboarding completion flag before navigation:

```ts
await context.addInitScript(() => {
  window.localStorage.setItem('zen_onboarding_answered', 'true');
});
```

This is a test-only setup step. It does not remove onboarding, change production behavior, or alter the user-facing first-run flow.
