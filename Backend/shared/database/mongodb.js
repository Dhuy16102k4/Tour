const mongoose = require('mongoose') 

class MongoDB {
  constructor() {
    this.connection = null 
  }

  async connect(uri, options = {}) {
    try {
      this.connection = await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        ...options
      }) 
      console.log(' MongoDB connected successfully') 
      return this.connection 
    } catch (error) {
      console.error(' MongoDB connection error:', error) 
      throw error 
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect() 
        console.log(' MongoDB disconnected') 
      }
    } catch (error) {
      console.error(' MongoDB disconnect error:', error) 
      throw error 
    }
  }

  getConnection() {
    return this.connection 
  }
}

module.exports = new MongoDB() 

