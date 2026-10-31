import test from 'node:test';
import assert from 'node:assert/strict';
import {growthComparison} from '../public/ui/src/components/charts.js';
test('snapshot comparison displays the source percentages and a true zero instead of invented monthly points',()=>{
 const html=growthComparison(0,.36);
 assert.match(html,/Pertumbuhan peserta/);assert.match(html,/Pertumbuhan aktivitas usaha/);assert.match(html,/>36%</);assert.match(html,/>0%</);
 assert.equal((html.match(/class="growth-bar /g)||[]).length,1);assert.match(html,/growth-zero-dot/);assert.ok(!html.includes('polyline'));
});
test('negative and missing growth values retain their meaning',()=>{
 const negative=growthComparison(-.09,.29);assert.match(negative,/>-9%</);assert.match(negative,/growth-bar negative/);assert.ok(!/NaN|undefined|width:-/.test(negative));
 const absent=growthComparison(null,undefined);assert.match(absent,/Data tidak tersedia/);assert.ok(!absent.includes('growth-zero-dot'));assert.ok(!/NaN|undefined/.test(absent));
});
