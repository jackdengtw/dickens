var EventEmitter = require('events').EventEmitter,
    util = require('util');
var DickensError = require('./error');
var Knot = require('./knot');

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
    this.next = null;
}

Pipeline.prototype.addKnotAfter = function (knot, predecessor, error) {
    if (!(knot instanceof Knot)) {
        error(DickensError.WrongType, knot.constructor.name);
        return false;
    }
    if (knot == null) {
        error(DickensError.NullInput, 'knot');
        return false;
    }
    if (predecessor == null) {
        var tmp = this.headKnotWrapper;
        this.headKnotWrapper = new KnotWrapper(knot);
        this.headKnotWrapper.next = tmp;
        this._increaseMeta();
        return true;
    }
    var noop = false;
    var applied = this.iterate(this.headKnotWrapper, function (knotWrapper) {
        if (knotWrapper.knot.equals(predecessor)) {
            var child = knotWrapper.next;
            if (child != null && knot.equals(child.knot)) {
                noop = true;
                return true;
            }
            knotWrapper.next = new KnotWrapper(knot);
            knotWrapper.next.next = child;
            return true;
        }
        return false;
    },
        true);

    if (applied && !noop) {
        this._increaseMeta();
    }
    return applied;
}

Pipeline.prototype.addKnotBefore = function (knot, successor) {
}

Pipeline.prototype.delKnot = function (knot, error) {
    if (!(knot instanceof Knot)) {
        error(DickensError.WrongType, knot.constructor.name);
        return false;
    }
    if (knot == null) {
        error(DickensError.NullInput, 'knot');
        return false;
    }

    if (this.headKnotWrapper == null) {
        return false;
    }
    var applied = false;
    if (this.headKnotWrapper.knot.equals(knot)) {  // removing head
        var tmp = this.headKnotWrapper;
        this.headKnotWrapper = tmp.next;
        tmp.next = null;
        applied = true;
    }
    if (applied) {
        this._decreaseMeta();
        return applied;
    }

    applied = this.iterate(this.headKnotWrapper, function (knotWrapper) {
        if (knotWrapper.next.knot.equals(knot)) {
            var toDel = knotWrapper.next
            knotWrapper.next = toDel.next;
            toDel.next = null;
            return true;
        }
        return false;
    },
        true);

    if (applied) {
        this._decreaseMeta();
    }
    return applied;
}

Pipeline.prototype.iterate = function (knotWrapper, callback, once) {
    var applied = false;
    if (knotWrapper == null) {
        return applied;
    }
    var next = [knotWrapper];
    while (next.length > 0) {
        var n = next.shift();
        if (callback(n)) {  // return true values to indicate applied
            applied = true;
        }
        if (applied && once) {
            return applied;
        } else {
            next.concat(n.next);
        }
    }
    return applied;
}

Pipeline.prototype._increaseMeta = function () {
    this.knotNum++;
    this.version++;
    // signature update
}

Pipeline.prototype._decreaseMeta = function () {
    this.knotNum--;
    this.version++;
    // signature update
}

module.exports = Pipeline;

