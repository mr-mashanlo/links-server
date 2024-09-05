const { put, del } = require( '@vercel/blob' );
const path = require( 'path' );
const MediaModel = require( '../schemas/mediaModel' );

class VercelMediaController {

  getOneByUser = async ( req, res, next ) => {
    try {
      const id = req.params.id;
      const image = await MediaModel.findOne( { user: id } );
      return res.json( image );
    } catch ( error ) {
      next( error );
    }
  };

  upload = async ( req, res, next ) => {
    try {
      const id = req.me.id;
      const { buffer, originalname } = req.file;
      const fileExtension = path.extname( originalname ).toLowerCase();
      const filename = `${Date.now()}${fileExtension}`;
      const existMedia = await MediaModel.findOne( { user: id } );
      const result = await put( `uploads/${filename}`, buffer, { access: 'public' } );
      const savedFileName = path.basename( result.url );
      if ( existMedia ) {
        const image = await MediaModel.findOneAndUpdate( { user: id }, { $set: { name: savedFileName, url: result.url } }, { new: true } );
        await del( existMedia.url );
        return res.json( image );
      } else {
        const image = await MediaModel.create( { user: id, name: savedFileName, url: result.url } );
        return res.json( image );
      }
    } catch ( error ) {
      next( error );
    }
  };

  delete = async ( req, res, next ) => {
    try {
      const id = req.params.id;
      const image = await MediaModel.findOne( { _id: id } );

      if ( !image ) {
        return res.json( { success: false, msg: 'Image not found.' } );
      }

      await del( image.url );
      await MediaModel.deleteOne( { _id: id } );
      return res.json( { success: true, msg: 'File deleted successfully.' } );
    } catch ( error ) {
      next( error );
    }
  };

};

const vercelMediaController = new VercelMediaController();

module.exports = vercelMediaController;