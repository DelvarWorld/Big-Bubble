Bub.Fireball = function() {
    this.entityify();
};

_.extend( Bub.Fireball.prototype, Bub.Mixins.entity );

Bub.Fireball.prototype.defaults = function() {
    return {
        // todo: player and this use this silly scale system, divided by orig
        // radius. We should just set starting radius to 1 and go from there
        // for everything?
        build: {
            scale: 1,
            radius: 80
        },
        phys: {
            friction: 0,
            mass: 100,
            velocity: new THREE.Vector3( 0, 0, 0 ),
            acceleration: new THREE.Vector3( 0, 0, 0 )
        }
    };
};

Bub.Fireball.prototype.material = function() {
    return Bub.Shader.shaders.fireball();
};

Bub.Fireball.prototype.geometry = new THREE.SphereGeometry( 0.5, 32, 32 );

Bub.Fireball.prototype.duration = 10000;

Bub.Fireball.prototype.points = 100;

Bub.Fireball.prototype.loadGeometry = function() {
    return this.mesh = new THREE.Mesh( this.geometry, this.material() );
};

// todo: load is a dumb thing along with init and loadgeometry
Bub.Fireball.prototype.load = function( options ) {
    options = options || {};

    var radius = options.radius || 10 + 5 * Math.random();
    this.mesh.position = options.position;

    this.inertia = options.inertia || new THREE.Vector3(
        0, -100 - ( Math.random() ), 0
    );

    this.scale( radius );
    this.r = radius;

    Bub.trigger( 'initted', this );
};

Bub.Fireball.prototype.updateFns = [{
    name: 'move',
    fn: function() {
        this.mesh.rotation.x -= Bub.Utils.speed( 1.1 );

        if ( this.mesh.position.y + this.r * 2 < Bub.camera.data.frustrum.min.y ) {
            Bub.trigger( 'free', this );
        }
    }
}, {
    name: 'collision',
    fn: function() {
        if( Bub.player.isCollidingWith( this ) ) {
            var text = new Bub.Text3d({
                text: 'Fire Bubble!',
                material: Bub.Shader.shaders.fireball()
            });
            text.introduce();
            Bub
                .trigger( 'fireup', this )
                .trigger( 'free', this )
                .trigger( 'points', this.points );
        }
    }
}];

Bub.Fireball.prototype.scale = function( radius ) {
    this.build.radius = radius;
    var scale = this.build.scale = radius * 2;
    this.mesh.scale.set( scale, scale, scale );

    if( 'diameter' in this.mesh.material.uniforms ) {
        this.mesh.material.uniforms.diameter.value = this.build.scale;
    }
};

Bub.Fireball.floaterScale = 3.5;
