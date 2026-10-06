const Lender = require('../models/Lender.js');
const ErrorResponse = require('../utils/errorResponse.js');
const resolve = require('../middleware/response.js')

module.exports = { get, createMany, create, update, remove }

async function get(req, res, next) {
   try {
      const data = await Lender.find().sort({ createdAt: 1 });
      resolve.success(res, 200, 'Lenders', data)
   } catch (err) { next(new ErrorResponse(err.message)) }
}

async function createMany(req, res, next) {
   try {
      const rows = Array.isArray(req.body) ? req.body : []
      const data = await Lender.insertMany(rows.map(row => ({ ...row, createdBy: req.user._id })))
      resolve.success(res, 201, 'lenders inserted successfully', data)
   } catch (err) { next(new ErrorResponse(err.message, 400)) }
}

async function create(req, res, next) {
   try {
      const data = new Lender({ ...req.body, createdBy: req.user._id })
      await data.save()
      resolve.success(res, 201, data.lender + ' created successfully', data)
   } catch (err) { next(new ErrorResponse(err.message, 400)) }
}

async function update(req, res, next) {
   try {
      const data = await Lender.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.body, { new: true, runValidators: true })
      if (!data) return next(new ErrorResponse('Lender not found or you do not own this row', 403))
      resolve.success(res, 200, data.lender + ' updated successfully', data)
   } catch (err) { next(new ErrorResponse(err.message, 400)) }
}

async function remove(req, res, next) {
   try {
      const data = await Lender.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
      if (!data) return next(new ErrorResponse('Lender not found or you do not own this row', 403))
      resolve.success(res, 204, 'Lender deleted successfully', data)
   } catch (err) { next(new ErrorResponse(err.message)) }
}
