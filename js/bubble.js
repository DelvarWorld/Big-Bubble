(function() {

var cameraData = {
    zoom: 1200,
    fov: 60,
    frustrum: {}
};

var stage = {
    width: 400, // window.innerWidth
    height: 600 // window.innerHeight
};
stage.aspect = stage.width / stage.height;

var zoomTimer = 0;

var inertia = { x: 0, y: 0 },
    moving,
    keysDown = {},
    bubble = {
        radius: 90,
        origRadius: 90,
        scale: 1,
        segments: 32
    },
    movePhys = {
        acceleration: 0.5,
        deceleration: 1,
        max: 15
    };

if ( !window.Detector.webgl ) {
    window.Detector.addGetWebGLMessage();
}
    
var $container = $('#game')
    .css({ width: stage.width + 'px', height: stage.height + 'px' });

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( stage.width, stage.height );
$container.append( renderer.domElement );

var zoom = function( level ) {
    cameraData.zoom = camera.position.z = level;
    var frustumHeight = 2.0 * cameraData.zoom * Math.tan(cameraData.fov * 0.5 * ( Math.PI / 180 ) );
    cameraData.frustrum = {
        x: frustumHeight * stage.aspect,
        y: frustumHeight
    };
};

// PerspectiveCamera( fov, aspect, near, far )
var camera = new THREE.PerspectiveCamera( cameraData.fov, stage.width / stage.height, 1, 100000 );
zoom( cameraData.zoom );

var scene = new THREE.Scene();
var playerGeometry = new THREE.SphereGeometry( bubble.radius, bubble.segments, bubble.segments );

var material = new THREE.MeshPhongMaterial({
    color: 0xddddff
});

var cubeSide = cameraData.frustrum.y * 2;

//see https://github.com/mrdoob/three.js/wiki/Uniforms-types
var gradientUniforms = {
    color1: { type: 'c', value: new THREE.Color( 0xFFFFFF ) },
    color2: { type: 'c', value: new THREE.Color( 0xff0000 ) },
    //color1: { type: 'c', value: new THREE.Color( 0x2185C5 ) },
    //color2: { type: 'c', value: new THREE.Color( 0x7ECEFD ) },
    cHeight: { type: 'f' , value: cubeSide / 2 }
};

var bgShader = new THREE.ShaderMaterial( {
    uniforms: gradientUniforms,

    //uniforms:       uniforms,
    //attributes:     attributes,
    vertexShader:   $('#vshader').text(),
    fragmentShader: $('#fshader').text(),
    side: THREE.BackSide
    //blending:       THREE.AdditiveBlending,
    //depthTest:      false,
    //transparent:    true

});

var bg = new THREE.Mesh(
    new THREE.CubeGeometry( cubeSide, cubeSide, cubeSide ),
    bgShader
);
//scene.add(bg);

// RGB color cube
var rgbPoint, face, numberOfSides, vertexIndex, sideColor;
var bgMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors,
    side: THREE.BackSide
});
var bgGeometry = new THREE.CubeGeometry( cubeSide, cubeSide, cubeSide, 1, 1, 1 );
var faceIndices = [ 'a', 'b', 'c', 'd' ];
for ( var i = 0; i < bgGeometry.faces.length; i++ ) {
    face = bgGeometry.faces[ i ];
    // determine if current face is a tri or a quad
    numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
    // assign color to each vertex of current face
    for( var j = 0; j < numberOfSides; j++ ) {
        vertexIndex = face[ faceIndices[ j ] ];
        // store coordinates of vertex
        rgbPoint = bgGeometry.vertices[ vertexIndex ];
        // initialize color variable
        sideColor = new THREE.Color( 0x2185C5 );
        //sideColor = new THREE.Color( 0x7ECEFD );
        sideColor.r -= 0.3 * ( 0.5 - rgbPoint.x / cubeSide );
        sideColor.g -= 0.3 * ( 0.5 - rgbPoint.y / cubeSide );
        sideColor.b -= 0.3 * ( 0.5 - rgbPoint.z / cubeSide );
        //0.5 + rgbPoint.y / cubeSide, 0.5 + rgbPoint.z / cubeSide );
        //color2: { type: 'c', value: new THREE.Color( 0x7ECEFD ) },
        face.vertexColors[ j ] = sideColor;
    }
}
var bgCube = new THREE.Mesh( bgGeometry, bgMaterial );
bgCube.dynamic = true;
bgCube.position.set( 100, 50, 0 );
scene.add(bgCube);

//bg.position.z -= cubeSide / 2;
bg.rotation.x += 90 * ( Math.PI / 180 );

var pointLight1 = new THREE.PointLight(0x888888);
var pointLight2 = new THREE.PointLight(0x8888FF);
var pointLight3 = new THREE.PointLight(0xAA00AA);

// set its position
pointLight1.position.z = 1030;
pointLight2.position.z = 1030;
pointLight3.position.z = 1030;

// add to the scene
scene.add(pointLight1);
scene.add(pointLight2);
scene.add(pointLight3);

var spheres = {},
    tesh;

var baterial = new THREE.MeshLambertMaterial({
    color: 0x44aa44
});

var sScale = 0.5;
var makeSpheres = function(scale) {
    for ( var i = 0; i < 10; i ++ ) {
        tesh = new THREE.Mesh( playerGeometry, baterial );

        tesh.position.x = ( Math.random() * cameraData.frustrum.x ) - ( cameraData.frustrum.x / 2 );
        tesh.position.y = ( Math.random() * cameraData.frustrum.y ) - ( cameraData.frustrum.y / 2 );
        tesh.position.z = 0;

        tesh.scale.x = tesh.scale.y = tesh.scale.z = sScale + Math.random() / 100;
        tesh.r = tesh.scale.x * bubble.radius;

        scene.add( tesh );
        spheres[i] = tesh;
    }
};
makeSpheres(sScale);

var animate = function() {
    window.requestAnimationFrame( animate );
    render();
};

var sign = function(num) {
    return num ? num < 0 ? -1 : 1 : 0;
};





// PerspectiveCamera( fov, aspect, near, far )
var mirrorCubeCamera = new THREE.CubeCamera( 0.001, 10000, 128 );
mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
//var mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
scene.add( mirrorCubeCamera );
var mirrorCubeMaterial = new THREE.MeshBasicMaterial({
    envMap: mirrorCubeCamera.renderTarget
});






var path = "js/Park2/";
var format = '.jpg';
var urls = [
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
];
var textureCube = THREE.ImageUtils.loadTextureCube( urls );
textureCube.format = THREE.RGBFormat;

var fshader = THREE.FresnelShader;
var uniforms = THREE.UniformsUtils.clone( fshader.uniforms );

var renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
});
//var rtUniforms u { tDiffuse: { type: "t", value: rtTexture } };

uniforms.tCube.value = mirrorCubeCamera.renderTarget;

var parameters = {
    fragmentShader: fshader.fragmentShader,
    vertexShader: fshader.vertexShader,
    uniforms: uniforms
};
var fresnelMaterial = new THREE.ShaderMaterial( parameters );

scene.matrixAutoUpdate = false;

// Skybox

var cshader = THREE.ShaderLib.cube;
cshader.uniforms.tCube.value = textureCube;

var assmaterial = new THREE.ShaderMaterial( {

    fragmentShader: cshader.fragmentShader,
    vertexShader: cshader.vertexShader,
    uniforms: cshader.uniforms
    //side: THREE.BackSide

} );

var qesh = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000 ), assmaterial );






//var playerMesh = new THREE.Mesh( playerGeometry, mirrorCubeMaterial );
var playerMesh = new THREE.Mesh( playerGeometry, fresnelMaterial );

playerMesh.position.x = 0;
playerMesh.position.y = 0;
playerMesh.position.z = 0;
playerMesh.scale.x = playerMesh.scale.y = playerMesh.scale.z = 1;

scene.add( playerMesh );



var render = function() {

    var timer = 0.0001 * Date.now();

    //uniforms.amplitude.value = Math.sin(timer * 10);

    if( keysDown.right ) {
        inertia.x += movePhys.acceleration;

        if( inertia.x > movePhys.max ) {
            inertia.x = movePhys.max;
        }
    } else if( keysDown.left ) {
        inertia.x -= movePhys.acceleration;

        if( inertia.x < -movePhys.max ) {
            inertia.x = -movePhys.max;
        }
    } else if ( inertia.x ) {
        inertia.x -= sign( inertia.x ) * movePhys.deceleration;

        if( Math.abs( inertia.x ) <= movePhys.deceleration ) {
            inertia.x = 0;
        }
    }

    if( keysDown.up ) {
        inertia.y += movePhys.acceleration;

        if( inertia.y > movePhys.max ) {
            inertia.y = movePhys.max;
        }
    } else if( keysDown.down ) {
        inertia.y -= movePhys.acceleration;

        if( inertia.y < -movePhys.max ) {
            inertia.y = -movePhys.max;
        }
    } else if ( inertia.y ) {
        inertia.y -= sign( inertia.y ) * movePhys.deceleration;

        if( Math.abs( inertia.y ) <= movePhys.deceleration ) {
            inertia.y = 0;
        }
    }

    playerMesh.position.x += inertia.x;
    playerMesh.position.y += inertia.y;

    var xLimit = cameraData.frustrum.x / 2,
        yLimit = cameraData.frustrum.y / 2;

    if( playerMesh.position.y > yLimit - bubble.radius ) {
        playerMesh.position.y = yLimit - bubble.radius;
        inertia.y = 0;
    }
    if( playerMesh.position.y < -yLimit + bubble.radius ) {
        playerMesh.position.y = -yLimit + bubble.radius;
        inertia.y = 0;
    }
    if( playerMesh.position.x > xLimit - bubble.radius ) {
        playerMesh.position.x = xLimit - bubble.radius;
        inertia.x = 0;
    }
    if( playerMesh.position.x < -xLimit + bubble.radius ) {
        playerMesh.position.x = -xLimit + bubble.radius;
        inertia.x = 0;
    }

    pointLight1.position.x = playerMesh.position.x + 1000;
    pointLight1.position.y = playerMesh.position.y;

    pointLight2.position.x = playerMesh.position.x - 1000;
    pointLight2.position.y = playerMesh.position.y;

    pointLight3.position.x = playerMesh.position.x + 1000;
    pointLight3.position.y = playerMesh.position.y + 1000;

    //camera.lookAt( mesh.position );

    var sphere;
    for( var key in spheres ) {
        sphere = spheres[key];
        // (x2-x1)^2 + (y1-y2)^2 <= (r1+r2)^2
        if( collision( sphere.position, playerMesh.position, sphere.r, bubble.radius ) ) {
            scene.remove(sphere);
            grow( sphere.r / 13 );
            delete spheres[key];

            if( !Object.keys(spheres).length ) {
                zoomTimer = 30;
            }
        }
    }
    gradientUniforms.color1.value.r += 0.001;

    if( zoomTimer ) {
        zoomTimer--;
        zoom( cameraData.zoom + 10 );

        if( !zoomTimer ) {
            sScale += 0.3;
            makeSpheres(sScale);
        }
    }
    //for ( var i = 0, il = spheres.length; i < il; i ++ ) {
        //var sphere = spheres[ i ];

        //sphere.position.x = 5000 * Math.cos( timer + i );
        //sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

    //}


    //bg.rotation.x += Math.sin( 50 * ( timer % 1 ) ) / 100;
    //console.log(Math.sin( 100 * ( timer % 1 ) ));
    //bg.rotation.y += 0.01;

    for ( var i = 0; i < bgGeometry.faces.length; i++ ) {
        face = bgGeometry.faces[ i ];
        // determine if current face is a tri or a quad
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        // assign color to each vertex of current face
        for( var j = 0; j < numberOfSides; j++ ) {
            face.vertexColors[ j ].b += 0.0001;
        }
    }
    bgGeometry.colorsNeedUpdate = true;

    mirrorCubeCamera.position.x = playerMesh.position.x;
    mirrorCubeCamera.position.y = playerMesh.position.y;
    mirrorCubeCamera.position.z = playerMesh.position.z + 200;

    playerMesh.visible = false;

    mirrorCubeCamera.updateCubeMap( renderer, scene );
    //renderer.render( scene, mirrorCubeCamera, renderTarget, true );

    playerMesh.visible = true;

    //renderer.clear();
    renderer.render( scene, camera );

};

var collision = function( position1, position2, radius1, radius2 ) {
    return Math.pow( position2.x - position1.x, 2 ) +  Math.pow( position1.y - position2.y, 2 ) <= Math.pow( radius1 + radius2, 2);
};

var grow = function( radius ) {
    bubble.radius += radius;
    bubble.scale = playerMesh.scale.x = playerMesh.scale.y = playerMesh.scale.z = bubble.radius / bubble.origRadius;
};

var udpateStageSize = function(x, y) {
    renderer.setSize( stage.width + inertia.x, stage.height + inertia.y );
    $container.css({
        width: stage.width + inertia.x + 'px',
        height: stage.height + inertia.y  + 'px'
    });
};

var keyListen = function(key) {
    Mousetrap.bind(key, function() {
        keysDown[key] = true;
    });
    Mousetrap.bind(key, function() {
        delete keysDown[key];
    }, 'keyup');
};

['right', 'left', 'up', 'down'].forEach(function(key) {
    keyListen(key);
});

$( window ).blur(function() {
    keysDown = {};
});

animate();

}());
