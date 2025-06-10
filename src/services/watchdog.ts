import { BazosOffer } from '../api/bazos.ts'
import { TelegramUser } from '../api/telegram.ts'

const getUserRedisKey = (user: TelegramUser): string => {
  return `user:${user.username}:${user.chatId}`
}

export async function listURLsForUser(user: TelegramUser): Promise<string[]> {
  const userKey = getUserRedisKey(user)

  // TODO: call redis SMEMBERS

  return [
    'https://www.bazos.cz/search.php?hledat=ipod+nano+7&rubriky=www&hlokalita=&humkreis=25&cenaod=500&cenado=3000&Submit=Hledat&order=&kitx=ano',
  ]
}

export async function watchURL(url: string, user: TelegramUser): Promise<void> {
  // TODO: Implement the logic to stop watching a URL for a user

  const userKey = getUserRedisKey(user)

  // TODO: call redis SADD
}

export async function unwatchURL(
  url: string,
  user: TelegramUser,
): Promise<void> {
  // TODO: Implement the logic to stop watching a URL for a user

  const userKey = getUserRedisKey(user)

  // TODO: call redis SREM
}

export async function getResultsForURL(url: string): Promise<BazosOffer[]> {
  return []
}

export async function updateResultsForURL(
  url: string,
  foundOffers: BazosOffer[],
): Promise<void> {
}
