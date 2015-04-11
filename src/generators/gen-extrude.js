/**
An Extrovert.js generator for 3D extrusion.
@module gen-extrude.js
@copyright Copyright (c) 2015 by James M. Devlin
@author James M. Devlin | james@indevious.com
@license MIT
@version 1.0
*/

(function (window, THREE, EXTRO) {

  EXTRO.extrude = function() {

    var _opts = null;
    var _eng = null;
    var _side_mat = null;

    return {

      init: function( merged_options, eng ) {
        _opts = merged_options;
        _eng = eng;
        EXTRO.create_placement_plane( [0,0,200] );
        var mat = new THREE.MeshLambertMaterial({ color: _opts.generator.material.color });
        _side_mat = _opts.physics.enabled ?
          Physijs.createMaterial( mat, _opts.generator.material.friction, _opts.generator.material.restitution ) : mat;
      },

      transform: function( obj ) {
        return EXTRO.get_position( obj, _opts, _eng );
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
        generator: {
          name: 'extrude',
          material: { color: 0x440000, friction: 0.2, restitution: 1.0 }
        },
        camera: { position: [0,0,800] },
        block: { depth: 100 },
        lights: [{ type: 'ambient', color: 0xffffff }]
      }
    };
  };

}(window, THREE, EXTRO));
