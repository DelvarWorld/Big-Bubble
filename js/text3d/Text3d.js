Bub.Text3d = function( options ) {
    this.initUpdaters();

    this.group = new THREE.Object3D();
    this.letters = [];
    this.offset = 0;
    this.scale = 1;

    var l = 0,
        text = options.text,
        kearning = 5,
        tally = 0,
        letter, char;

    for( l = 0; char = text.charAt( l++ ); ) {
        if( char === ' ') {
            tally += kearning * 5;
            continue;
        }
        letter = new Bub.Letter(_.extend( options, {
            letter: char
        }));
        this.letters.push( letter );
        this.group.add( letter.mesh );
        letter.offset = Bub.Utils.randInt( 2, 12 );
        letter.amplitude = Bub.Utils.randInt( 1, 3 );
        letter.mesh.position.x = tally;
        Bub.Offset.manage( letter.mesh );

        tally += letter.textWidth + kearning;
    }

    this.group.width = tally - kearning;
    this.group.position.y = Bub.camera.data.frustrum.max.y - 60;
    this.group.position.z = -300;

    this.center();

    Bub.trigger( 'textCreated', this );
};

_.extend( Bub.Text3d.prototype, Bub.Mixins.tweenable, Bub.Mixins.updatable );

Bub.Text3d.prototype.center = function() {
    this.group.position.x = -( this.scale * this.group.width ) / 2.0;
    return this;
};

Bub.Text3d.prototype.fitToScreen = function( options ) {
    options = options || {};

    var padding = options.padding || -5,
        scale = this.scale =( Bub.camera.data.frustrum.width - ( padding * 2 ) ) / this.group.width;

    this.group.scale = new THREE.Vector3( scale, scale, scale );

    return this.center();
};

Bub.Text3d.prototype.introduce = function() {
    var delay = 90,
        animateTime = 800,
        fadeTime = 300,
        duration = 3000,
        distance = 100,
        me = this,
        totalTime = duration + ( ( me.letters.length + 1 ) * delay ) + animateTime;
        
    _.each( this.letters, function( letter, index ) {
        letter.mesh.position.y += distance;

        if( 'map' in letter.mesh.material ) {
            letter.mesh.material.map.offset = new THREE.Vector2( 0, Bub.Utils.randFloat(0.1, -0.1) );
        }
        if( letter.mesh.material instanceof THREE.ShaderMaterial ) {
            letter.material.uniforms.opacity.value = 0;
        } else {
            letter.material.opacity = 0;
        }

        Bub.Game.timeout( index * delay, function() {
            if( 'map' in letter.mesh.material ) {
                letter.tween({ material: { offset: { x: 0, y: -0.5 }} }, totalTime );
            }

            if( letter.mesh.material instanceof THREE.ShaderMaterial ) {
                letter.tween({ shader: { opacity: 0.7 } }, fadeTime);
            } else {
                letter.tween({ opacity: 0.7 }, fadeTime);
            }
            letter.tween({
                position: {
                    z: letter.mesh.position.z - distance,
                    y: letter.mesh.position.y - distance
                }
            }, animateTime).easing( TWEEN.Easing.Cubic.Out );
            letter.tween({
                rotation: {
                    z: letter.mesh.rotation.z - Math.PI * 2,
                }
            }, animateTime).easing( TWEEN.Easing.Cubic.Out );
        });

        Bub.Game.timeout( duration + ( index * delay ), function() {
            if( letter.mesh.material instanceof THREE.ShaderMaterial ) {
                letter.tween({ shader: { opacity: 0 } }, fadeTime);
            } else {
                letter.tween({ opacity: 0 }, fadeTime);
            }
            letter.tween({
                position: {
                    z: letter.mesh.position.z - distance,
                    y: letter.mesh.position.y + distance
                }
            }, animateTime).easing( TWEEN.Easing.Cubic.Out );
            letter.tween({
                rotation: {
                    z: letter.mesh.rotation.z + Math.PI * 2,
                }
            }, animateTime).easing( TWEEN.Easing.Cubic.Out );
        });
    });

    Bub.Game.timeout( totalTime, function() {
        me.destroy();
    });

    Bub.camera.main.add( this.group );

    return this.fitToScreen();
};

Bub.Text3d.prototype.destroy = function() {
    Bub.camera.main.remove( this.group );
    _.each( this.letters, function( letter, index ) {
        Bub.Offset.free( letter );
    });
    Bub.trigger( 'textFree', this );
};

Bub.Text3d.prototype.updateFns = [{
    name: 'main',
    fn: function() {
        _.each( this.letters, function( letter, index ) {
            Bub.Offset.set( letter.mesh, new THREE.Vector3(
                letter.amplitude * Math.sin( new Date().getTime() / 400 + letter.offset ),
                letter.amplitude * Math.cos( new Date().getTime() / 400 + letter.offset ),
                0
            ));
        });
    }
}];
