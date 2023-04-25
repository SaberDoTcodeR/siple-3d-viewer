import * as THREE from "three";

export class QuadWireFrameGeometry extends THREE.BufferGeometry {

  constructor(geometry = null, quadInfo = null) {
    super();

    this.type = 'WireframeGeometry';

    this.parameters = {
      geometry: geometry
    };
    if ( geometry !== null ) {
      const vertices = [];

      if ( geometry.index !== null ) {
        // todo: handle indexed BufferGeometry


        // // indexed BufferGeometry
        //
        // const position = geometry.attributes.position;
        // const indices = geometry.index;
        // let groups = geometry.groups;
        //
        // if ( groups.length === 0 ) {
        //
        //   groups = [ { start: 0, count: indices.count, materialIndex: 0 } ];
        //
        // }
        //
        // // create a data structure that contains all edges without duplicates
        //
        // for ( let o = 0, ol = groups.length; o < ol; ++ o ) {
        //
        //   const group = groups[ o ];
        //
        //   const groupStart = group.start;
        //   const groupCount = group.count;
        //
        //   for ( let i = groupStart, l = ( groupStart + groupCount ); i < l; i += 3 ) {
        //     for ( let j = 0; j < 3; j ++ ) {
        //
        //       const index1 = indices.getX( i + j );
        //       const index2 = indices.getX( i + ( j + 1 ) % 3 );
        //
        //       start.fromBufferAttribute( position, index1 );
        //       end.fromBufferAttribute( position, index2 );
        //
        //       if ( isUniqueEdge( start, end, edges ) === true ) {
        //
        //         vertices.push( start.x, start.y, start.z );
        //         vertices.push( end.x, end.y, end.z );
        //
        //       }
        //
        //     }
        //
        //   }
        //
        // }

      } else {
        // non-indexed BufferGeometry
        for (let i = 0; i < quadInfo.faces.length; i++) {
          const face = quadInfo.faces[i]
          let saveFace = null
          if(face.vertices.length === 3) {
            console.log("Tri Face: ", face.vertices)
            for (let j = 0; j < face.vertices.length; j++) {
              const vertex = face.vertices[j]
              const vertexIndex = vertex.vertexIndex - 1
              vertices.push(quadInfo.vertices[vertexIndex].x, quadInfo.vertices[vertexIndex].y, quadInfo.vertices[vertexIndex].z)
              if (saveFace !== null) {
                vertices.push(...saveFace)
              } else {
              }
              saveFace = [quadInfo.vertices[vertexIndex].x, quadInfo.vertices[vertexIndex].y, quadInfo.vertices[vertexIndex].z]
            }
            vertices.push(...saveFace)
          } else {

            console.log("Quad Face: ", face.vertices)
            const p1 = new THREE.Vector3(quadInfo.vertices[face.vertices[0].vertexIndex - 1].x,
              quadInfo.vertices[face.vertices[0].vertexIndex - 1].y,
              quadInfo.vertices[face.vertices[0].vertexIndex - 1].z)
            const p2 = new THREE.Vector3(quadInfo.vertices[face.vertices[1].vertexIndex - 1].x,
              quadInfo.vertices[face.vertices[1].vertexIndex - 1].y,
              quadInfo.vertices[face.vertices[1].vertexIndex - 1].z)
            const p3 = new THREE.Vector3(quadInfo.vertices[face.vertices[2].vertexIndex - 1].x,
              quadInfo.vertices[face.vertices[2].vertexIndex - 1].y,
              quadInfo.vertices[face.vertices[2].vertexIndex - 1].z)
            const p4 = new THREE.Vector3(quadInfo.vertices[face.vertices[3].vertexIndex - 1].x,
              quadInfo.vertices[face.vertices[3].vertexIndex - 1].y,
              quadInfo.vertices[face.vertices[3].vertexIndex - 1].z)

            // P1 -- P2
            // |      |
            // P4 -- P3

            vertices.push(p1.x, p1.y, p1.z)
            vertices.push(p2.x, p2.y, p2.z)
            vertices.push(p2.x, p2.y, p2.z)
            vertices.push(p3.x, p3.y, p3.z)
            vertices.push(p3.x, p3.y, p3.z)
            vertices.push(p4.x, p4.y, p4.z)
            vertices.push(p4.x, p4.y, p4.z)
            vertices.push(p1.x, p1.y, p1.z)

          }
        }

      }

      this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    }

  }

}