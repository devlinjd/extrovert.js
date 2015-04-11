/**
An Extrovert.js generator for a 3D city scene.
@module gen-city.js
@copyright Copyright (c) 2015 by James M. Devlin
@author James M. Devlin | james@indevious.com
@license MIT
@version 1.0
*/

(function (window, THREE, EXTRO) {

  EXTRO.city = function() {

    var _opts = null, _eng = null;

    return {
      init: function( merged_options, eng ) {
        _opts = merged_options;
        _eng = eng;
        // var plane_tex = opts.generator.background ?
        // THREE.ImageUtils.loadTexture( opts.generator.background ) : null;
        // plane_tex.wrapS = plane_tex.wrapT = THREE.RepeatWrapping;
        // plane_tex.repeat.set( 100, 100 );
        var frustum_planes = EXTRO.Utils.calcFrustum( _eng.camera );
        merged_options.scene.items[0].dims[0] = frustum_planes.farPlane.topRight.x - frustum_planes.farPlane.topLeft.x;
        merged_options.scene.items[0].dims[2] = frustum_planes.farPlane.topRight.y - frustum_planes.farPlane.botRight.y;
        EXTRO.create_placement_plane( [0,200,0], [200000,1,200000] );
      },
      transform: function( obj ) {
        return get_position( obj, _opts, _eng );
      },
      rasterize: function( obj ) {
        var texture = _eng.rasterizer.paint( obj, _opts );
        var material = EXTRO.createMaterial({ tex: texture, friction: 0.2, resitution: 1.0 });
        return new THREE.MeshFaceMaterial([ _side_mat, _side_mat, _side_mat, _side_mat, material, material ]);
      },
      generate: function( obj ) {
        var pos_info = this.transform( obj );
        var mat_info = this.rasterize( obj );
        var mesh = EXTRO.create_object({ type: 'box', pos: pos_info.pos, dims: [pos_info.width, pos_info.height, pos_info.depth], mat: mat_info, mass: 1000 });
        if( _opts.generator.lookat )
          mesh.lookAt( new THREE.Vector3( _opts.generator.lookat[0], _opts.generator.lookat[1], _opts.generator.lookat[2]) );
        return mesh;
      },
      options: {
        gravity: [0,-50,0],
        camera: {
          position: [0,300,400],
          lookat: [0,0,0],
          up: [0,0,-1],
          rotation: [-(Math.PI / 8.0), 0, 0]
        },
        generator: {
          name: 'city',
          material: { color: 0xABABAB, friction: 0.2, restitution: 1.0 }
        },
        scene: { items: [ { type: 'box', pos: [0,150,0], dims: [-1,10,-1], mass: 0 } ] }
      },
      init_cam_opts: {
        position: [0,400,0],
        lookat: [0,0,0],
        up: [0,0,-1]
      }
    };
  };


  /**
  Retrieve the position, in 3D space, of a recruited HTML element.
  @method init_card
  */
  function get_position( val, opts, eng ) {

     // Get the position of the HTML element [1]
     var parent_pos = EXTRO.Utils.offset( EXTRO.Utils.$( opts.src.container ) );
     var child_pos = EXTRO.Utils.offset( val );
     var pos = { left: child_pos.left - parent_pos.left, top: child_pos.top - parent_pos.top };

     // From that, compute the position of the top-left and bottom-right corner
     // of the element as they would exist in 3D-land.
     var topLeft = EXTRO.calc_position( pos.left, pos.top, eng.placement_plane );
     var botRight = EXTRO.calc_position( pos.left + val.offsetWidth, pos.top + val.offsetHeight, eng.placement_plane );
     // These return the topLeft and bottomRight coordinates of the MAIN FACE of the thing in WORLD coords

     var block_width = Math.abs( botRight.x - topLeft.x );
     var block_depth = Math.abs( topLeft.z - botRight.z );
     var block_height = block_depth;

     // Offset by the half-height/width so the corners line up
     return {
        pos: [
           topLeft.x + (block_width / 2),
           topLeft.y - (block_height / 2),
           topLeft.z + (block_depth / 2)],
        width: block_width,
        depth: block_depth,
        height: block_height
     };
  }

}(window, THREE, EXTRO));
