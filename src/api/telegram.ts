export type TelegramMessage = {
  from: {
    id: number
    username: string
  }
  chat: {
    id: number
  }
  text: string
}

export enum TelegramCommand {
  LIST = '/list', // list all URLs for the user
  STOP = '/stop', // /stop {URL}
}

export type TelegramUser = {
  username: string
  chatId: string
}
export class TelegramBot {
  #botToken: string
  #webhookSecret: string

  constructor(botToken: string, webhookSecret: string) {
    this.#botToken = botToken
    this.#webhookSecret = webhookSecret
  }

  async sendMessage(
    user: TelegramUser,
    message: { text: string; imgPreviewURL?: string },
  ) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${this.#botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: user.chatId,
            parse_mode: 'MarkdownV2',
            link_preview_options: message.imgPreviewURL
              ? { url: message.imgPreviewURL }
              : undefined,
            text: message.text,
          }),
        },
      )

      const body = await res.json()
      if (!res.ok) {
        console.error('Failed to send Telegram message', {
          body,
          headers: res.headers,
        })
        return
      }

      console.log('Telegram message sent', {
        body,
        headers: res.headers,
      })
    } catch (err) {
      console.error('Error while sending Telegram message', { err })
    }
  }

  parseMessage(
    body: object,
    secret: string | null,
  ): { text: string; user: TelegramUser } {
    if (!secret || secret !== this.#webhookSecret) {
      console.error('Invalid webhook secret', { secret })
      throw new Error('Invalid Telegram webhook secret')
    }

    try {
      const message = this.validateIncomingMessage(body)
      const chatId = message.chat.id.toString()
      const text = message.text
      const username = message.from.username

      return {
        text,
        user: { username, chatId },
      }
    } catch (err) {
      console.error('Error while parsing Telegram message', { err, body })
      throw new Error('Failed to parse Telegram message')
    }
  }

  private validateIncomingMessage(body: object): TelegramMessage {
    if (!body || typeof body !== 'object' || !('message' in body)) {
      throw new Error('Invalid Telegram message format')
    }

    const message = body.message as Partial<TelegramMessage>

    // Check if the required fields are present
    if (
      !message.from?.id || !message.from?.username || !message.chat?.id ||
      !message.text
    ) {
      console.error('Invalid message format', { body })
      throw new Error('Invalid Telegram message format')
    }

    return message as TelegramMessage
  }
}
