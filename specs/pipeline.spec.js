var Pipeline = require('../lib/dickens/pipeline');
var Knot = require('../lib/dickens/knot');

describe('When creating a pipeline with 2 knots', function() {
    var pipeline, knot1, knot2;
    var id1 = 'knot1';
    var id2 = 'knot2';
    before(function() {
        pipeline = new Pipeline('user1', 'my 1st pipeline');
        knot1 = new Knot(id1);
        knot2 = new Knot(id2);
        pipeline.addKnotAfter(knot1, null);
        pipeline.addKnotAfter(knot2, knot1);
        console.log('testing ...');
    });

    it('should have 2 knots', function() {
        expect(pipeline.knotNum).equal(2);
    });

    it('should be of version 2', function() {
        expect(pipeline.knotNum).equal(2);
    });

    it('should have 1st knot with id' + id1, function() {
        expect(pipeline.headKnotWrapper.knot.id).equal(id1);
    });

    it('should have 2nd knot with id' + id2, function() {
        expect(pipeline.headKnotWrapper.nexts[0].knot.id).equal(id2);
    });
});

