// controllers/insights.controller.js
import Expense from '../models/expense.model.js';
import OpenAI from 'openai';

const cache = new Map(); // key: userId -> { expires, payload }

const getTTL = () => {
  const secs = Number(process.env.INSIGHTS_CACHE_SECONDS || 900);
  return Math.max(60, secs) * 1000; // min 60s
};

const aggregateData = async (userId) => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);

  const [byCategory, byMonth, recent] = await Promise.all([
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: cutoff } } },
      { $group: { _id: '$category', total: { $sum: '$price' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
      { $sort: { total: -1 } }
    ]),
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: cutoff } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$price' }
        }
      },
      { $project: { _id: 0, month: '$_id', total: 1 } },
      { $sort: { month: 1 } }
    ]),
    Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(60)
      .select('name category price date')
      .lean()
  ]);

  // quick local “overspend” heuristic for prompt + fallback
  const grandTotal = recent.reduce((s, x) => s + (Number(x.price) || 0), 0);
  const catMap = recent.reduce((m, x) => {
    const k = x.category || 'Uncategorized';
    m[k] = (m[k] || 0) + Number(x.price || 0);
    return m;
  }, {});
  const overspent = Object.entries(catMap)
    .map(([category, amount]) => ({ category, amount, pct: grandTotal ? amount / grandTotal : 0 }))
    .filter(x => x.pct > 0.3)
    .sort((a, b) => b.pct - a.pct);

  return { byCategory, byMonth, recent, overspent, grandTotal: Number(grandTotal.toFixed(2)) };
};

const localFallback = (agg) => {
  const top = (agg.byCategory || []).slice(0, 3).map(c => `${c.category}: €${c.total.toFixed(2)}`).join(', ');
  const tipOvers = agg.overspent[0]
    ? `High share in ${agg.overspent[0].category} (${(agg.overspent[0].pct*100).toFixed(1)}%). Try a 10–15% cut next month.`
    : `No categories above 30% of spend. Maintain current allocations.`;
  return [
    `Top categories (last 6 months): ${top || 'n/a'}.`,
    tipOvers,
    `Set a monthly cap ≈ €${(agg.grandTotal * 0.9).toFixed(2)} (-10% overall) and split across categories.`,
    `Adopt a weekly envelope for Dining/Groceries to smooth spikes.`,
    `Track one “no-spend” day per week to reduce impulse buys.`
  ];
};

export const getInsights = async (req, res) => {
  const userId = req.user._id;

  // serve cache
  const hit = cache.get(String(userId));
  if (hit && hit.expires > Date.now()) {
    return res.json(hit.payload);
  }

  const agg = await aggregateData(userId);

  // If no key, return local tips
  if (!process.env.OPENAI_API_KEY) {
    const payload = { model: 'local-fallback', tips: localFallback(agg) };
    cache.set(String(userId), { expires: Date.now() + getTTL(), payload });
    return res.json(payload);
  }

  // With OpenAI
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Keep prompt compact: send aggregates, not raw PII
    const prompt = [
        
      { role: 'system', content:
    `You are a budgeting coach. Be concise, numeric, and actionable.
     Use ${CURRENCY} with the € symbol. Use monthly caps (no weekly unless asked).
     Do NOT claim "over budget" unless a budget baseline is provided.` },
      {
        role: 'user',
        content:
`Using these aggregates, generate 5 bullet budgeting tips with numeric targets (caps, % reductions, weekly limits).
Context JSON:
{
  "totalsByCategory": ${JSON.stringify(agg.byCategory)},
  "monthlyTotals": ${JSON.stringify(agg.byMonth)},
  "grandTotalLast60": ${agg.grandTotal},
  "overspentCandidates": ${JSON.stringify(agg.overspent)}
}
Rules:
- Short bullets, each with a number.
- Refer to categories by name; do not invent categories.
- If month-over-month rose >15% for any month, call it out with a suggested cap.
- Output bullets only, no extra prose.`
      }
    ];

    const chat = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: prompt,
      temperature: 0.2,
    });

    const text = chat.choices?.[0]?.message?.content ?? '';
    const tips = text
      .split('\n')
      .map(s => s.replace(/^\s*[-*]\s?/, '').trim())
      .filter(Boolean)
      .slice(0, 5);

    const payload = { model: 'gpt-4o-mini', tips };
    cache.set(String(userId), { expires: Date.now() + getTTL(), payload });
    return res.json(payload);
  } catch (err) {
    console.error('OpenAI error', err?.response?.data || err);
    const payload = { model: 'local-fallback:error', tips: localFallback(agg) };
    cache.set(String(userId), { expires: Date.now() + getTTL(), payload });
    return res.json(payload);
  }
};
