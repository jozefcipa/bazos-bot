// Wrapper for Cloudflare KV storage
// https://developers.cloudflare.com/kv/api/

export interface KVStorage {
  get(key: string): Promise<any>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  list(opts?: { prefix?: string }): Promise<{ keys: Array<{ name: string }> }>
}

class Storage implements KVStorage {
  kv: KVStorage | null = null

  init(kv: KVStorage) {
    this.kv = kv
  }

  assertInitialized(): asserts this is { kv: KVStorage } {
    if (!this.kv) {
      throw new Error(
        'Storage is not initialized. Call init() with a KV storage instance.',
      )
    }
  }

  async get(key: string): Promise<string> {
    this.assertInitialized()
    const value = await this.kv.get(key)
    return value ? JSON.parse(value) : null
  }

  async put(key: string, value: string): Promise<void> {
    this.assertInitialized()
    await this.kv.put(key, value)
  }

  async delete(key: string): Promise<void> {
    this.assertInitialized()
    await this.kv.delete(key)
  }

  async list(
    opts?: { prefix?: string },
  ): Promise<{ keys: Array<{ name: string }> }> {
    this.assertInitialized()
    return await this.kv.list(opts)
  }
}

export default new Storage()
