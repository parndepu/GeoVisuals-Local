import mongoose from 'mongoose';

export default function ()
{
    mongoose.disconnect();
    return;
}