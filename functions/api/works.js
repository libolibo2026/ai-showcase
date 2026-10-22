export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT * FROM my_works ORDER BY id ASC").all();
  return Response.json({ success: true, data: results });
}
