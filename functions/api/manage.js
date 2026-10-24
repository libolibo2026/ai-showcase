export async function onRequestPost({ request, env }) {
  // 1. 验证管理员密码
  const pwd = request.headers.get('X-Admin-Password');
  if (!env.ADMIN_PASSWORD || pwd !== env.ADMIN_PASSWORD) {
    return Response.json({ success: false, error: '密码错误，无权限操作' }, { status: 401 });
  }

  try {
    const { action, table, data } = await request.json();

    if (!['tools', 'my_works', 'community_ideas'].includes(table)) {
      return Response.json({ success: false, error: '非法数据表' }, { status: 400 });
    }

    if (action === 'add') {
      if (table === 'my_works') {
        await env.DB.prepare("INSERT INTO my_works (name, description, url, icon, folder_name, folder_icon) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(data.name, data.description, data.url, data.icon || '✨', data.folder_name || '站长精选', data.folder_icon || '✨').run();
      } else if (table === 'tools') {
        await env.DB.prepare("INSERT INTO tools (folder_name, folder_icon, name, description, url, icon) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(data.folder_name || '常用工具', data.folder_icon || '📂', data.name, data.description, data.url, data.icon || '🔧').run();
      } else if (table === 'community_ideas') {
        await env.DB.prepare("INSERT INTO community_ideas (name, description, url, contact, status) VALUES (?, ?, ?, ?, 'approved')")
          .bind(data.name, data.description, data.url, data.contact || '').run();
      }
    } 
    else if (action === 'update') {
      if (table === 'my_works') {
        await env.DB.prepare("UPDATE my_works SET name=?, description=?, url=?, icon=?, folder_name=?, folder_icon=? WHERE id=?")
          .bind(data.name, data.description, data.url, data.icon, data.folder_name, data.folder_icon || '✨', data.id).run();
      } else if (table === 'tools') {
        await env.DB.prepare("UPDATE tools SET folder_name=?, folder_icon=?, name=?, description=?, url=?, icon=? WHERE id=?")
          .bind(data.folder_name, data.folder_icon || '📂', data.name, data.description, data.url, data.icon, data.id).run();
      }
    } 
    else if (action === 'delete') {
      await env.DB.prepare(`DELETE FROM ${table} WHERE id=?`).bind(data.id).run();
    }

    return Response.json({ success: true, message: '操作成功' });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
