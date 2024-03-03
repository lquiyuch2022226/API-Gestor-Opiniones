import mongoose from 'mongoose';

const PublicationSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The title is required']
    },
    category: {
        type: String,
        required: [true, 'The category is required']
    },
    text: {
        type: String,
        required: [true, 'The text is required']
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    estado: {
        type: Boolean,
        default: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

PublicationSchema.methods.toJSON = function(){
    const {__v, _id, ...publication} = this.toObject();
    publication.pid = _id;
    return publication;
}

export default mongoose.model('Publication', PublicationSchema)