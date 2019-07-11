import mongoose from 'mongoose';

/**
 * Create mongodb model
 * @param {String} model_name 
 * @param {Mongoose Schema} model_schema 
 */
export default function (model_name, model_schema)
{
    return mongoose.model(model_name, model_schema);
}