const newlineRegex = /\r?\n/
const wordRegex = /\w+/

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

export function parseDocs(input) {
  const lines = input.split(newlineRegex)
  const results = {}
  let insideCodeBlock = false
  let key

  for (let line of lines) {

    if(line.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock
    }

    if (line.startsWith('# ') && !insideCodeBlock) {
      if (results[key]) {
        results[key] = results[key].join('\n')
      }
      line = line.slice(2)
      key = wordRegex.exec(line)?.[0]

      results[key] = []
    }

    else if (key) {
      results[key].push(line)
    }
  }

  return results
}