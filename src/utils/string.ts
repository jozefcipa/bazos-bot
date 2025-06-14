export const escapeMarkdown = (text: string) => {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1')
}

export const isUrl = (str: string) => {
  try {
    return Boolean(new URL(str))
  } catch {
    return false
  }
}
