# How to Write Posts

Jekyll is set up! Here's how to publish articles:

## Writing a New Post

1. **Create a file** in `_posts/` folder
2. **Name it**: `YYYY-MM-DD-title.md` 
   - Example: `2025-10-29-sat-reading-tips.md`
3. **Add front matter** at the top:

```markdown
---
layout: post
title: "Your Article Title"
date: 2025-10-29
author: Your Name
category: SAT
tags: [reading, tips]
---

## Your content starts here

Write in Markdown...
```

## Categories

Use one of these for `category:`:
- `SAT` - SAT tips and study strategies
- `Boot Sequence` - PC hardware guides
- `Orthopedics` - Musculoskeletal primers

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
```

## Publishing

1. Create your `.md` file in `_posts/`
2. Commit and push to GitHub
3. It appears at `/series/` automatically

That's it! No HTML, just Markdown.

Delete `_posts/2025-10-29-example-post.md` when ready.
