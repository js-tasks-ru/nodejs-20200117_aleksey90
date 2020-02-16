const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  ctx.productList = {};
  if (ctx.request.query.subcategory) {
    ctx.productList = {subcategory: ctx.request.query.subcategory};
  }
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find(ctx.productList);
  ctx.body = (products) ? {products: products.map(mapProduct)} : {products: []};
};

module.exports.productById = async function productById(ctx, next) {
  if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(400);
  const product = await Product.findById(ctx.params.id);
  ctx.body = (product) ? {product: mapProduct(product)} : ctx.throw(404);
};
