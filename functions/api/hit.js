export async function onRequestPost({ request, env }) {
  try {
    const { id, type } = await request.json();
    const table = type === 'works' ? 'my_works' : 'community_ideas';
    await env.DB.prepare(`UPDATE ${table} SET views = views + 1 WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false }, { status: 500 });
  }
}
