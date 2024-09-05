const path = require( 'path' );
const fs = require( 'fs' );
const MediaModel = require( '../schemas/mediaModel' );

class MediaController {

  getOneByUser = async ( req, res, next ) => {
    try {
      const id = req.params.id;
      const image = await MediaModel.findOne( { user: id } );
      if ( image ) {
        return res.json( image );
      } else {
        return res.json( {} );
      }
    } catch ( error ) {
      next( error );
    }
  };

  upload = async ( req, res, next ) => {
    try {
      const id = req.me.id;
      if ( !req.file ) { return res.status( 400 ).send( 'No file uploaded.' ); }
      const fileURL = `${req.protocol}://${req.get( 'host' )}/uploads/${req.file.filename}`;
      const existMedia = await MediaModel.findOne( { user: id } );
      if ( existMedia ) {
        const filePath = path.join( __dirname, '../uploads/', existMedia.name );
        await MediaModel.updateOne( { user: id }, { $set: { name: req.file.filename, url: fileURL } } );
        fs.unlink( filePath, () => {} );
      } else {
        await MediaModel.create( { user: id, name: req.file.filename, url: fileURL } );
      }
      return res.json( { success: true, msg: `File uploaded: ${req.file.filename}` } );
    } catch ( error ) {
      next( error );
    }
  };

  delete = async ( req, res, next ) => {
    try {
      const id = req.params.id;
      const image = await MediaModel.findOne( { _id: id } );
      if ( !image ) { return res.json( { success: false, msg: 'Image not found.' } ); }

      const filename = image.name;
      const filePath = path.join( __dirname, '../uploads/', filename );
      await MediaModel.deleteOne( { name: filename } );

      fs.unlink( filePath, ( err ) => {
        if ( err ) { return res.status( 400 ).send( 'File not found.' ); }
        return res.json( { success: true, msg: `File ${filename} deleted successfully.` } );
      } );
    } catch ( error ) {
      next( error );
    }
  };

};

const mediaController = new MediaController();

module.exports = mediaController;