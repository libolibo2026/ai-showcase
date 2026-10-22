export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT * FROM tools ORDER BY folder_name, sort_order ASC").all();
  const folders = {};
  results.forEach(row => {
    if (!folders[row.folder_name]) {
      folders[row.folder_name] = { category: row.folder_name, icon: row.folder_icon, tools: [] };
    }
    folders[row.folder_name].tools.push(row);
  });
  return Response.json({ success: true, data: Object.values(folders) });
}
