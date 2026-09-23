const { isMongo, memoryDb, saveFileDb } = require('../config/db');
const mongoose = require('mongoose');

const generateId = () => new mongoose.Types.ObjectId().toString();

class ModelStore {
  constructor(collectionName, mongooseModel) {
    this.collectionName = collectionName;
    this.model = mongooseModel;
  }

  async find(filter = {}) {
    if (isMongo()) {
      return await this.model.find(filter).lean();
    }
    let items = memoryDb[this.collectionName] || [];
    return items.filter(item => {
      for (let key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    if (isMongo()) {
      return await this.model.findOne(filter).lean();
    }
    const items = await this.find(filter);
    return items[0] || null;
  }

  async findById(id) {
    if (isMongo()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const item = await this.model.findById(id).lean();
          if (item) return item;
        }
        return await this.model.findOne({ _id: id }).lean();
      } catch (err) {
        return await this.model.findOne({ _id: id }).lean();
      }
    }
    const items = memoryDb[this.collectionName] || [];
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(data) {
    if (!data._id) {
      data._id = generateId();
    }
    if (isMongo()) {
      const created = await this.model.create(data);
      return created.toObject();
    }
    const _id = data._id;
    const newItem = { _id, id: _id, createdAt: new Date().toISOString(), ...data };
    if (!memoryDb[this.collectionName]) memoryDb[this.collectionName] = [];
    memoryDb[this.collectionName].push(newItem);
    saveFileDb();
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    if (isMongo()) {
      return await this.model.findByIdAndUpdate(id, updateData, options).lean();
    }
    const items = memoryDb[this.collectionName] || [];
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    // Check if update is $set or plain object
    const payload = updateData.$set ? updateData.$set : updateData;
    memoryDb[this.collectionName][index] = { ...memoryDb[this.collectionName][index], ...payload, updatedAt: new Date().toISOString() };
    saveFileDb();
    return memoryDb[this.collectionName][index];
  }

  async findByIdAndDelete(id) {
    if (isMongo()) {
      return await this.model.findByIdAndDelete(id).lean();
    }
    const items = memoryDb[this.collectionName] || [];
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    saveFileDb();
    return deleted;
  }

  async countDocuments(filter = {}) {
    if (isMongo()) {
      return await this.model.countDocuments(filter);
    }
    const items = await this.find(filter);
    return items.length;
  }

  async deleteMany(filter = {}) {
    if (isMongo()) {
      return await this.model.deleteMany(filter);
    }
    const items = memoryDb[this.collectionName] || [];
    memoryDb[this.collectionName] = items.filter(item => {
      for (let key in filter) {
        if (item[key] === filter[key]) return false;
      }
      return true;
    });
    saveFileDb();
    return { acknowledged: true };
  }
}

module.exports = ModelStore;
