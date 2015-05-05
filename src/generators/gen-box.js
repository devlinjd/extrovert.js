/**
The built-in box generator for Extrovert.js.
@module gen-box.js
@copyright Copyright (c) 2015 by James M. Devlin
@author James M. Devlin | james@indevious.com
@license MIT
@version 1.0
*/

(function (window, extro) {

  extro.box = function() {

    var _opts, _eng, _side_mat, _noun;
    
    /**
    Adjust textures for simple mode to allow continuation of the texture around
    the sides of the cube/object.
    @method patch_textures
    */
    function patchTextures( cubeGeo ) {

      for (i = 0; i < cubeGeo.faces.length ; i++) {
         var face = cubeGeo.faces[ i ];
         var fvu = cubeGeo.faceVertexUvs[0][i];
         // Quick kludge for textures on non-front faces. Replace with correct
         // mapping, wrapping, or dedicated textures.
         if(face.normal.y > 0.9) {
            fvu[0].x = fvu[0].y = fvu[1].x = fvu[1].y = fvu[2].x = fvu[2].y = 0.99;
         }
         else if(face.normal.y < -0.9) {
            fvu[0].x = fvu[0].y = fvu[1].x = fvu[1].y = fvu[2].x = fvu[2].y = 0.01;
         }
         else if(face.normal.x > 0.9 || face.normal.x < -0.9) {
            fvu[0].x = fvu[0].x > 0.5 ? 0.02 : 0.00;
            fvu[1].x = fvu[1].x > 0.5 ? 0.02 : 0.00;
            fvu[2].x = fvu[2].x > 0.5 ? 0.02 : 0.00;
         }
      }
      cubeGeo.uvsNeedUpdate = true;
    }    

    return {

      options: {
        name: 'box',
        material: { color: 0xFF8844, friction: 0.2, restitution: 1.0 },
        block: { width: 250, height: 250, depth: 250 }
      },

      init: function( genOpts, eng ) {
        _opts = genOpts;
        _eng = eng;
        _side_mat = extro.provider.createMaterial( genOpts.material );
        extro.createPlacementPlane( [ 0,0,0 ] );
      },

      generate: function( noun, elems ) {
        _noun = noun;
        var sides, obj, material, pos_info;
        if( elems.length === 1 ) {
          material = this.rasterize( elems[0] );
          sides = [ material, material, material, material, material, material ];
        }
        else if( elems.length === 2 ) {
          material = this.rasterize( elems[0] );
          material2 = this.rasterize( elems[1] );
          sides = [ _side_mat, _side_mat, _side_mat, _side_mat, material, material2 ];
        }
        else if (elems.length > 2) {
          sides = [];
          var length = elems.length > 6 ? 6 : elems.length;
          for( var i = 0; i < length; i++ ) {
            obj = elems[ i ];
            material = this.rasterize( obj );
            sides.push( material );
          }
          while( sides.length !== 6 )
            sides.push( _side_mat );
        }
        
        var mat_info = extro.createCubeMaterial( sides );
        extro.createObject({ type: 'box', pos: [0,0,0], dims: [_opts.block.width,_opts.block.height,_opts.block.depth], mat: mat_info, mass: 1000 });
      },

      rasterize: function( obj ) {
        var rast = null;
        if( _noun.rasterizer ) {
          rast = ( typeof _noun.rasterizer === 'string' ) ?
            new extro['paint_' + _noun.rasterizer]() : _noun.rasterizer;
        }
        rast = rast || extro.getRasterizer( obj );

        var tileTexture = rast.paint(( _noun.adapt && _noun.adapt(obj) ) || obj, { width: _opts.block.width, height: _opts.block.height } );
        var material = extro.provider.createMaterial({ tex: tileTexture, friction: 0.2, restitution: 1.0 });
        return material;
      },



    };
  };

}(window, extrovert));
