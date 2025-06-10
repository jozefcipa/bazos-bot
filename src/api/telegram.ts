export class TelegramBot {
    #botToken: string
  
    constructor(botToken: string) {
      this.#botToken = botToken
    }
  
    async sendMessage(chatId: string, message: string) {
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${this.#botToken}/sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
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

    async parseMessage(): Promise<string> {
        // TODO: implement
    }
  }