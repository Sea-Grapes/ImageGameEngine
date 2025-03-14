import { cutString } from "./utils";

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
  const sections = {}
  let activeKey

  for (let line of lines) {
    if (line.startsWith('# ')) {
      if (sections[activeKey]) {
        sections[activeKey] = sections[activeKey].join('\n')
      }
      line = line.slice(2)
      activeKey = wordRegex.exec(line)?.[0]

      sections[activeKey] = []
    }

    else if (activeKey) {
      sections[activeKey].push(line)
    }
  }

  return sections
}


export function parseCustom(input) {
  const lines = input.split(newlineRegex)
  const sections = {}
  let activeKey

  for (let line of lines) {
    if (line.startsWith('# ')) {

      if(sections[activeKey]) {
        sections[activeKey].content = sections[activeKey].content.join('\n')
      }

      line = line.slice(2)
      activeKey = wordRegex.exec(line)[0]
      const title = cutString(line, ' ')[1]

      sections[activeKey] = {
        title,
        content: []
      }
    }

    else if (activeKey) {
      sections[activeKey].content.push(line)
    }
  }

  return sections
}
