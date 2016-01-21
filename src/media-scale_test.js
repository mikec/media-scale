var mockMediaSizeData = require('../mock/mock-media-size-data');
var MediaScale = require('./media-scale');
var expect = require('chai').expect;

describe('MediaScale', function() {

    describe('getting best media when requested size is equal to ' +
        'one of the media sizes', function() {

        it('should return the media size with the height equal to the ' +
            'requested size', function() {
            var m = MediaScale.getBestMedia(mockMediaSizeData[0], 375);
            expect(m.height).to.equal(375);
        });

    });

    describe('getting best media when requested size is slightly ' +
        'greater than one of the media sizes', function() {

        it('should return the next media size up to avoid ' +
                'downscaling', function() {
            var m = MediaScale.getBestMedia(mockMediaSizeData[0], 376);
            expect(m.height).to.equal(480);
        });

    });

    describe('getting best media when requested size is slightly ' +
        'less than one of the media sizes', function() {

        it('should return the next media size up', function() {
            var m = MediaScale.getBestMedia(mockMediaSizeData[0], 479);
            expect(m.height).to.equal(480);
        });

    });

    describe('getting best media when requested size is greater than ' +
        'the largest media size', function() {

        it('should return the larget media size', function() {
            var m = MediaScale.getBestMedia(mockMediaSizeData[0], 2000);
            expect(m.height).to.equal(1600);
        });

    });

    describe('getting best media when requested size is less than ' +
        'the smallest media size', function() {

        it('should return the smallest media size', function() {
            var m = MediaScale.getBestMedia(mockMediaSizeData[0], 10);
            expect(m.height).to.equal(75);
        });

    });

    describe('getting best media when only one size is available',
    function() {

        describe('and requested size is less than the avaiable size',
        function() {

            it('should return the media size that is available',
            function() {
                var m = MediaScale.getBestMedia(mockMediaSizeData[1], 1);
                expect(m.height).to.equal(75);
            });

        });

        describe('and requested size is greater than the avaiable size',
        function() {

            it('should return the media size that is available',
            function() {
                var m =
                    MediaScale.getBestMedia(mockMediaSizeData[1], 1000);
                expect(m.height).to.equal(75);
            });

        });

    });

    describe('getting bestMedia when no sizes are available',
    function() {

        it('should return null', function() {
            var m = MediaScale.getBestMedia([], 1000);
            expect(m).to.equal(null);
        });

    });

    describe('getScaledDimensions for a tall image', function() {

        it('should return dimensions that fit to the container height', function() {
            var dims = MediaScale.getScaledDimensions([25, 100], [150, 150]);
            expect(dims.height).to.equal(150);
            expect(dims.width).to.equal(37.5);
        });

    });

    describe('getScaledDimensions for a wide image', function() {

        it('should return dimensions that fit to the container width', function() {
            var dims = MediaScale.getScaledDimensions([100, 25], [150, 150]);
            expect(dims.height).to.equal(37.5);
            expect(dims.width).to.equal(150);
        });

    });

    describe('getScaledDimensions for a tall image that should ' +
                'cover the container',
    function() {

        it('should return dimensions that fit to the container width', function() {
            var dims = MediaScale
                        .getScaledDimensions(
                            [156, 277], [168, 168], { cover: true });
            expect(dims.width).to.equal(168);
        });

    });

    describe('getScaledDimensions for a wide image that should ' +
                'cover the container',
    function() {

        it('should return dimensions that fit to the container height', function() {
            var dims = MediaScale
                        .getScaledDimensions(
                            [277, 156], [168, 168], { cover: true });
            expect(dims.height).to.equal(168);
        });

    });

    describe('getScaledDimensions for an image with maxUpscale set', function() {

        it('should not scale the image beyond the maxUpscale percentage',
        function() {
            var dims = MediaScale
                        .getScaledDimensions(
                            [50, 50], [150, 150], { maxUpscale: 1 });
            expect(dims.height).to.equal(100);
            expect(dims.width).to.equal(100);
        });

    });

    describe('getScaledDimensions for an image with maxUpscale set', function() {

        it('should not scale the image beyond the maxUpscale percentage',
        function() {
            var dims = MediaScale
                        .getScaledDimensions(
                            [50, 50], [150, 150],
                            { maxUpscale: 1 , cover: true });
            expect(dims.height).to.equal(100);
            expect(dims.width).to.equal(100);
        });

    });

    describe('getting best photo (no video) ', function() {

        it('should not return a video', function() {
            var m = MediaScale.getBestPhoto(mockMediaSizeData.video_0, 100);
            expect(m.media_type).to.equal('photo');
        });

    });

    describe('getting best video (no photo) ', function() {

        it('should not return a photo', function() {
            var m = MediaScale.getBestVideo(mockMediaSizeData.video_1, 100);
            expect(m.media_type).to.equal('video');
        });

    });

    describe('getting video with original and transcoded sizes', function() {

        it('should always return the transcoded size', function() {
            var m = MediaScale.getBestVideo(mockMediaSizeData.video_original_vs_transcoded, 1400);
            expect(m.is_original).to.equal(false);
        });

    });

    describe('getting video with supported and unsupported codecs', function() {

        it('should always return the size with the supported codec', function() {
            var m = MediaScale.getBestVideo(mockMediaSizeData.video_unsupported_codec, 1400);
            expect(m.video_codec).to.equal('h264');
        });

    });

    describe('getting original media', function() {

        it('should return the original media', function() {
            var m = MediaScale.getOriginalMedia(mockMediaSizeData.original);
            expect(m.width).to.equal(1200);
        });

        describe('when no original media is available', function() {

            it('should return the largest media', function() {
                var m = MediaScale.getOriginalMedia(mockMediaSizeData.no_original);
                expect(m.width).to.equal(1200);
            });

        });

    });

});
