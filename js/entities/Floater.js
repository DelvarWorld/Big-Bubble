Bub.Floater = function() {
    this.entityify();
};

_.extend( Bub.Floater.prototype, Bub.Mixins.entity );

Bub.Floater.prototype.defaults = function() {
    return {
        fadeSpeed: 0.9,
        opacity: 0.5,
        state: null,
        phys: {
            friction: 0.01,
            mass: 10,
            velocity: new THREE.Vector3( 0, 0, 0 ),
            acceleration: new THREE.Vector3( 0, 0, 0 )
        }
    };
};

Bub.Floater.prototype.material = function() {
    return Bub.Shader.shaders.bubble();
};

Bub.Floater.prototype.geometry = new THREE.SphereGeometry( 0.5, 32, 32 );

Bub.Floater.prototype.loadGeometry = function() {
    return this.mesh = new THREE.Mesh( this.geometry );
};

Bub.Floater.prototype.load = function( options ) {
    this.mesh.material = this.material();
    options = options || {};

    var radius = options.radius || 10 + 5 * Math.random(),
        frustrum = Bub.camera.data.frustrum;

    this.mesh.position = options.position;
    this.inertia = options.inertia || new THREE.Vector3(
        0, -100 - ( Math.random() ), 0
    );

    this.scaleTo( radius * 2 );
    this.r = radius;

    Bub.trigger( 'initted', this );
};

Bub.Floater.prototype.updateFns = [{
    name: 'move',
    fn: function() {
        this.updateLocks();
        this.mesh.lookAt( Bub.camera.main.position );

        if ( this.mesh.position.y + this.r * 2 < Bub.camera.data.frustrum.min.y ) {
            Bub.trigger( 'free', this );
        }
    }
}, {
    name: 'fade',
    fn: function() {
        if( this.mesh.material.opacity < this.opacity ) {
            this.mesh.material.opacity += Bub.Utils.speed( this.fadeSpeed );
        }
    }
}, {
    name: 'collision',
    fn: function() {
        if( Bub.player.isCollidingWith( this ) ) {
            this.lockTo( Bub.player );

            this.setLockDistance( Bub.player, this.r );

            this.replaceUpdater( 'move', function() {

                this.mesh.material.uniforms.c.value += Bub.Utils.speed( 0.2 );
                this.speedLockTowards( Bub.player, 4 );
                this.mesh.lookAt( Bub.camera.main.position );

                if( new Date() - this.lockTime > 1600 ) {
                    Bub.trigger( 'free', this );

                    Bub.player.grow( this.r );
                    Bub.player.ripple( this, 1 + this.r );

                    if( Bub.player.build.radius > Bub.Level.level.next ) {
                        Bub.Level.advance();
                    }
                }
            });
            this.replaceUpdater( 'collision', function() {} );
            this.replaceUpdater( 'phys', function() {} );
        }
    }
}];
