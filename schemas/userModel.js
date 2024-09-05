const { Schema, model } = require( 'mongoose' );

const UserModel = new Schema( {
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  firstname: { type: String, default: 'John' },
  lastname: { type: String, default: 'Doe' },
  links: [ { id: String, url: String, title: String, platform: String } ]
} );

module.exports = model( 'User', UserModel );