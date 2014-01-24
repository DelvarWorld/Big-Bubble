(function() {

this.shaderParticleUtils = {

    /**
     * Given a base vector and a spread range vector, create
     * a new THREE.Vector3 instance with randomised values.
     *
     * @private
     *
     * @param  {THREE.Vector3} base
     * @param  {THREE.Vector3} spread
     * @return {THREE.Vector3}
     */
    randomVector3: function( base, spread ) {
        var v = new THREE.Vector3();

        v.copy( base );

        v.x += Math.random() * spread.x - (spread.x/2);
        v.y += Math.random() * spread.y - (spread.y/2);
        v.z += Math.random() * spread.z - (spread.z/2);

        return v;
    },

    /**
     * Create a new THREE.Color instance and given a base vector and
     * spread range vector, assign random values.
     *
     * Note that THREE.Color RGB values are in the range of 0 - 1, not 0 - 255.
     *
     * @private
     *
     * @param  {THREE.Vector3} base
     * @param  {THREE.Vector3} spread
     * @return {THREE.Color}
     */
    randomColor: function( base, spread ) {
        var v = new THREE.Color();

        v.copy( base );

        v.r += (Math.random() * spread.x) - (spread.x/2);
        v.g += (Math.random() * spread.y) - (spread.y/2);
        v.b += (Math.random() * spread.z) - (spread.z/2);

        v.r = Math.max( 0, Math.min( v.r, 1 ) );
        v.g = Math.max( 0, Math.min( v.g, 1 ) );
        v.b = Math.max( 0, Math.min( v.b, 1 ) );

        return v;
    },

    /**
     * Create a random Number value based on an initial value and
     * a spread range
     *
     * @private
     *
     * @param  {Number} base
     * @param  {Number} spread
     * @return {Number}
     */
    randomFloat: function( base, spread ) {
        return base + spread * (Math.random() - 0.5);
    },

    /**
     * Create a new THREE.Vector3 instance and project it onto a random point
     * on a sphere with randomized radius.
     *
     * @param  {THREE.Vector3} base
     * @param  {Number} radius
     * @param  {THREE.Vector3} radiusSpread
     * @param  {THREE.Vector3} radiusScale
     *
     * @private
     *
     * @return {THREE.Vector3}
     */
    randomVector3OnSphere: function( base, radius, radiusSpread, radiusScale, radiusSpreadClamp ) {
        var z = 2 * Math.random() - 1;
        var t = 6.2832 * Math.random();
        var r = Math.sqrt( 1 - z*z );
        var vec = new THREE.Vector3( r * Math.cos(t), r * Math.sin(t), z );

        var rand = this._randomFloat( radius, radiusSpread );

        if( radiusSpreadClamp ) {
            rand = Math.round( rand / radiusSpreadClamp ) * radiusSpreadClamp;
        }

        vec.multiplyScalar( rand );

        if( radiusScale ) {
            vec.multiply( radiusScale );
        }

        vec.add( base );

        return vec;
    },

    /**
     * Create a new THREE.Vector3 instance and project it onto a random point
     * on a disk (in the XY-plane) centered at `base` and with randomized radius.
     *
     * @param  {THREE.Vector3} base
     * @param  {Number} radius
     * @param  {THREE.Vector3} radiusSpread
     * @param  {THREE.Vector3} radiusScale
     *
     * @private
     *
     * @return {THREE.Vector3}
     */
    randomVector3OnDisk: function( base, radius, radiusSpread, radiusScale, radiusSpreadClamp ) {
        var t = 6.2832 * Math.random();
        var rand = this._randomFloat( radius, radiusSpread );

        if( radiusSpreadClamp ) {
            rand = Math.round( rand / radiusSpreadClamp ) * radiusSpreadClamp;
        }

        var vec = new THREE.Vector3( Math.cos(t), Math.sin(t), 0 ).multiplyScalar( rand );

        if ( radiusScale ) {
            vec.multiply( radiusScale );
        }

        vec.add( base );

        return vec ;
    },


    /**
     * Create a new THREE.Vector3 instance, and given a sphere with center `base` and
     * point `position` on sphere, set direction away from sphere center with random magnitude.
     *
     * @param  {THREE.Vector3} base
     * @param  {THREE.Vector3} position
     * @param  {Number} speed
     * @param  {Number} speedSpread
     * @param  {THREE.Vector3} scale
     *
     * @private
     *
     * @return {THREE.Vector3}
     */
    randomVelocityVector3OnSphere: function( base, position, speed, speedSpread, scale ) {
        var direction = new THREE.Vector3().subVectors( base, position );

        direction.normalize().multiplyScalar( Math.abs( this._randomFloat( speed, speedSpread ) ) );

        if( scale ) {
            direction.multiply( scale );
        }

        return direction;
    },



    /**
     * Given a base vector and a spread vector, randomise the given vector
     * accordingly.
     *
     * @param  {THREE.Vector3} vector
     * @param  {THREE.Vector3} base
     * @param  {THREE.Vector3} spread
     *
     * @private
     *
     * @return {[type]}
     */
    randomizeExistingVector3: function( v, base, spread ) {
        v.copy( base );

        v.x += Math.random() * spread.x - (spread.x/2);
        v.y += Math.random() * spread.y - (spread.y/2);
        v.z += Math.random() * spread.z - (spread.z/2);
    },


    /**
     * Randomize a THREE.Color instance and given a base vector and
     * spread range vector, assign random values.
     *
     * Note that THREE.Color RGB values are in the range of 0 - 1, not 0 - 255.
     *
     * @private
     *
     * @param  {THREE.Vector3} base
     * @param  {THREE.Vector3} spread
     * @return {THREE.Color}
     */
    randomizeExistingColor: function( v, base, spread ) {
        v.copy( base );

        v.r += (Math.random() * spread.x) - (spread.x/2);
        v.g += (Math.random() * spread.y) - (spread.y/2);
        v.b += (Math.random() * spread.z) - (spread.z/2);

        v.r = Math.max( 0, Math.min( v.r, 1 ) );
        v.g = Math.max( 0, Math.min( v.g, 1 ) );
        v.b = Math.max( 0, Math.min( v.b, 1 ) );
    },

    /**
     * Given an existing particle vector, project it onto a random point on a
     * sphere with radius `radius` and position `base`.
     *
     * @private
     *
     * @param  {THREE.Vector3} v
     * @param  {THREE.Vector3} base
     * @param  {Number} radius
     */
    randomizeExistingVector3OnSphere: function( v, base, radius, radiusSpread, radiusScale, radiusSpreadClamp ) {
        var z = 2 * Math.random() - 1,
            t = 6.2832 * Math.random(),
            r = Math.sqrt( 1 - z*z ),
            rand = this._randomFloat( radius, radiusSpread );

        if( radiusSpreadClamp ) {
            rand = Math.round( rand / radiusSpreadClamp ) * radiusSpreadClamp;
        }

        v.set(
            (r * Math.cos(t)) * rand,
            (r * Math.sin(t)) * rand,
            z * rand
        ).multiply( radiusScale );

        v.add( base );
    },


    /**
     * Given an existing particle vector, project it onto a random point
     * on a disk (in the XY-plane) centered at `base` and with radius `radius`.
     *
     * @private
     *
     * @param  {THREE.Vector3} v
     * @param  {THREE.Vector3} base
     * @param  {Number} radius
     */
    randomizeExistingVector3OnDisk: function( v, base, radius, radiusSpread, radiusScale, radiusSpreadClamp ) {
        var t = 6.2832 * Math.random(),
            rand = Math.abs( this._randomFloat( radius, radiusSpread ) );

        if( radiusSpreadClamp ) {
            rand = Math.round( rand / radiusSpreadClamp ) * radiusSpreadClamp;
        }

        v.set(
            Math.cos( t ),
            Math.sin( t ),
            0
        ).multiplyScalar( rand );

        if ( radiusScale ) {
            v.multiply( radiusScale );
        }

        v.add( base );
    },

    randomizeExistingVelocityVector3OnSphere: function( v, base, position, speed, speedSpread ) {
        v.copy(position)
            .sub(base)
            .normalize()
            .multiplyScalar( Math.abs( this._randomFloat( speed, speedSpread ) ) );
    },

    generateID: function() {
        var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        str = str.replace(/[xy]/g, function(c) {
            var rand = Math.random();
            var r = rand*16|0%16, v = c === 'x' ? r : (r&0x3|0x8);

            return v.toString(16);
        });

        return str;
    }
};

}());
;

// ShaderParticleGroup 0.7.0
//
// (c) 2013 Luke Moody (http://www.github.com/squarefeet) 
//     & Lee Stemkoski (http://www.adelphi.edu/~stemkoski/)
// 
// Based on Lee Stemkoski's original work: 
//    (https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/ParticleEngine.js).
//
// ShaderParticleGroup may be freely distributed under the MIT license (See LICENSE.txt)


function ShaderParticleGroup( options ) {
    var that = this;

    that.fixedTimeStep          = parseFloat( options.fixedTimeStep || 0.016 );

    // Uniform properties ( applied to all particles )
    that.maxAge                 = parseFloat( options.maxAge || 3 );
    that.texture                = options.texture || null;
    that.hasPerspective         = parseInt( typeof options.hasPerspective === 'number' ? options.hasPerspective : 1, 10 );
    that.colorize               = parseInt( options.colorize || 1, 10 );

    // Material properties
    that.blending               = typeof options.blending === 'number' ? options.blending : THREE.AdditiveBlending;
    that.transparent            = options.transparent || true;
    that.alphaTest              = options.alphaTest || 0.5;
    that.depthWrite             = options.depthWrite || false;
    that.depthTest              = options.depthTest || true;

    // Create uniforms
    that.uniforms = {
        duration:       { type: 'f',    value: that.maxAge },
        texture:        { type: 't',    value: that.texture },
        hasPerspective: { type: 'i',    value: that.hasPerspective },
        colorize:       { type: 'i',    value: that.colorize }
    };

    // Create a map of attributes that will hold values for each particle in this group.
    that.attributes = {
        acceleration:           { type: 'v3',   value: [] },
        velocity:               { type: 'v3',   value: [] },

        alive:                  { type: 'f',    value: [] },
        age:                    { type: 'f',    value: [] },

        sizeStart:              { type: 'f',    value: [] },
        sizeEnd:                { type: 'f',    value: [] },

        currentTile:            { type: 'f',    value: [] },

        angle:                  { type: 'f',    value: [] },
        angularVelocity:        { type: 'f',    value: [] },
        angleAlignVelocity:     { type: 'f',    value: [] },

        colorStart:             { type: 'c',    value: [] },
        colorMiddle:            { type: 'c',    value: [] },
        colorEnd:               { type: 'c',    value: [] },

        opacityStart:           { type: 'f',    value: [] },
        opacityMiddle:          { type: 'f',    value: [] },
        opacityEnd:             { type: 'f',    value: [] }
    };

    // Emitters (that aren't static) will be added to this array for
    // processing during the `tick()` function.
    that.emitters = [];

    // Create properties for use by the emitter pooling functions.
    that._pool = [];
    that._poolCreationSettings = null;
    that._createNewWhenPoolEmpty = 0;
    that.maxAgeMilliseconds = that.maxAge * 1000;

    // Create an empty geometry to hold the particles.
    // Each particle is a vertex pushed into this geometry's
    // vertices array.
    that.geometry = new THREE.Geometry();

    // Create the shader material using the properties we set above.
    that.material = new THREE.ShaderMaterial({
        uniforms:       that.uniforms,
        attributes:     that.attributes,
        vertexShader:   ShaderParticleGroup.shaders.vertex,
        fragmentShader: ShaderParticleGroup.shaders.fragment,
        blending:       that.blending,
        transparent:    that.transparent,
        alphaTest:      that.alphaTest,
        depthWrite:     that.depthWrite,
        depthTest:      that.depthTest
    });

    // And finally create the ParticleSystem. It's got its `dynamic` property
    // set so that THREE.js knows to update it on each frame.
    that.mesh = new THREE.ParticleSystem( that.geometry, that.material );
    that.mesh.dynamic = true;
}

ShaderParticleGroup.prototype = {

    /**
     * Tells the age and alive attributes (and the geometry vertices)
     * that they need updating by THREE.js's internal tick functions.
     *
     * @private
     *
     * @return {this}
     */
    _flagUpdate: function() {
        var that = this;

        // Set flags to update (causes less garbage than
        // ```ParticleSystem.sortParticles = true``` in THREE.r58 at least)
        that.attributes.age.needsUpdate = true;
        that.attributes.alive.needsUpdate = true;
        that.attributes.angle.needsUpdate = true;
        that.attributes.angleAlignVelocity.needsUpdate = true;
        that.attributes.currentTile.needsUpdate = true;
        that.attributes.velocity.needsUpdate = true;
        that.attributes.acceleration.needsUpdate = true;
        that.geometry.verticesNeedUpdate = true;

        return that;
    },


    /**
     * Add an emitter to this particle group. Once added, an emitter will be automatically
     * updated when ShaderParticleGroup#tick() is called.
     *
     * @param {ShaderParticleEmitter} emitter
     * @return {this}
     */
    addEmitter: function( emitter ) {
        var that = this;

        if( emitter.duration ) {
            emitter.numParticles = emitter.particlesPerSecond * (that.maxAge < emitter.emitterDuration ? that.maxAge : emitter.emitterDuration) | 0;
        }
        else {
            emitter.numParticles = emitter.particlesPerSecond * that.maxAge | 0;
        }

        emitter.numParticles = Math.ceil(emitter.numParticles);

        var vertices            = that.geometry.vertices,
            start               = vertices.length,
            end                 = emitter.numParticles + start,
            a                   = that.attributes,
            acceleration        = a.acceleration.value,
            velocity            = a.velocity.value,
            alive               = a.alive.value,
            age                 = a.age.value,
            sizeStart           = a.sizeStart.value,
            sizeEnd             = a.sizeEnd.value,
            angle               = a.angle.value,
            currentTile         = a.currentTile.value,
            angularVelocity     = a.angularVelocity.value,
            angleAlignVelocity  = a.angleAlignVelocity.value,
            colorStart          = a.colorStart.value,
            colorMiddle         = a.colorMiddle.value,
            colorEnd            = a.colorEnd.value,
            opacityStart        = a.opacityStart.value,
            opacityMiddle       = a.opacityMiddle.value,
            opacityEnd          = a.opacityEnd.value;

        emitter.particleIndex = parseFloat( start );

        // Create the values
        for( var i = start; i < end; ++i ) {

            if( emitter.type === 'sphere' ) {
                vertices[i]         = that._randomVector3OnSphere( emitter.position, emitter.radius, emitter.radiusSpread, emitter.radiusScale, emitter.radiusSpreadClamp );
                velocity[i]         = that._randomVelocityVector3OnSphere( vertices[i], emitter.position, emitter.speed, emitter.speedSpread );
            }
            else if( emitter.type === 'disk' ) {
                vertices[i]         = that._randomVector3OnDisk( emitter.position, emitter.radius, emitter.radiusSpread, emitter.radiusScale, emitter.radiusSpreadClamp );
                velocity[i]         = that._randomVelocityVector3OnSphere( vertices[i], emitter.position, emitter.speed, emitter.speedSpread );
            }
            else {
                vertices[i]         = that._randomVector3( emitter.position, emitter.positionSpread );
                velocity[i]         = that._randomVector3( emitter.velocity, emitter.velocitySpread );
            }

            acceleration[i]         = that._randomVector3( emitter.acceleration, emitter.accelerationSpread );


            sizeStart[i]            = that._randomFloat( emitter.sizeStart, emitter.sizeStartSpread );
            sizeEnd[i]              = emitter.sizeEnd;

            angle[i]                = that._randomFloat( emitter.angle, emitter.angleSpread );
            angularVelocity[i]      = that._randomFloat( emitter.angularVelocity, emitter.angularVelocitySpread );
            angleAlignVelocity[i]   = emitter.angleAlignVelocity ? 1.0 : 0.0;

            currentTile[i]          = emitter.currentTile;

            age[i]                  = 0.0;
            alive[i]                = emitter.isStatic ? 1.0 : 0.0;

            colorStart[i]           = that._randomColor( emitter.colorStart, emitter.colorStartSpread );
            colorMiddle[i]          = emitter.colorMiddle;
            colorEnd[i]             = emitter.colorEnd;
            opacityStart[i]         = emitter.opacityStart;
            opacityMiddle[i]        = emitter.opacityMiddle;
            opacityEnd[i]           = emitter.opacityEnd;
        }

        // Cache properties on the emitter so we can access
        // them from its tick function.
        emitter.verticesIndex   = parseFloat( start );
        emitter.attributes      = a;
        emitter.vertices        = that.geometry.vertices;
        emitter.maxAge          = that.maxAge;

        // Assign a unique ID to this emitter
        emitter.__id = that._generateID();

        // Save this emitter in an array for processing during this.tick()
        if( !emitter.isStatic ) {
            that.emitters.push( emitter );
        }

        return that;
    },


    removeEmitter: function( emitter ) {
        var id,
            emitters = this.emitters;

        if( emitter instanceof ShaderParticleEmitter ) {
            id = emitter.__id;
        }
        else if( typeof emitter === 'string' ) {
            id = emitter;
        }
        else {
            console.warn('Invalid emitter or emitter ID passed to ShaderParticleGroup#removeEmitter.' );
            return;
        }

        for( var i = 0, il = emitters.length; i < il; ++i ) {
            if( emitters[i].__id === id ) {
                // TODO: loop thru vertices and kill 'em!
                emitters.splice(i, 1);
                break;
            }
        }
    },


    /**
     * The main particle group update function. Call this once per frame.
     *
     * @param  {Number} dt
     * @return {this}
     */
    tick: function( dt ) {
        var that = this,
            emitters = that.emitters,
            numEmitters = emitters.length;

        dt = dt || that.fixedTimeStep;

        if( numEmitters === 0 ) {
            return;
        }

        for( var i = 0; i < numEmitters; ++i ) {
            emitters[i].tick( dt );
        }

        that._flagUpdate();
        return that;
    },


    /**
     * Fetch a single emitter instance from the pool.
     * If there are no objects in the pool, a new emitter will be
     * created if specified.
     *
     * @return {ShaderParticleEmitter | null}
     */
    getFromPool: function() {
        var that = this,
            pool = that._pool,
            createNew = that._createNewWhenPoolEmpty;

        if( pool.length ) {
            return pool.pop();
        }
        else if( createNew ) {
            return new ShaderParticleEmitter( that._poolCreationSettings );
        }

        return null;
    },


    /**
     * Release an emitter into the pool.
     *
     * @param  {ShaderParticleEmitter} emitter
     * @return {this}
     */
    releaseIntoPool: function( emitter ) {
        if( !(emitter instanceof ShaderParticleEmitter) ) {
            console.error( 'Will not add non-emitter to particle group pool:', emitter );
            return;
        }

        emitter.reset();
        this._pool.unshift( emitter );

        return this;
    },


    /**
     * Get the pool array
     *
     * @return {Array}
     */
    getPool: function() {
        return this._pool;
    },


    /**
     * Add a pool of emitters to this particle group
     *
     * @param {Number} numEmitters      The number of emitters to add to the pool.
     * @param {Object} emitterSettings  An object describing the settings to pass to each emitter.
     * @param {Boolean} createNew       Should a new emitter be created if the pool runs out?
     * @return {this}
     */
    addPool: function( numEmitters, emitterSettings, createNew ) {
        var that = this,
            emitter;

        // Save relevant settings and flags.
        that._poolCreationSettings = emitterSettings;
        that._createNewWhenPoolEmpty = !!createNew;

        // Create the emitters, add them to this group and the pool.
        for( var i = 0; i < numEmitters; ++i ) {
            emitter = new ShaderParticleEmitter( emitterSettings );
            that.addEmitter( emitter );
            that.releaseIntoPool( emitter );
        }

        return that;
    },


    /**
     * Internal method. Sets a single emitter to be alive
     *
     * @private
     *
     * @param  {THREE.Vector3} pos
     * @return {this}
     */
    _triggerSingleEmitter: function( pos ) {
        var that = this,
            emitter = that.getFromPool();

        if( emitter === null ) {
            console.log('ShaderParticleGroup pool ran out.');
            return;
        }

        // TODO: Should an instanceof check happen here? Or maybe at least a typeof?
        if( pos ) {
            emitter.position.copy( pos );
        }

        emitter.enable();

        setTimeout( function() {
            emitter.disable();
            that.releaseIntoPool( emitter );
        }, that.maxAgeMilliseconds );

        return that;
    },


    /**
     * Set a given number of emitters as alive, with an optional position
     * vector3 to move them to.
     *
     * @param  {Number} numEmitters
     * @param  {THREE.Vector3} position
     * @return {this}
     */
    triggerPoolEmitter: function( numEmitters, position ) {
        var that = this;

        if( typeof numEmitters === 'number' && numEmitters > 1) {
            for( var i = 0; i < numEmitters; ++i ) {
                that._triggerSingleEmitter( position );
            }
        }
        else {
            that._triggerSingleEmitter( position );
        }

        return that;
    }
};


// Extend ShaderParticleGroup's prototype with functions from utils object.
for( var i in shaderParticleUtils ) {
    ShaderParticleGroup.prototype[ '_' + i ] = shaderParticleUtils[i];
}


// The all-important shaders
ShaderParticleGroup.shaders = {
    vertex: [
        'uniform float duration;',
        'uniform int hasPerspective;',

        'attribute vec3 colorStart;',
        'attribute vec3 colorMiddle;',
        'attribute vec3 colorEnd;',
        'attribute float opacityStart;',
        'attribute float opacityEnd;',

        'attribute vec3 acceleration;',
        'attribute vec3 velocity;',
        'attribute float alive;',
        'attribute float age;',
        'attribute float sizeStart;',
        'attribute float sizeEnd;',
        'attribute float angle;',
        'attribute float angularVelocity;',
        'attribute float angleAlignVelocity;',
        'attribute float currentTile;',

        // values to be passed to the fragment shader
        'varying vec4 vColor;',
        'varying float vAngle;',
        'varying vec2 vTexCoord;',

        // Integrate acceleration into velocity and apply it to the particle's position
        'vec4 GetPos() {',
            'vec3 newPos = vec3( position );',

            // Move acceleration & velocity vectors to the value they
            // should be at the current age
            'vec3 a = acceleration * age;',
            'vec3 v = velocity * age;',

            // Move velocity vector to correct values at this age
            'v = v + (a * age);',

            // Add velocity vector to the newPos vector
            'newPos = newPos + v;',

            // Convert the newPos vector into world-space
            'vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );',

            'return mvPosition;',
        '}',


        'void main() {',

            'float positionInTime = (age / duration);',

            'float lerpAmount1 = (age / (0.5 * duration));', // percentage during first half
            'float lerpAmount2 = ((age - 0.5 * duration) / (0.5 * duration));', // percentage during second half
            'float halfDuration = duration / 2.0;',
            'vAngle = angle;',

            'float currentColumn = mod( currentTile, 5.0 );',
            'float currentRow = floor( currentTile / 5.0 );',

            'vTexCoord.x = currentColumn;',
            'vTexCoord.y = 4.0 - currentRow;',

            'if( alive > 0.5 ) {',

                // lerp the color and opacity
                'if( positionInTime < 0.5) {',
                    'vColor = vec4( mix(colorStart, colorMiddle, lerpAmount1), mix(opacityStart, opacityStart, lerpAmount1) );',
                '}',
                'else {',
                    'vColor = vec4( mix(colorMiddle, colorEnd, lerpAmount2), mix(opacityStart, opacityEnd, lerpAmount2) );',
                '}',

                // Get the position of this particle so we can use it
                // when we calculate any perspective that might be required.
                'vec4 pos = GetPos();',

                'if( angleAlignVelocity == 1.0 ) {',
                    'vAngle = -atan(pos.y - position.y, pos.x - position.x);',
                '}',
                'else {',
                    'vAngle = angle + ( angularVelocity * age );',
                '}',

                // Determine point size .
                'float pointSize = mix( sizeStart, sizeEnd, positionInTime );',

                'if( hasPerspective == 1 ) {',
                    'pointSize = pointSize * ( 300.0 / length( pos.xyz ) );',
                '}',

                // Set particle size and position
                'gl_PointSize = pointSize;',
                'gl_Position = projectionMatrix * pos;',
            '}',

            'else {',
                // Hide particle and set its position to the (maybe) glsl
                // equivalent of Number.POSITIVE_INFINITY
                'vColor = vec4( 0.0, 0.0, 0.0, 0.0 );',
                'gl_Position = vec4(1000000000.0, 1000000000.0, 1000000000.0, 0.0);',
            '}',
        '}',
    ].join('\n'),

    fragment: [
        'uniform sampler2D texture;',
        'uniform int colorize;',

        'varying vec4 vColor;',
        'varying float vAngle;',
        'varying vec2 vTexCoord;',

        'void main() {',
            'float c = cos(vAngle);',
            'float s = sin(vAngle);',

            'vec2 zoom = ( gl_PointCoord + vTexCoord ) * ( 1.0 / 5.0 );',

            'vec2 rotatedUV = vec2(c * (zoom.x - 0.5) + s * (zoom.y - 0.5) + 0.5,',
                                  'c * (zoom.y - 0.5) - s * (zoom.x - 0.5) + 0.5);',

            'vec4 rotatedTexture = texture2D( texture, ( rotatedUV ) );',

            'if( colorize == 1 ) {',
                'gl_FragColor = vColor * rotatedTexture;',
            '}',
            'else {',
                'gl_FragColor = rotatedTexture;',
            '}',
        '}'
    ].join('\n')
};
;

// ShaderParticleEmitter 0.7.0
//
// (c) 2013 Luke Moody (http://www.github.com/squarefeet) 
//     & Lee Stemkoski (http://www.adelphi.edu/~stemkoski/)
// 
// Based on Lee Stemkoski's original work: 
//    (https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/ParticleEngine.js).
//
// ShaderParticleEmitter may be freely distributed under the MIT license (See LICENSE.txt)

function ShaderParticleEmitter( options ) {
    // If no options are provided, fallback to an empty object.
    options = options || {};

    // Helps with minification. Not as easy to read the following code,
    // but should still be readable enough!
    var that = this;


    that.particlesPerSecond     = typeof options.particlesPerSecond === 'number' ? options.particlesPerSecond : 100;
    that.type                   = (options.type === 'cube' || options.type === 'sphere' || options.type === 'disk') ? options.type : 'cube';

    that.position               = options.position instanceof THREE.Vector3 ? options.position : new THREE.Vector3();
    that.positionSpread         = options.positionSpread instanceof THREE.Vector3 ? options.positionSpread : new THREE.Vector3();

    // These two properties are only used when this.type === 'sphere' or 'disk'
    that.radius                 = typeof options.radius === 'number' ? options.radius : 10;
    that.radiusSpread           = typeof options.radiusSpread === 'number' ? options.radiusSpread : 0;
    that.radiusScale            = options.radiusScale instanceof THREE.Vector3 ? options.radiusScale : new THREE.Vector3(1, 1, 1);
    that.radiusSpreadClamp      = typeof options.radiusSpreadClamp === 'number' ? options.radiusSpreadClamp : 0;

    that.acceleration           = options.acceleration instanceof THREE.Vector3 ? options.acceleration : new THREE.Vector3();
    that.accelerationSpread     = options.accelerationSpread instanceof THREE.Vector3 ? options.accelerationSpread : new THREE.Vector3();

    that.velocity               = options.velocity instanceof THREE.Vector3 ? options.velocity : new THREE.Vector3();
    that.velocitySpread         = options.velocitySpread instanceof THREE.Vector3 ? options.velocitySpread : new THREE.Vector3();


    // And again here; only used when this.type === 'sphere' or 'disk'
    that.speed                  = parseFloat( typeof options.speed === 'number' ? options.speed : 0.0 );
    that.speedSpread            = parseFloat( typeof options.speedSpread === 'number' ? options.speedSpread : 0.0 );

    that.sizeStart              = parseFloat( typeof options.sizeStart === 'number' ? options.sizeStart : 1.0 );
    that.sizeStartSpread        = parseFloat( typeof options.sizeStartSpread === 'number' ? options.sizeStartSpread : 0.0 );
    that.sizeEnd                = parseFloat( typeof options.sizeEnd === 'number' ? options.sizeEnd : that.sizeStart );

    that.currentTile            = 0;

    that.angle                  = parseFloat( typeof options.angle === 'number' ? options.angle : 0 );
    that.angleSpread            = parseFloat( typeof options.angleSpread === 'number' ? options.angleSpread : 0 );
    that.angleAlignVelocity     = options.angleAlignVelocity || false;

    that.angularVelocity        = parseFloat( typeof options.angularVelocity === 'number' ? options.angularVelocity : 0 );
    that.angularVelocitySpread  = parseFloat( typeof options.angularVelocitySpread === 'number' ? options.angularVelocitySpread : 0 );

    that.colorStart             = options.colorStart instanceof THREE.Color ? options.colorStart : new THREE.Color( 'white' );
    that.colorStartSpread       = options.colorStartSpread instanceof THREE.Vector3 ? options.colorStartSpread : new THREE.Vector3(0,0,0);
    that.colorEnd               = options.colorEnd instanceof THREE.Color ? options.colorEnd : that.colorStart.clone();
    that.colorMiddle            = options.colorMiddle instanceof THREE.Color ? options.colorMiddle :
        new THREE.Color().addColors( that.colorStart, that.colorEnd ).multiplyScalar( 0.5 );

    that.opacityStart           = parseFloat( typeof options.opacityStart !== 'undefined' ? options.opacityStart : 1 );
    that.opacityEnd             = parseFloat( typeof options.opacityEnd === 'number' ? options.opacityEnd : 0 );
    that.opacityMiddle          = parseFloat(
        typeof options.opacityMiddle !== 'undefined' ?
        options.opacityMiddle :
        Math.abs(that.opacityEnd + that.opacityStart) / 2
    );

    that.emitterDuration        = typeof options.emitterDuration === 'number' ? options.emitterDuration : null;
    that.alive                  = parseInt( typeof options.alive === 'number' ? options.alive : 1, 10 );

    that.isStatic               = typeof options.isStatic === 'number' ? options.isStatic : 0;

    that.isDynamic = options.dynamic || false;

    // The following properties are used internally, and mostly set when this emitter
    // is added to a particle group.
    that.numParticles           = 0;
    that.attributes             = null;
    that.vertices               = null;
    that.verticesIndex          = 0;
    that.age                    = 0.0;
    that.maxAge                 = 0.0;

    that.particleIndex = 0.0;

    that.__id = null;

    that.userData = {};
}

ShaderParticleEmitter.prototype = {

    /**
     * Reset a particle's position. Accounts for emitter type and spreads.
     *
     * @private
     *
     * @param  {THREE.Vector3} p
     */
    _resetParticle: function( i ) {
        var that = this,
            type = that.type,
            spread = that.positionSpread,
            particlePosition = that.vertices[i],
            a = that.attributes,
            particleVelocity = a.velocity.value[i],

            vSpread = that.velocitySpread,
            aSpread = that.accelerationSpread;

        // Optimise for no position spread or radius
        if(
            ( type === 'cube' && spread.x === 0 && spread.y === 0 && spread.z === 0 ) ||
            ( type === 'sphere' && that.radius === 0 ) ||
            ( type === 'disk' && that.radius === 0 )
        ) {
            particlePosition.copy( that.position );
            that._randomizeExistingVector3( particleVelocity, that.velocity, vSpread );

            if( type === 'cube' ) {
                that._randomizeExistingVector3( that.attributes.acceleration.value[i], that.acceleration, aSpread );
            }
        }

        // If there is a position spread, then get a new position based on this spread.
        else if( type === 'cube' ) {
            that._randomizeExistingVector3( particlePosition, that.position, spread );
            that._randomizeExistingVector3( particleVelocity, that.velocity, vSpread );
            that._randomizeExistingVector3( that.attributes.acceleration.value[i], that.acceleration, aSpread );
        }

        else if( type === 'sphere') {
            that._randomizeExistingVector3OnSphere( particlePosition, that.position, that.radius, that.radiusSpread, that.radiusScale, that.radiusSpreadClamp );
            that._randomizeExistingVelocityVector3OnSphere( particleVelocity, that.position, particlePosition, that.speed, that.speedSpread );
        }

        else if( type === 'disk') {
            that._randomizeExistingVector3OnDisk( particlePosition, that.position, that.radius, that.radiusSpread, that.radiusScale, that.radiusSpreadClamp );
            that._randomizeExistingVelocityVector3OnSphere( particleVelocity, that.position, particlePosition, that.speed, that.speedSpread );
        }

        if( that.isDynamic ) {
            that._checkValues( i );
        }
    },


    _checkValues: function( i ) {
        var that = this,
            a = that.attributes;

        // Size
        if( that.sizeStartSpread !== 0.0 || a.sizeStart.value[ i ] !== that.sizeStart ) {
            a.sizeStart.value[ i ] = that._randomFloat( that.sizeStart, that.sizeStartSpread );
            a.sizeStart.needsUpdate = true;
        }

        if( a.sizeEnd.value[ i ] !== that.sizeEnd ) {
            a.sizeEnd.value[ i ] = that.sizeEnd;
            a.sizeEnd.needsUpdate = true;
        }

        // Opacity
        if( a.opacityStart.value[ i ] !== that.opacityStart ) {
            a.opacityStart.value[ i ] = that.opacityStart;
            a.opacityStart.needsUpdate = true;
        }
        if( a.opacityMiddle.value[ i ] !== that.opacityMiddle ) {
            a.opacityMiddle.value[ i ] = that.opacityMiddle;
            a.opacityMiddle.needsUpdate = true;
        }
        if( a.opacityEnd.value[ i ] !== that.opacityEnd ) {
            a.opacityEnd.value[ i ] = that.opacityEnd;
            a.opacityEnd.needsUpdate = true;
        }

        // Angle
        if( a.angleAlignVelocity.value[ i ] !== that.angleAlignVelocity ) {
            a.angleAlignVelocity.value[ i ] = that.angleAlignVelocity ? 1.0 : 0.0;
            a.angleAlignVelocity.needsUpdate = true;
        }
        else if( !that.angleAlignVelocity && a.angle.value[ i ] !== that.angle ) {
            a.angle.value[ i ] = that.angle;
            a.angle.needsUpdate = true;
        }

        a.currentTile.value[ i ] = that.currentTile;
        a.currentTile.needsUpdate = true;
    },

    /**
     * Update this emitter's particle's positions. Called by the ShaderParticleGroup
     * that this emitter belongs to.
     *
     * @param  {Number} dt
     */
    tick: function( dt ) {

        if( this.isStatic ) {
            return;
        }

        // Cache some values for quicker access in loops.
        var that = this,
            a = that.attributes,
            alive = a.alive.value,
            age = a.age.value,
            start = that.verticesIndex,
            numParticles = that.numParticles,
            end = start + numParticles,
            pps = that.particlesPerSecond,
            ppsdt = pps * dt,
            m = that.maxAge,
            emitterAge = that.age,
            duration = that.emitterDuration,
            pIndex = that.particleIndex;

        // Loop through all the particles in this emitter and
        // determine whether they're still alive and need advancing
        // or if they should be dead and therefore marked as such.
        for( var i = start; i < end; ++i ) {
            if( alive[ i ] === 1.0 ) {
                age[ i ] += dt;
            }

            if( age[ i ] >= m ) {
                age[ i ] = 0.0;
                alive[ i ] = 0.0;
            }
        }

        // If the emitter is dead, reset any particles that are in
        // the recycled vertices array and reset the age of the
        // emitter to zero ready to go again if required, then
        // exit this function.
        if( that.alive === 0 ) {
            that.age = 0.0;
            return;
        }

        // If the emitter has a specified lifetime and we've exceeded it,
        // mark the emitter as dead and exit this function.
        if( typeof duration === 'number' && emitterAge > duration ) {
            that.alive = 0;
            that.age = 0.0;
            return;
        }

        var n = Math.max( Math.min( end, pIndex + ppsdt ), 0);

        for( i = pIndex | 0; i < n; ++i ) {
            if( alive[ i ] !== 1.0 ) {
                alive[ i ] = 1.0;
                that._resetParticle( i );
            }
        }

        that.particleIndex += ppsdt;

        if( that.particleIndex < 0.0 ) {
            that.particleIndex = 0.0;
        }

        if( pIndex >= start + that.numParticles ) {
            that.particleIndex = parseFloat( start );
        }

        // Add the delta time value to the age of the emitter.
        that.age += dt;

        if( that.age < 0.0 ) {
            that.age = 0.0;
        }
    },

    /**
     * Reset this emitter back to its starting position.
     * If `force` is truthy, then reset all particles in this
     * emitter as well, even if they're currently alive.
     *
     * @param  {Boolean} force
     * @return {this}
     */
    reset: function( force ) {
        var that = this;

        that.age = 0.0;
        that.alive = 0;

        if( force ) {
            var start = that.verticesIndex,
                end = that.verticesIndex + that.numParticles,
                a = that.attributes,
                alive = a.alive.value,
                age = a.age.value;

            for( var i = start; i < end; ++i ) {
                alive[ i ] = 0.0;
                age[ i ] = 0.0;
            }
        }

        return that;
    },


    /**
     * Enable this emitter.
     */
    enable: function() {
        this.alive = 1;
    },

    /**
     * Disable this emitter.
     */
    disable: function() {
        this.alive = 0;
    },


    _setRandomVector3Attribute: function( attr, base, spread ) {
        var that = this,
            start = that.verticesIndex,
            end = start + that.numParticles,
            alive = that.attributes.alive.value;

        spread = spread || new THREE.Vector3();

        for( var i = start; i < end; ++i ) {
            if( alive[ i ] === 0.0 ) {
                that._randomizeExistingVector3( attr.value[ i ], base, spread );
            }
        }
    },

    _setRandomColorAttribute: function( attr, base, spread ) {
        var that = this,
            start = that.verticesIndex,
            end = start + that.numParticles;

        spread = spread || new THREE.Vector3();

        for( var i = start; i < end; ++i ) {
            that._randomizeExistingColor( attr.value[ i ], base, spread );
        }
    },

    _setRandomFloatAttribute: function( attr, base, spread ) {
        var that = this,
            start = that.verticesIndex,
            end = start + that.numParticles,
            alive = that.attributes.alive.value;

        spread = spread || 0;

        for( var i = start; i < end; ++i ) {
            if( alive[ i ] === 0.0 ) {
                attr.value[ i ] = that._randomFloat( base, spread );
            }
        }
    },


    setOption: function( optionName, value ) {
        var that = this;


        if( typeof that.attributes[ optionName ] === 'undefined' && typeof that[ optionName ] === 'undefined' ) {
            console.log( "Won't set", optionName + ".", "Invalid property." );
            return;
        }

        if( that.attributes[ optionName ] ) {
            that[ optionName ] = value;

            if( typeof that[ optionName ] === 'number' ) {
                that._setRandomFloatAttribute(
                    that.attributes[ optionName ],
                    that[ optionName ],
                    that[ optionName + 'Spread' ]
                );
            }
            else if( that[ optionName ] instanceof THREE.Vector3 ) {
                that._setRandomVector3Attribute(
                    that.attributes[ optionName ],
                    that[ optionName ],
                    that[ optionName + 'Spread' ]
                );
            }
            else if( that[ optionName ] instanceof THREE.Color ) {
                that._setRandomColorAttribute(
                    that.attributes[ optionName ],
                    that[ optionName ],
                    that[ optionName + 'Spread' ]
                );
            }

            that.attributes[ optionName ].needsUpdate = true;
        }

        else if( that[ optionName ] ) {
            that[ optionName ] = value;

            if( optionName.indexOf( 'Spread' ) > -1 && that.type === 'cube' ) {
                var baseName = optionName.replace( 'Spread', '' );
                that.setOption( baseName, that[ baseName ] );
            }
        }

    }
};

// Extend ShaderParticleEmitter's prototype with functions from utils object.
for( var i in shaderParticleUtils ) {
    ShaderParticleEmitter.prototype[ '_' + i ] = shaderParticleUtils[i];
}
