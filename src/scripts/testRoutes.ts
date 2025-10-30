// Simple integration tests for routes using fetch (Node 18+)
// Run with: npx ts-node src/scripts/testRoutes.ts

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function postJson(path: string, body: any, extraHeaders: Record<string,string> = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch (e) { /* ignore */ }
  return { status: res.status, ok: res.ok, json, text };
}

function assert(cond: boolean, message: string) {
  if (!cond) throw new Error(message);
}

(async function run() {
  try {
    console.log('Testing POST /meals/analyze (payload)');
    const payload = {
      aliments: [
        { name: 'Poulet', quantity: 150, cal_100g: 165, protein_100g: 31, carbs_100g: 0, fat_100g: 3.6 },
        { name: 'Riz', quantity: 200, cal_100g: 130, protein_100g: 2.7, carbs_100g: 28, fat_100g: 0.3 }
      ]
    };
    const r1 = await postJson('/meals/analyze', payload);
    console.log('status', r1.status);
    console.log(JSON.stringify(r1.json, null, 2));
    assert(r1.ok, `/meals/analyze returned ${r1.status}`);
    assert(Array.isArray(r1.json?.perAliment) && r1.json.perAliment.length === 2, 'perAliment length');
    const sumCalories = r1.json.perAliment.reduce((s:any,p:any)=>s+p.calories,0);
    assert(sumCalories === r1.json.totalCalories, `calories sum mismatch ${sumCalories} != ${r1.json.totalCalories}`);

    console.log('Testing POST /meals/analyze/from-db (by alimentId/name)');
    // use known ids from local DB - adjust if different in your environment
    const r2 = await postJson('/meals/analyze/from-db', { aliments: [
      { alimentId: '2f5b7478-f4ea-4bad-9889-ce261769a1af', quantity: 150 },
      { alimentId: 'ce07a599-3859-4fce-af1a-314f4801a942', quantity: 200 }
    ]});
    console.log('status', r2.status);
    console.log(JSON.stringify(r2.json, null, 2));
    assert(r2.ok, `/meals/analyze/from-db returned ${r2.status}`);
    assert(Array.isArray(r2.json?.perAliment) && r2.json.perAliment.length === 2, 'perAliment length from-db');

    console.log('Testing POST /meal-plans/generate (requires x-api-key header)');
    const planBody = {
      objectives: { targetCalories: 1500 },
      constraints: { mealsPerDay: 3 }
    };
    const r3 = await postJson('/meal-plans/generate', planBody, { 'x-api-key': 'abc123456' });
    console.log('status', r3.status);
    console.log(JSON.stringify(r3.json, null, 2));
    assert(r3.status === 201, `/meal-plans/generate expected 201 got ${r3.status}`);
    assert(r3.json?.dailyPlan && Array.isArray(r3.json.dailyPlan.meals), 'dailyPlan.meals present');

    console.log('\nAll tests passed');
  } catch (e:any) {
    console.error('TEST FAILED:', e.message);
    process.exit(1);
  }
})();
