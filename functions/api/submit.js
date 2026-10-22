export async function onRequestPost({ request, env }) {
  try {
    const { name, url, desc } = await request.json();
    if (!name || !url) return Response.json({ success: false, error: '名称和链接不能为空' }, { status: 400 });
    await env.DB.prepare("INSERT INTO community_ideas (name, description, url, status) VALUES (?, ?, ?, 'pending')")
      .bind(name, desc || '暂无简介', url).run();
    return Response.json({ success: true, message: '提交成功' });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
