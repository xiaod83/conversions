# How to Write Posts

Jekyll is now set up! Here's how to publish articles easily:

## Writing a New Post

1. **Create a file** in `_posts/` folder
2. **Name it**: `YYYY-MM-DD-title.md` 
   - Example: `2025-10-29-my-first-article.md`
3. **Add front matter** at the top:

```markdown
---
layout: post
title: "Your Article Title"
date: 2025-10-29
author: Your Name
tags: [tag1, tag2, tag3]
---

## Your content starts here

Write in Markdown...
```

## Markdown Quick Reference

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Item two

[Link text](https://url.com)

`inline code`

![Image alt text](/path/to/image.jpg)
```

## Publishing

1. Create your `.md` file in `_posts/`
2. Commit and push to GitHub
3. GitHub Pages builds it automatically
4. Your article appears at `/posts/` and has its own URL

## Local Testing (Optional)

If you want to preview locally before pushing:

```bash
# Install Jekyll (once)
gem install bundler jekyll

# Run local server
jekyll serve

# Visit http://localhost:4000
```

## That's It!

No HTML needed. Just write Markdown, commit, and it's published.

Delete the example post `_posts/2025-10-29-example-post.md` when you're ready.
