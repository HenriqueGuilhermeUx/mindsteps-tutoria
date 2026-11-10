# MindSteps — iOS preflight

- Current mobile source: `client/` (Capacitor 7.6.8).
- Existing app ID: `br.com.alternativeventures.mindsteps`.
- CI installs matching `@capacitor/ios` temporarily, builds web assets and compiles an unsigned simulator app on macOS. No signing/secrets or production modification.
- Next: inspect CI, resolve native errors, test simulator launch and functional flows, then prepare Apple signing and TestFlight after review.