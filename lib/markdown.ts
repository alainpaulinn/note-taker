import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function processMarkdownFile(filePath: string) {
  try {
    // Resolve the full path
    const fullPath = path.join(process.cwd(), filePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Markdown file not found: ${fullPath}`)
      return {
        contentHtml: '<p>Content not found</p>',
        frontmatter: {},
        error: 'Content not found'
      }
    }
    
    // Read the markdown file
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    // Parse frontmatter if present
    const { data, content } = matter(fileContents)
    
    // Process markdown to HTML with GitHub Flavored Markdown support (including tables)
    const processedContent = await remark()
      .use(remarkGfm) // Add GitHub Flavored Markdown support for tables, strikethrough, etc.
      .use(html, { sanitize: false })
      .process(content)
    
    const contentHtml = processedContent.toString()
    
    return {
      contentHtml,
      frontmatter: data,
      error: null
    }
  } catch (error) {
    console.error(`Error processing markdown file ${filePath}:`, error)
    return {
      contentHtml: '<p>Error loading content. Please try again later.</p>',
      frontmatter: {},
      error: 'Error loading content. Please try again later.'
    }
  }
} 