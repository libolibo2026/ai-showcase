export async function onRequestGet({ env }) {
  try {
    const toolsCount = await env.DB.prepare("SELECT COUNT(*) as count FROM tools").first();
    const worksCount = await env.DB.prepare("SELECT COUNT(*) as count FROM my_works").first();
    const ideasCount = await env.DB.prepare("SELECT COUNT(*) as count FROM community_ideas WHERE status = 'approved'").first();
    
    const totalViews = await env.DB.prepare("SELECT SUM(views) as total FROM my_works").first();
    const totalIdeaViews = await env.DB.prepare("SELECT SUM(views) as total FROM community_ideas").first();

    return Response.json({
      success: true,
      data: {
        tools: toolsCount.count || 0,
        works: worksCount.count || 0,
        ideas: ideasCount.count || 0,
        totalViews: (totalViews.total || 0) + (totalIdeaViews.total || 0)
      }
    });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
