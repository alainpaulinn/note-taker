const headingRegex = /^(#{1,6})\s+(.*)$/gm
const boldRegex = /\*\*(.*?)\*\*/g
const italicRegex = /\*(.*?)\*/g
const codeRegex = /`([^`]+)`/g
const listRegex = /^-\s+(.*)$/gm

export function renderMarkdown(input: string) {
  let html = input
    .replace(headingRegex, (_, hashes: string, text: string) => {
      const level = hashes.length
      return `<h${level}>${text.trim()}</h${level}>`
    })
    .replace(listRegex, (_, item: string) => `<li>${item.trim()}</li>`)
    .replace(boldRegex, "<strong>$1</strong>")
    .replace(italicRegex, "<em>$1</em>")
    .replace(codeRegex, "<code>$1</code>")

  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
  html = html.replace(/\n/g, "<br/>")
  return html
}
