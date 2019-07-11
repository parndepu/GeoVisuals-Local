import mongoose from 'mongoose';

/**
 * Geovisuals mongodb schema
 */
export default {
    
    Trip: function ()
    {
        // Create trip schema
        var trip_schema = new mongoose.Schema({
            upload_datetime: String, // MM/DD/YYYY
            upload_location: String, // Address
            upload_description: String, // Trip description
            upload_optional: String // Optional description
        });

        return trip_schema;
    },

    Trip_data: function () 
    {
        // Create trip data schema
        var ObjectId = mongoose.Schema.Types.ObjectId;
        var trip_data_schema = new mongoose.Schema({
            tripID: {
                type: ObjectId,
                index: 1
            },
            datetime: {
                type: Date
            },
            location: {
                type: [Number, Number],
                index: { type: '2dsphere', sparse: true }
            },
            narrative: {
                type: String
            }
        });

        // Create 2d indexing
        trip_data_schema.index(true);
        trip_data_schema.index({ unique: true, sparse: true });

        return trip_data_schema;
    }

}