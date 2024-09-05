const { Schema, model } = require( 'mongoose' );

const MediaModel = new Schema( {
  url: { type: String, unique: true },
  name: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
} );

module.exports = model( 'Media', MediaModel );