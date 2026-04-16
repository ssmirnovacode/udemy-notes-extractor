function extractUdemyNotes() {
  const notes = [];
  const rows = document.querySelectorAll('[class*="lecture-bookmark-v2--row"]');

  rows.forEach((row, index) => {
    const durationEl = row.querySelector('[class*="duration"]');
    const headerEl = row.querySelector('[class*="bookmark-header"]');
    const bodyEl = row.querySelector('[data-purpose="bookmark-body"]');

    if (bodyEl || headerEl) {
      notes.push({
        index: index + 1,
        timestamp: durationEl?.textContent?.trim() || "",
        title: headerEl?.textContent?.trim() || "",
        noteHtml: bodyEl?.innerHTML?.trim() || "",
        noteMarkdown: bodyEl ? htmlToMarkdown(bodyEl) : "",
      });
    }
  });

  return notes;
}

function htmlToMarkdown(element) {
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const tag = node.tagName.toLowerCase();
    const children = Array.from(node.childNodes).map(processNode).join("");

    // Code blocks
    if (node.classList?.contains("ud-component--base-components--code-block")) {
      const codeText = node.textContent.trim();
      if (codeText.includes("\n")) {
        return `\n\`\`\`\n${codeText}\n\`\`\`\n`;
      }
      return `\`${codeText}\``;
    }

    switch (tag) {
      case "strong":
      case "b":
        return `**${children}**`;
      case "em":
      case "i":
        return `*${children}*`;
      case "code":
        return `\`${children}\``;
      case "p":
        return `${children}\n\n`;
      case "br":
        return "\n";
      case "ul":
        return `\n${children}`;
      case "ol":
        return `\n${children}`;
      case "li":
        return `- ${children}\n`;
      case "a":
        return `[${children}](${node.href})`;
      case "h1":
        return `# ${children}\n`;
      case "h2":
        return `## ${children}\n`;
      case "h3":
        return `### ${children}\n`;
      default:
        return children;
    }
  }

  return processNode(element)
    .trim()
    .replace(/\n{3,}/g, "\n\n");
}

const notes = extractUdemyNotes().reverse();

const markdown = notes
  .map(
    (n) =>
      `## ${n.title}\n\n**Timestamp:** ${n.timestamp}\n\n${n.noteMarkdown}`,
  )
  .join("\n\n---\n\n");

const blob = new Blob([markdown], { type: "text/markdown" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "udemy-notes.md";
a.click();
