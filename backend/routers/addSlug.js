var db=require("../database/connection");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(title) {
  let baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const [rows] = await db
      .promise()
      .query("SELECT id FROM post WHERE slug = ?", [slug]);

    if (rows.length === 0) break;
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
}

async function updateExistingPosts() {
  const [posts] = await db.promise().query(
    "SELECT id, title FROM post WHERE slug IS NULL OR slug = ''"
  );

  for (const post of posts) {
    const slug = await generateUniqueSlug(post.title);

    await db.promise().query(
      "UPDATE post SET slug = ? WHERE id = ?",
      [slug, post.id]
    );

    console.log(`Updated post ${post.id} → ${slug}`);
  }

  console.log("✅ All slugs generated");
  process.exit();
}

updateExistingPosts();
