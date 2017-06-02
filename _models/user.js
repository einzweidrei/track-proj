var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

//create type ObjectId
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema(
    {
        _id: { type: String },
        info: {
            email: { type: String },
            displayName: { type: String },
            phone: { type: String },
            image: { type: String },
            gender: { type: Number },
        },
        history: {
            createAt: { type: Date },
            updateAt: { type: Date }
        },
        status: { type: Boolean }
    }
);

// OwnerSchema.index({ 'info.address.location': '2dsphere' });

//plugin Pagination
UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);		