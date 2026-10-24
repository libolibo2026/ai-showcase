// 获取所有投稿
export async function onRequestGet({ request, env }) {
  // 简单的密码保护，你在前端输入的密码必须匹配 'fangtang2024'
  const url = new URL(request.url);
  const password = url.searchParams.get('pwd');
  if (password !== 'fangtang2024') {
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
    const { id, action, pwd } = await request.json();
    if (pwd !== 'fangtang2024') return Response.json({ success: false, error: '无权限' }, { status: 401 });

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
