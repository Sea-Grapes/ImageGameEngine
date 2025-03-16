const newlines = /\r?\n/

// parse #region and #endregion
export function parseRegions(input: string): Record<string, string> {

  const lines = input.split(/\r?\n/)
  const regions = {}
  let activeRegion: { name: string, lines: string[] } | null = null;

  for(const line of lines) {
    if(line.startsWith('#region')) {
      if(activeRegion) regions[activeRegion.name] = activeRegion.lines.join('\n').trim()

      activeRegion = {
        name: line.replace('#region', '').match(/\w+/)[0].trim(),
        lines: []
      }
    }

    else if(line.startsWith('#endregion') && activeRegion) {
      regions[activeRegion.name] = activeRegion.lines.join('\n')
      activeRegion = null
    }

    else if(activeRegion) {
      activeRegion.lines.push(line)
    }
    
  }

  if(activeRegion) {
    regions[activeRegion.name] = activeRegion.lines.join('\n').trim()
  }

  return regions

}


// basic markdown parser for top-level headings
interface MarkdownData {
  heading: string
  content: string
}

export function parseMarkdown(input: string, mapCallback?: (data: MarkdownData) => any) {
  const lines = input.split(newlines)
  let results = []
  let insideCodeBlock = false

  for (const line of lines) {
    if(line.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock
    }

    // check for new regions
    if (line.startsWith('# ') && !insideCodeBlock) {
      const data: MarkdownData = {
        heading: line.slice(2),
        content: ''
      }
      results.push(data)
    }

    else if (results.length) {
      let current = results.at(-1)
      current.content += (current.content.length? '\n': '') + line
    }
  }

  if(mapCallback) results = results.map(mapCallback)
  return results
}