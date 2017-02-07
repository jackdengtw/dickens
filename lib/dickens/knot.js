function Knot(id) {
    this.id = id;
}

Knot.prototype.equals = function(knot) {
    return this.id === knot.id;
}

module.exports = Knot;
