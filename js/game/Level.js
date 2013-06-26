(function( global ) {

var Level = global.Level = Class.create({
    init: function() {
        this.index = -1;
    },

    levels: [{
        next: 10,
        zoom: 500,
        start: function() {
            Transitions.run('descend');
        }
    }, {
        next: 50,
        zoom: 600,
        start: function() {
            Transitions.run('maze');
        }
    }, {
        next: 80,
        zoom: 700,
        start: function() {
            Transitions.run('descend');
        }
    }, {
        next: 90,
        zoom: 800,
        start: function() {
            Transitions.end('forward');
        }
    }],
    reset: function() {
        this.init();
    },
    advance: function() {
        this.index++;
        this.level = this.levels[ this.index ];

        if( !this.level ) {
            this.levels[ this.index ] = $.extend({}, this.levels[ this.index - 1]);
            this.levels[ this.index ].next *= 1.5;
            this.levels[ this.index ].zoom += 100;
            this.level = this.levels[ this.index ];
        }

        if( this.level.start ) {
            this.level.start();
        }
    }
});

}(this));
