const isDev = process.env.NODE_ENV !== 'production'

function log(level: string, msg: string, data?: object) {
  const line = JSON.stringify({ level, msg, ...data, ts: new Date().toISOString() })
  if (level === 'error') console.error(line)
  else if (isDev) console.log(line)
}

export const logger = {
  info:  (data: object, msg: string) => log('info',  msg, data),
  warn:  (data: object, msg: string) => log('warn',  msg, data),
  error: (data: object, msg: string) => log('error', msg, data),
  debug: (data: object, msg: string) => log('debug', msg, data),
}
