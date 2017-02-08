var Pipeline = require('../lib/dickens/pipeline');
var Knot = require('../lib/dickens/knot');

describe('When creating a pipeline with 2 knots', function () {
    var pipeline, knot1, knot2;
    var id1 = 'knot1';
    var id2 = 'knot2';
    var printError = function (code, obj) { console.log(code, obj); };
    before(function () {
        pipeline = new Pipeline('user1', 'my 1st pipeline');
        knot1 = new Knot(id1);
        knot2 = new Knot(id2);
        pipeline.addKnotAfter(knot1, null, printError);
        pipeline.addKnotAfter(knot2, knot1, printError);
    });

    it('should have 2 knots', function () {
        expect(pipeline.knotNum).equal(2);
    });

    it('should be of version 2', function () {
        expect(pipeline.knotNum).equal(2);
    });

    it('should have 1st knot with id ' + id1, function () {
        expect(pipeline.headKnotWrapper.knot.id).equal(id1);
    });

    it('should have 2nd knot with id ' + id2, function () {
        expect(pipeline.headKnotWrapper.next.knot.id).equal(id2);
    });

    describe('When removing the 2nd knot', function () {
        before(function () {
            pipeline.delKnot(knot2, printError);
        });
        it('should have 1 knot', function () {
            expect(pipeline.knotNum).equal(1);
        });
        it('should be of version 3', function () {
            expect(pipeline.version).equal(3);
        });
        it('should have 1st knot left', function () {
            expect(pipeline.headKnotWrapper.knot.id).equal(id1);
            expect(pipeline.headKnotWrapper.next).equal(null);
        });
    });
    describe('When removing the 1st knot', function () {
        before(function () {
            pipeline.delKnot(knot1, printError);
        });
        it('should have 0 knot', function () {
            expect(pipeline.knotNum).equal(0);
        });
        it('should be of version 4', function () {
            expect(pipeline.version).equal(4);
        });
        it('should have zero knot left', function () {
            expect(pipeline.headKnotWrapper).equal(null);
        });
    });
});

