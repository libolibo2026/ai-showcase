export async function onRequestGet({ env }) {
  try {
    // 查出所有站长作品
    const { results } = await env.DB.prepare("SELECT * FROM my_works ORDER BY id ASC").all();
    
    // 为了兼容前端的文件夹渲染逻辑，我们把它包装成一个文件夹
    const data = [{
      category: '站长精选',
      icon: '✨',
      tools: results 
    }];
    
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
