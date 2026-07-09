-- 027: religa a seção "ensaios com esse tema" + Tinyform dos posts do blog.
-- Os campos existiam no frontmatter da era Nuxt Content e se perderam na migração
-- para D1 (o front já consome post.works / post.showSchedule — ver
-- pages/blog/[category]/[slug]/index.vue).
-- works = slug de categoria do portfolio relacionada ao post (ex: dia-das-maes).

ALTER TABLE blog_posts ADD COLUMN works TEXT;
ALTER TABLE blog_posts ADD COLUMN show_schedule INTEGER NOT NULL DEFAULT 0;
