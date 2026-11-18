#!/usr/bin/env node
// Static, read-only pre-TestFlight sanity check. No Apple/EAS credentials.
import { readFileSync } from 'node:fs';
const config=readFileSync('client/capacitor.config.ts','utf8');
const pkg=JSON.parse(readFileSync('client/package.json','utf8'));
const issues=[];
const check=(ok,msg)=>{if(!ok) issues.push(msg)};
check(/appId:\s*['"]br\.com\.alternativeventures\.mindsteps['"]/.test(config),'Unexpected bundle ID; verify official Apple and Google Play identity');
check(/webDir:\s*['"]dist['"]/.test(config),'Unexpected Capacitor webDir');
check(/allowMixedContent:\s*false/.test(config),'Android cleartext guard changed; manual review needed');
const deps=pkg.dependencies||{}, dev=pkg.devDependencies||{};
const majors=['@capacitor/core','@capacitor/cli','@capacitor/android'];
for (const d of majors) {
  const version=deps[d]||dev[d]||'';
  check(/^7\./.test(version),d+' major must remain Capacitor 7 for this checked branch');
}
check(!('ios' in (pkg.scripts||{})),'Unexpected iOS script: inspect distribution steps before signing');
console.log('INFO: static manifest inspection only, NOT App Store Connect or TestFlight verification');
console.log('INFO: Play AAB origin, QA, privacy, child-related policies, Apple team, build number and signing still require separate evidence');
for(const issue of issues) console.error('FAIL:',issue);
if(issues.length) process.exitCode=1;
else console.log('PASS: MindSteps static pre-TestFlight config gate');
