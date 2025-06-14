import { BazosOffer } from '../api/bazos.ts'
import { TelegramUser } from '../api/telegram.ts'
import Storage from './storage.ts'

const getUserKey = (user: TelegramUser): string => {
  return `user:${user.username}:${user.chatId}`
}

// Storage structure
// {
//  [userID]: {
//   'bazos-url': [
//     { Bazos Offer },
//     { Bazos Offer },
//     { Bazos Offer },
//    ]
//  }
// }

export async function listURLsForUser(
  user: TelegramUser,
): Promise<Record<string, BazosOffer[]>> {
  const userKey = getUserKey(user)

  const userURLs = await Storage.get(userKey)
  if (!userURLs) {
    return {}
  }

  if (typeof userURLs === 'string') {
    return JSON.parse(userURLs) as Record<string, BazosOffer[]>
  }

  // KV seems to automatically parse JSON strings
  return userURLs as unknown as Record<string, BazosOffer[]>
}

export async function addURL(url: string, user: TelegramUser): Promise<void> {
  const userKey = getUserKey(user)

  const userURLs = await listURLsForUser(user)
  if (!userURLs[url]) {
    // If the URL is not already in the user's list, add it
    const newURLs = {
      ...userURLs,
      [url]: [],
    }
    await Storage.put(userKey, JSON.stringify(newURLs))
  }
}

export async function removeURL(
  url: string,
  user: TelegramUser,
): Promise<void> {
  const userKey = getUserKey(user)

  const userURLs = await listURLsForUser(user)
  if (userURLs[url]) {
    // If the URL exists in the user's list, remove it
    const newURLs = {
      ...userURLs,
      [url]: undefined, // Remove the URL from the list
    }
    await Storage.put(userKey, JSON.stringify(newURLs))
  }
}

export async function updateResultsForURL(
  user: TelegramUser,
  url: string,
  foundOffers: BazosOffer[],
): Promise<void> {
  const userKey = getUserKey(user)

  const userURLs = await listURLsForUser(user)
  userURLs[url] = foundOffers
  await Storage.put(userKey, JSON.stringify(userURLs))
}

export async function listUsers(): Promise<TelegramUser[]> {
  const { keys } = await Storage.list()

  return keys.map(({ name: key }) => {
    const [_, username, chatId] = key.split(':')

    return { username, chatId } as TelegramUser
  })
}
