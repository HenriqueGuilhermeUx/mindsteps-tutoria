# MindSteps — iOS preflight

- Current mobile source: `client/` (Capacitor 7.6.8).
- Existing app ID: `br.com.alternativeventures.mindsteps`.
- CI installs matching `@capacitor/ios` temporarily, builds web assets and compiles an unsigned simulator app on macOS. No signing/secrets or production modification.
- Next: inspect CI, resolve native errors, test simulator launch and functional flows, then prepare Apple signing and TestFlight after review.
## Evidence reconciliation — 16/11/2026

[MindSteps native iOS run #42889767478](https://github.com/HenriqueGuilhermeUx/mindsteps-tutoria/actions/runs/42889767478) completed **SUCCESS** at commit `0481b2f`, including unsigned simulator compilation, installation and launch. [Validate MindSteps Release #42889767762](https://github.com/HenriqueGuilhermeUx/mindsteps-tutoria/actions/runs/42889767762) also completed SUCCESS. These are preflight tests, **not** App Store or functional QA.

Commit `90e1a2e` adds an explicit `CFBundleIdentifier=br.com.alternativeventures.mindsteps` assertion on the compiled app before installation/launch. The new check must pass its own CI before approval; the earlier green run does not validate the new change.

**Outstanding release gates:** reconcile the app's package and AAB with commercial Google Play listing; QA onboarding, authentication, educational workflows, privacy/consent and account deletion, any child-related policies, offline/permissions as applicable, and Apple team ownership. Real device screenshots, signing, TestFlight and App Store review are separate steps. No Android/main changes or Apple submission in this branch.
