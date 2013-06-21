(function( global ) {

var Transition = global.Transition = Class.create({
    run: function( id ) {
        var trans = Transition.transitions[ id ];

        World.transition = function() {
            trans.loop();
        };
        trans.start();
    },

    end: function( id ) {
        var trans =  Transition.transitions[ id ];
        delete World.transition;
        trans.end();
    },

    transitions: {
        descend: {
            start: function() {
            },
            end: function() {
                Thing.eachThing(function( thing ) {
                    if( thing.inertia.y !== 0 ) {
                        thing.inertia.y += 0.03;
                        thing.inertia.z += 1;
                    }
                    if( thing.inertia.y > -0.03 ) {
                        thing.inertia.y = 0;
                    }
                });
            },
            loop: function() {
                var rand = Math.random();

                if( rand > 0.993 ) {
                    Thing.makeEntity('mine', {
                        radius: 0.5 + Math.random() * 0.1
                    });
                } else if( rand > 0.97 ) {
                    Thing.makeEntity('floater', {
                        radius: 10 + Math.random() * 10
                    });
                }
            }
        },

        forward: {
            initBind: function( thing ) {
                if( thing.type === 'floater' ) {
                    thing.fadeSpeed = 0.05;

                    thing.mesh.position.x = Utils.randFloat( Camera.data.frustrum.min.x, Camera.data.frustrum.max.x );
                    thing.mesh.position.y = Utils.randFloat( Camera.data.frustrum.min.y, Camera.data.frustrum.max.y );
                    thing.mesh.position.z = -1000;
                    thing.inertia = new THREE.Vector3( 0, 0, 100 - ( Math.random() ) );

                    thing.replaceUpdater( 'fade', function() {
                        var zPos = thing.mesh.position.z;

                        if( zPos > 0 ) {
                            thing.mesh.material.opacity -= Utils.speed( 0.5 );

                            if( thing.mesh.material.opacity <= 0 ) {
                                Game.trigger( 'free', thing );
                            }
                        } else {
                            thing.mesh.material.opacity = 0.5 - ((-1 * zPos) / 1000) * 0.5;

                            if( zPos > -300 ) {
                                this.mesh.material.color.g += Utils.speed( 0.1 );
                            }
                        }
                        
                    });
                } else if( thing.type === 'mine' ) {

                    thing.fadeSpeed = 0.05;
                    thing.mesh.position.x = Utils.randFloat( Camera.data.frustrum.min.x, Camera.data.frustrum.max.x );
                    thing.mesh.position.y = Utils.randFloat( Camera.data.frustrum.min.y, Camera.data.frustrum.max.y );
                    thing.mesh.position.z = -1000;
                    thing.inertia = new THREE.Vector3( 0, 0, 100 - ( Math.random() ) );

                    thing.replaceUpdater( 'fade', function() {
                        var zPos = thing.mesh.position.z;

                        if( zPos > 0 ) {
                            thing.mesh.material.opacity -= Utils.speed( 0.5 );

                            if( thing.mesh.material.opacity <= 0 ) {
                                Game.trigger('free', thing);
                            }
                        } else {
                            thing.mesh.material.opacity = 0.5 - ((-1 * zPos) / 1000) * 0.5;

                            if( zPos > -200 ) {
                                this.mesh.material.color.r += Utils.speed( 0.01 );
                            }
                        }
                        
                    });
                }
            },
            start: function() {
                Game.bind( 'initted', this.initBind );
            },
            end: function() {
                Game.unbind( 'initted', this.initBind );
            },
            loop: function() {
                var rand = Math.random();

                if( rand > 0.993 ) {
                    Thing.makeEntity('mine', {
                        radius: 0.5 + Math.random() * 0.1
                    });
                } else if( rand > 0.9 ) {
                    Thing.makeEntity('floater', {
                        radius: 20
                    });
                }

                Thing.eachThing(function( thing ) {
                    if( thing.inertia.y !== 0 ) {
                        thing.inertia.y += 0.03;
                        thing.inertia.z += 1;
                    }
                    if( thing.inertia.y > -0.03 ) {
                        thing.inertia.y = 0;
                    }
                });
            }
        },

        maze: {
            initBind: function( thing ) {
                //if( thing.type === 'floater' ) {
                //} else if( thing.type === 'mine' ) {
                //}
            },
            start: function() {
                Game.bind( 'initted', this.initBind );

                this.cameraInertia = new THREE.Vector3( 0, 0, 0 );
                this.maze = Factory.maze();
                this.maze.inertia.y = -2.8;
            },
            end: function() {
                Game.unbind( 'initted', this.initBind );
            },
            loop: function() {
                var originPoint = Player.mesh.position.clone(),
                    bottomHit, bottomDist, backHit, i, vertex, directionVector, ray, collisionResults;

                for( i = 0; vertex = Player.vertices.bottom[ i++ ]; ) {
                    directionVector = vertex.clone().applyMatrix4( Player.mesh.matrix ).sub( Player.mesh.position );
                    
                    ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
                    collisionResults = ray.intersectObjects( this.maze.tops );

                    if ( collisionResults.length && collisionResults[0].distance < directionVector.length() ) {
                        bottomHit = true;
                        bottomDist = collisionResults[0].distance;
                        break;
                    }
                }

                for( i = 0; vertex = Player.vertices.back[ i++ ]; ) {
                    directionVector = vertex.clone().applyMatrix4( Player.mesh.matrix ).sub( Player.mesh.position );
                    
                    ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
                    collisionResults = ray.intersectObjects( this.maze.sides );
                    if ( collisionResults.length && collisionResults[0].distance < directionVector.length() ) {
                        backHit = true;
                        break;
                    }
                }

                if( bottomHit ) {
                    this.maze.inertia.z = 0;
                    this.maze.group.position.z -= ( Player.build.radius - bottomDist );
                } else {
                    this.maze.inertia.z += 0.10;
                }

                if( this.maze.group.position.z > 2000 &&  this.maze.inertia.z > 19 ) {
                    Level.advance();
                }

                if( backHit && Player.phys.inertia.y < 0 ) {
                    Player.phys.inertia.y = 0;
                }
                this.maze.group.position.y += this.maze.inertia.y;
                this.maze.group.position.z += this.maze.inertia.z;
                Player.mesh.position.y += this.maze.inertia.y;

                if( Player.mesh.position.x < Camera.main.position.x - 50 ) {
                    this.cameraInertia.x -= 0.1;
                } else if( Player.mesh.position.x > Camera.main.position.x + 50 ) {
                    this.cameraInertia.x += 0.1;
                } else if( this.cameraInertia.x ) {
                    this.cameraInertia.x += -Utils.sign( this.cameraInertia.x ) * 0.1;

                    if( Math.abs( this.cameraInertia.x ) <= 0.1 ) {
                        this.cameraInertia.x = 0;
                    }
                }

                Utils.cap( this.cameraInertia, 3.4 );
                Camera.pan( this.cameraInertia );
            }
        }
    }
});

}(this));
