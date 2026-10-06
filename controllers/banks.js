const Bank = require('../models/Bank.js');
const ErrorResponse = require('../utils/errorResponse.js');
const resolve = require('../middleware/response.js')

module.exports = { get, createMany, create, update, remove }

async function get(req, res, next) {
   try {
      const data = await Bank.find().sort({ createdAt: 1 });
      resolve.success(res, 200, 'Banks', data)
   } catch (err) { next(new ErrorResponse(err.message)) }
}

async function createMany(req, res, next) {
   try {
      const rows = Array.isArray(req.body) ? req.body : []
      const data = await Bank.insertMany(rows.map(row => ({ ...row, createdBy: req.user._id })))
      resolve.success(res, 201, 'banks inserted successfully', data)
   } catch (err) { next(new ErrorResponse(err.message, 400)) }
}

async function create(req, res, next) {
   try {
      const data = new Bank({ ...req.body, createdBy: req.user._id })
      await data.save()
      resolve.success(res, 201, data.bank + ' created successfully', data)
   } catch (err) { next(new ErrorResponse(err.message, 400)) }
}

async function update(req, res, next) {
   try {
      const data = await Bank.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.body, { new: true, runValidators: true })
      if (!data) return next(new ErrorResponse('Bank not found or you do not own this row', 403))
      resolve.success(res, 200, data.bank + ' updated successfully', data)
   } catch (err) { next(new ErrorResponse(err.message, 400)) }
}

async function remove(req, res, next) {
   try {
      const data = await Bank.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
      if (!data) return next(new ErrorResponse('Bank not found or you do not own this row', 403))
      resolve.success(res, 204, 'Bank deleted successfully', data)
   } catch (err) { next(new ErrorResponse(err.message)) }
}
