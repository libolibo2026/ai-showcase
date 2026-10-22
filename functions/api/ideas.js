export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT * FROM community_ideas WHERE status = 'approved' ORDER BY id DESC").all();
  return Response.json({ success: true, data: results });
}
