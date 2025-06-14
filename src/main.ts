import { fetchOffers, isValidBazosURL } from './api/bazos.ts'
import { TelegramBot, TelegramCommand } from './api/telegram.ts'
import { escapeMarkdown, isUrl } from './utils/string.ts'
import Storage, { KVStorage } from './services/storage.ts'
import * as watchdog from './services/watchdog.ts'

interface Env {
  TELEGRAM_WEBHOOK_SECRET?: string
  TELEGRAM_API_KEY?: string
  KV?: KVStorage
}

export default {
  async fetch(request: Request, env: Env) {
    if (!env.TELEGRAM_API_KEY || !env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response(
        'Missing some of the ENV vars [TELEGRAM_API_KEY, TELEGRAM_WEBHOOK_SECRET]',
        { status: 500 },
      )
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    if (!env.KV) {
      console.error('KV storage is not bound to the worker.')
      return new Response(
        'KV storage is not bound to the worker.',
        { status: 500 },
      )
    }

    Storage.init(env.KV)

    try {
      // Init Telegram and validate request
      const telegram = new TelegramBot(
        env.TELEGRAM_API_KEY,
        env.TELEGRAM_WEBHOOK_SECRET,
      )
      const { text, user } = telegram.parseMessage(
        await request.json(),
        request.headers.get('x-telegram-bot-api-secret-token'),
      )

      // Proccess message command
      if (text === TelegramCommand.LIST) {
        const offers = await watchdog.listURLsForUser(user)
        await telegram.sendMessage(
          user,
          {
            text: `*👀 Watched URLs*\n${
              offers.map((url) => escapeMarkdown(url)).join('\n')
            }`,
          },
        )
      } else if (text.startsWith(TelegramCommand.STOP)) {
        await watchdog.unwatchURL(
          text.replace(TelegramCommand.STOP, '').trim(),
          user,
        )
        await telegram.sendMessage(user, {
          text: '✅ URL has been removed from the watchlist',
        })
      } else if (isValidBazosURL(text)) {
        await watchdog.watchURL(text, user)
        await telegram.sendMessage(user, {
          text: '✅ URL has been added to the watchlist',
        })
      } else if (isUrl(text)) {
        await telegram.sendMessage(user, {
          text: '😵‍💫 The URL must be from Bazos search page',
        })
      } else {
        await telegram.sendMessage(user, { text: '🤨 Unknown command' })
      }

      return new Response('OK', { status: 200 })
    } catch (e) {
      console.error('Error while processing request', e)
      return new Response((e as Error).message)
    }
  },

  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(async () => {
      // TODO: implement logic here
      // 	// Fetch all URLs from Redis
      // fetch all URLs in bazos
      // check diff of new vs stored
      // call updateResultsForURL
      // if there are new offers, send Telegram message to users
    })
  },
}

//   const offers = await fetchOffers(url)

// 			const text = `
// *${escapeMarkdown('New Offer! 😱')}*
// *${escapeMarkdown(offer.title)}*

// ${escapeMarkdown(offer.description)}

// 📍 ${escapeMarkdown(offer.location)}
// 💰 *${escapeMarkdown(offer.price)}*

// [Open on Bazos](${offer.url})
// `
// }

// PLAN
// - setup redis
// - setup cron job to run the script every day
// - setup proper telegram webhook with secret
