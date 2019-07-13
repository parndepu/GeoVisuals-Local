import {    trip_model, 
            trip_data_model } from '../../index';

import mongoose from 'mongoose';

/**
 * Remove trip and its data by id
 * @param {*} trip_id 
 */
export default function (trip_id)
{
    return new Promise ( function (resolve, reject) {
        console.log(trip_id);
        var ObjectId = mongoose.Types.ObjectId;
        
        trip_model.find({ _id: ObjectId(trip_id) }).deleteOne().exec( function (err, data) {

            if (err) throw err;
            trip_data_model.find({ tripID: ObjectId(trip_id)}).deleteMany().exec( function (err, data) {

                if (err) throw err;
                
                resolve("We completely removing your trip.");

            });
        });

    });
}