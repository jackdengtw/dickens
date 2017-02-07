var EventEmitter = require('events').EventEmitter,
        util = require('util');

function Pipeline(userId, name) {
    EventEmitter.call(this);
    this.userId = userId;
    this.name = name; // [A-Za-z0-9 -_]
    this.headKnotWrapper = null;
    this.knotNum = 0;
    this.version = 0;
    // this.signature = '';
}

util.inherits(Pipeline, EventEmitter);

function KnotWrapper(knot) {
    this.knot = knot;
    this.nexts = [];
}

Pipeline.prototype.addKnotAfter = function(knot, predecessor) {
    if (predecessor == null) {
        this.headKnotWrapper = new KnotWrapper(knot);
        this._updateMeta();
        return true;
    }
    var applied = this.iterate(this.headKnotWrapper, function(knotWrapper){
        if(knotWrapper.knot.equals(predecessor)) {
            var tmp;
            tmp = knotWrapper.nexts;
            knotWrapper.nexts = [new KnotWrapper(knot)];
            knotWrapper.nexts[0].nexts = tmp;
            return true;
        }
        return false;
    },
    true);

    if(applied) {
        this._updateMeta();
    }
    return applied;
}

Pipeline.prototype.addKnotBefore = function(knot, successors) {
}

Pipeline.prototype.delKnot = function(knot) {
    this.version ++;
    // signature update
}

Pipeline.prototype.iterate = function(knotWrapper, callback, once) {
    var applied = false;
    if(knotWrapper == null) {
        return applied;
    }
    var nexts = [knotWrapper];
    while(nexts.length > 0) {
        var n = nexts.shift();
        if(callback(n)) {  // return true values to indicate applied
            applied = true;
        }
        if(applied && once) {
            return applied;
        } else {
            nexts.concat(n.nexts);
        }
    }
    return applied;
}

Pipeline.prototype._updateMeta = function() {
    this.knotNum ++;
    this.version ++;
    // signature update
}

module.exports = Pipeline;

