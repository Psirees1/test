const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const apparalSchema = new Schema({
    Category: {type: String, required: [true, 'category is required']},
    Name: {type: String, required: [true, 'Name is required']},
    Details: {type: String, required: [true, 'details is required'], minLength: [10, 'the details content is atleast 10 characters']},
    Rating: {type: String, required: [true, 'rating is required']},
    imageUrl:{type: String, required: [true, 'image url is required']},
    Owner: {type: Schema.Types.ObjectId, ref: 'User'},
},
{timestamps: [true]}

);

//collection name is apparals in the database
module.exports = mongoose.model('apparal', apparalSchema);