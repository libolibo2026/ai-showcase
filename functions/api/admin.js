// 获取所有投稿
export async function onRequestGet({ request, env }) {
  const pwd = request.headers.get('X-Admin-Password');
  
  // 比对 Cloudflare 里的环境变量
  if (!env.ADMIN_PASSWORD || pwd !== env.ADMIN_PASSWORD) {
    return Response.json({ success: false, error: '密码错误，禁止访问' }, { status: 401 });
  }

  try {
    const { results } = await env.DB.prepare("SELECT * FROM community_ideas ORDER BY id DESC").all();
    return Response.json({ success: true, data: results });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

// 更新状态或删除
export async function onRequestPost({ request, env }) {
  try {
    const pwd = request.headers.get('X-Admin-Password');
    if (!env.ADMIN_PASSWORD || pwd !== env.ADMIN_PASSWORD) {
      return Response.json({ success: false, error: '无权限' }, { status: 401 });
    }

    const { id, action } = await request.json();

    if (action === 'approve') {
      await env.DB.prepare("UPDATE community_ideas SET status = 'approved' WHERE id = ?").bind(id).run();
    } else if (action === 'delete') {
      await env.DB.prepare("DELETE FROM community_ideas WHERE id = ?").bind(id).run();
    }
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
