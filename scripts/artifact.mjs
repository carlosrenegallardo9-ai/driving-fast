// Convierte dist/index.html (un solo archivo) en un fragmento publicable como Artifact.
import { readFileSync, writeFileSync } from 'node:fs'

let html = readFileSync('dist/index.html', 'utf8')
html = html
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body>/gi, '')
  .replace(/<meta charset[^>]*>/i, '')
  .replace(/<meta name="viewport"[^>]*>/i, '')
writeFileSync('dist/artifact.html', html.trim() + '\n')
console.log('dist/artifact.html', (html.length / 1024).toFixed(0), 'KB')
