const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect(config = {}) {
    try {
      this.client = redis.createClient({
        url: config.url || process.env.REDIS_URL || 'redis://localhost:6379',
        ...config
      });

      this.client.on('error', (err) => {
        console.error(' Redis Client Error:', err);
        this.connected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.connected = true;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error(' Redis connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.client && this.connected) {
        await this.client.quit();
        console.log(' Redis disconnected');
        this.connected = false;
      }
    } catch (error) {
      console.error('Redis disconnect error:', error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }

  isConnected() {
    return this.connected;
  }

  async get(key) {
    if (!this.connected) return null;
    return await this.client.get(key);
  }

  async set(key, value, expiration = null) {
    if (!this.connected) return false;
    if (expiration) {
      return await this.client.setEx(key, expiration, value);
    }
    return await this.client.set(key, value);
  }

  async del(key) {
    if (!this.connected) return false;
    return await this.client.del(key);
  }
}


module.exports = new RedisClient();

