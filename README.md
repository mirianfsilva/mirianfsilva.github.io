# Personal Website - Content Management Guide

This personal website uses a markdown-based content management system that automatically renders your content into organized tabs. All your content is managed through a single markdown file.

## 📁 File Structure

```
mirianfsilva.github.io/
├── index.html              # Main HTML file (don't edit directly)
├── content/                # ✨ YOUR CONTENT FILES - Edit these!
│   ├── home.md             # Home tab content
│   ├── research-papers.md  # Research papers tab content
│   └── talks.md            # Oral presentations & talks tab content
├── css/
│   └── main.css            # Styling
├── js/
│   ├── content.js          # Content rendering logic
│   └── site.js             # Particles animation
└── img/                    # Images and icons
```

## ✏️ How to Edit Content

### Content Files
**Location:** `content/` folder

Your website content is organized into **3 separate markdown files**, one for each tab:

1. **`content/home.md`** - Home tab (About, Research Interest, Background, Facts)
2. **`content/research-papers.md`** - Research Papers tab
3. **`content/talks.md`** - Oral Presentations & Talks tab

Each file is independent, so you can edit them separately without affecting other tabs!

### Tab Structure

Your content is automatically organized into **3 main tabs**:

1. **Home** (`content/home.md`) - Your about, research interests, background, and personal facts
2. **Research Papers** (`content/research-papers.md`) - Your published research papers
3. **Oral Presentations & Talks** (`content/talks.md`) - Your talks, presentations, and speaking engagements

## 📝 Adding/Editing Sections

### Home Tab (`content/home.md`)

The Home tab uses **heading levels 2** (`##`) to create sections:

```markdown
## Section Title
Content goes here...

## Another Section
More content...
```

#### Recognized Home Sections:
- `## About me`
- `## Research Interest`
- `## TLDR: Academic and Professional background`
- `## Facts about me :)`

You can add any new section to the Home tab by creating a new `## Heading` in `content/home.md`.

**Example:**
```markdown
## Teaching Experience
- Course 1 at University X (2023)
- Course 2 at University Y (2024)

## Awards & Honors
- Award Name (2024)
- Another Award (2023)
```

### Research Papers Tab (`content/research-papers.md`)

This file contains your research papers in **BibTeX format**. The BibTeX entries will be automatically formatted and displayed as a numbered bibliography list (like in LaTeX).

Simply add your BibTeX entries in a code block:

````markdown
```bibtex
@article{silva2024,
  author = {Silva, Mírian F.},
  title = {Your Paper Title},
  journal = {Journal Name},
  year = {2024},
  url = {https://example.com/paper}
}

@inproceedings{silva2023,
  author = {Silva, Mírian F. and Coauthor, Name},
  title = {Another Paper Title},
  booktitle = {Conference Name},
  year = {2023},
  doi = {10.1234/example}
}
```
````

The system will automatically convert these to a formatted bibliography list with proper styling.

### Oral Presentations & Talks Tab (`content/talks.md`)

This file contains your talks and presentations. Like research papers, just add content directly:

```markdown
- Silva, M. (2025). Talk Title. Conference Name. Link
- Silva, M. (2024). Another Talk. Event Name. Link
```

## 📄 Content Formatting

### Regular Text
```markdown
This is regular text. You can use **bold** and *italic* formatting.
```

### Links
```markdown
[Link Text](https://example.com)
```

### Lists
```markdown
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
```

### BibTeX Format (for Papers & Talks)

BibTeX entries are automatically formatted into numbered bibliography lists (like LaTeX). Simply write your BibTeX in a code block:

````markdown
```bibtex
@article{silva2024,
  author = {Silva, Mírian F. and Coauthor, Name},
  title = {Your Research Paper Title},
  journal = {Journal Name},
  year = {2024},
  volume = {10},
  number = {2},
  pages = {123-145},
  url = {https://example.com/paper}
}

@inproceedings{silva2023,
  author = {Silva, Mírian F.},
  title = {Another Paper Title},
  booktitle = {Conference Name},
  year = {2023},
  doi = {10.1234/example}
}

@misc{silva2024talk,
  author = {Silva, Mírian F.},
  title = {Talk Title},
  howpublished = {Conference Name, Location},
  year = {2024},
  url = {https://link.to/video}
}
```
````

**Supported BibTeX Fields:**
- `author` - Authors (formatted in bold)
- `year` - Publication year
- `title` - Title of the work
- `journal` - Journal name (for @article)
- `booktitle` - Conference/book name (for @inproceedings)
- `howpublished` - Publication venue (for @misc)
- `volume`, `number`, `pages` - Additional details
- `url` - Link to the paper/resource
- `doi` - DOI link

**Output Format:**
The BibTeX will be rendered as a numbered list like:
1. Silva, Mírian F. and Coauthor, Name. (2024). Your Research Paper Title. *Journal Name*, 10(2), pp. 123-145. [Link].
2. Silva, Mírian F. (2023). Another Paper Title. In *Conference Name*. [DOI: 10.1234/example].

### Citation List Format (Alternative)

You can also use a simple list format for talks:

```markdown
## Oral Presentations & Talks

- Silva, M. (2025). Talk Title. Conference Name, Location. Retrieved from https://link.to/video
- Silva, M. (2024). Another Talk. Event Name. Retrieved from https://link.to/slides
```

## 🎨 Styling Tips

### Icons
The home sections automatically get emoji icons:
- About me gets a book icon (📖)
- Research Interest gets a lightbulb icon (💡)
- And so on...

### Nested Lists
Nested bullet points are automatically indented:
```markdown
- Main point
  - Supporting detail
  - Another detail
    - Even more nested
```

## 🔧 Common Tasks

### Task 1: Update Your Bio
1. Open `content/home.md`
2. Find `## About me`
3. Edit the paragraph below it
4. Save the file

### Task 2: Add a New Talk
1. Open `content/talks.md`
2. Add your talk in list format
3. Save the file

### Task 3: Add a Research Paper
1. Open `content/research-papers.md`
2. Add your BibTeX entry or formatted citation
3. Save the file

### Task 4: Add a New Section to Home
1. Open `content/home.md`
2. Add a new `## Section Name` heading
3. Add your content below it
4. Save the file

## 🚀 Publishing Changes

After editing any content file:

1. Save the file(s)
2. Commit and push to GitHub:
   ```bash
   git add content/
   git commit -m "Update content"
   git push
   ```
3. Your GitHub Pages site will automatically update!

## ⚠️ Important Notes

### DO Edit:
- ✅ `content/home.md` - Home tab content
- ✅ `content/research-papers.md` - Research papers content
- ✅ `content/talks.md` - Talks and presentations content
- ✅ Images in the `img/` folder

### DON'T Edit (unless you know what you're doing):
- ❌ `index.html` - Generated content area
- ❌ `js/content.js` - Content rendering logic
- ❌ `css/main.css` - Styling (unless customizing design)

## 🔍 Troubleshooting

### Content Not Showing?
- Check that your section headings use `##` (level 2)
- Make sure section names match exactly (case-sensitive for special sections)
- Verify your markdown syntax is correct

### BibTeX Not Rendering?
- Make sure you're using triple backticks: ` ```bibtex `
- Close the code block with triple backticks: ` ``` `
- Check for syntax errors in your BibTeX entries

### New Section Not Appearing?
- Verify you're using `## Heading` format
- Make sure the file is saved
- Clear your browser cache and refresh

## 📚 Examples

### Example: Home Content (`content/home.md`)

```markdown
## About me
Your bio paragraph here...

## Research Interest
- Interest 1
- Interest 2

## TLDR: Academic and Professional background
- Job at Company (2020-Present)
  - Achievement 1
  - Achievement 2
- Education
  - Degree from University

## Facts about me :)
Fun facts about yourself!
```

### Example: Research Papers (`content/research-papers.md`)

````markdown
```bibtex
@article{yourpaper2024,
  author = {Your Name},
  title = {Paper Title},
  journal = {Journal Name},
  year = {2024},
  url = {https://doi.org/example}
}

@inproceedings{conference2023,
  author = {Your Name},
  title = {Conference Paper},
  booktitle = {Conference Name},
  year = {2023}
}
```
````

### Example: Talks (`content/talks.md`)

```markdown
- **Your Name**. (2025). Talk Title Here. Conference Name, Location. Retrieved from https://link.to/video
- **Your Name**. (2024). Another Talk Title. Event Name. Retrieved from https://link.to/slides
- **Your Name**, & Coauthor. (2023). Panel Discussion Title. Event Name.
```

---

**Need Help?** Open an issue or refer to the markdown guide at [Markdown Guide](https://www.markdownguide.org/)
