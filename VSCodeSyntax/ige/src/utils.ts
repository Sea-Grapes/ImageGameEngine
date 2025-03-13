
import * as fs from 'fs'
import * as path from 'path'

export const basePath = path.resolve(__dirname, '..')
export const read = file => fs.readFileSync(path.join(basePath, file), 'utf-8')