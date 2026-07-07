import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const appDir = path.join(repoRoot, 'app')
const vercelPath = path.join(repoRoot, 'vercel.json')

type Finding = {
  level: 'error' | 'warn'
  message: string
}

const findings: Finding[] = []

function exists(filePath: string) {
  return fs.existsSync(filePath)
}

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8')
}

function routePathToFile(routePath: string) {
  const cleaned = routePath.replace(/^\//, '')
  return path.join(appDir, cleaned, 'route.ts')
}

function hasMethod(source: string, method: string) {
  const patterns = [
    new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`),
    new RegExp(`export\\s+function\\s+${method}\\s*\\(`),
    new RegExp(`export\\s+const\\s+${method}\\s*=`),
  ]
  return patterns.some((pattern) => pattern.test(source))
}

function hasCronAuth(source: string) {
  return source.includes('requireCronAuth') || source.includes('x-cron-secret') || source.includes('authorization')
}

function walk(dir: string, files: string[] = []) {
  if (!exists(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(fullPath, files)
    if (entry.isFile()) files.push(fullPath)
  }
  return files
}

if (!exists(appDir)) {
  findings.push({ level: 'error', message: 'Missing app directory; route parity cannot run.' })
}

if (!exists(vercelPath)) {
  findings.push({ level: 'warn', message: 'Missing vercel.json; no Vercel cron targets were checked.' })
} else {
  const vercel = JSON.parse(read(vercelPath)) as { crons?: Array<{ path?: string; schedule?: string }> }
  for (const cron of vercel.crons ?? []) {
    if (!cron.path) {
      findings.push({ level: 'error', message: 'Vercel cron entry is missing a path.' })
      continue
    }

    const routeFile = routePathToFile(cron.path)
    if (!exists(routeFile)) {
      findings.push({ level: 'error', message: `Vercel cron target ${cron.path} has no matching route file at ${path.relative(repoRoot, routeFile)}.` })
      continue
    }

    const source = read(routeFile)
    if (!hasMethod(source, 'GET')) {
      findings.push({ level: 'error', message: `Vercel cron target ${cron.path} does not export GET.` })
    }

    if (cron.path.startsWith('/api/cron/') && !hasCronAuth(source)) {
      findings.push({ level: 'error', message: `Cron route ${cron.path} does not include a visible cron auth guard.` })
    }
  }
}

const routeFiles = walk(appDir).filter((file) => file.endsWith(`${path.sep}route.ts`))
for (const routeFile of routeFiles) {
  const relative = path.relative(repoRoot, routeFile)
  const source = read(routeFile)
  const isCronRoute = relative.includes(`${path.sep}api${path.sep}cron${path.sep}`)
  const isWebhookRoute = relative.includes(`${path.sep}api${path.sep}webhooks${path.sep}`)

  if (isCronRoute && !hasCronAuth(source)) {
    findings.push({ level: 'warn', message: `${relative} is a cron route without a visible cron auth guard.` })
  }

  if ((isCronRoute || isWebhookRoute) && !source.includes('catch')) {
    findings.push({ level: 'warn', message: `${relative} is an integration route without a visible catch/error path.` })
  }
}

const duplicateNestedApp = path.join(repoRoot, 'latimore-hub', 'app')
if (exists(duplicateNestedApp)) {
  findings.push({ level: 'warn', message: 'Nested latimore-hub/app tree exists; confirm it is not a duplicate source tree used by builds.' })
}

for (const finding of findings) {
  const prefix = finding.level === 'error' ? 'ERROR' : 'WARN'
  console.log(`[route-parity] ${prefix}: ${finding.message}`)
}

const errors = findings.filter((finding) => finding.level === 'error')
if (errors.length > 0) {
  process.exit(1)
}

console.log(`[route-parity] OK: checked ${routeFiles.length} route files.`)
