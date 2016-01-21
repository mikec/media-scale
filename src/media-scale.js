(function() {
    function MediaScale() { }

    MediaScale.getScaledDimensions =
    function(nativeDims, containerDims, options)
    {
        if(!options) options = {};
        var maxUpscale = options.maxUpscale >= 0 ?
                            options.maxUpscale : null;
        var cover = options.cover ? true : false;

        var nativeWidth = nativeDims[0];
        var nativeHeight = nativeDims[1];
        var containerWidth = containerDims[0];
        var containerHeight = containerDims[1];

        var aspect = nativeWidth / nativeHeight;
        var widthDiff = containerWidth - nativeWidth;
        var heightDiff = containerHeight - nativeHeight;
        var fitWidth;
        if(cover) {
            fitWidth = widthDiff > heightDiff;
        } else {
            fitWidth = Math.abs(widthDiff) < Math.abs(heightDiff);
        }

        var scaledWidth, scaledHeight;

        // check if the maxUpscale percentage will be exceeded,
        // and if it is then only upscale the image by the maxUpscale
        // percentage
        var exceededMax = false;
        if(maxUpscale > 0 && (widthDiff > 0 || heightDiff > 0)) {
            var upscalePercentage =
                    fitWidth ?
                        widthDiff / nativeWidth :
                        heightDiff / nativeHeight;
            if(upscalePercentage > maxUpscale) {
                exceededMax = true;
                scaledWidth = nativeWidth * (1 + maxUpscale);
                scaledHeight = nativeHeight * (1 + maxUpscale);
            }
        }

        // if the maxUpscale percentage wasn't exceeded, the upscale
        // to the full size of the container
        if(!exceededMax) {
            scaledWidth =
                    fitWidth ?
                        containerWidth : containerHeight * aspect;
            scaledHeight =
                    fitWidth ?
                        containerWidth / aspect : containerHeight;
        }

        return {
            width: scaledWidth,
            height: scaledHeight
        };
    };

    MediaScale.getBestPhoto = function(mediaOptions, optimalHeight) {
        return MediaScale.getBestMedia(mediaOptions, optimalHeight, 'photo');
    };

    MediaScale.getBestVideo = function(mediaOptions, optimalHeight) {
        return MediaScale.getBestMedia(mediaOptions, optimalHeight, 'video');
    };

    MediaScale.getBestMedia = function(mediaOptions, optimalHeight, mediaType) {
        var bestOptionIndex = NaN;
        var bestOptionDiff = NaN;
        var v = null;
        var supportedCodecs = {
            'h264': true,
            'webm': true
        };
        var hasTranscoded, hasSupportedCodec = false;
        for(var j in mediaOptions) {
            v = mediaOptions[j];
            if(!v.is_original) hasTranscoded = true;
            if(supportedCodecs[v.video_codec]) hasSupportedCodec = true;
        }
        for(var i in mediaOptions) {
            v = mediaOptions[i];
            if(mediaType && v.media_type !== mediaType) {
                continue;
            }
            if(mediaType === 'video') {
                if(hasTranscoded && v.is_original) {
                    continue;
                }
                if(hasSupportedCodec && !supportedCodecs[v.video_codec]) {
                    continue;
                }
            }
            var bestOption = (bestOptionIndex || bestOptionIndex === 0 ?
                    mediaOptions[bestOptionIndex] : null);
            var diff = v.height - optimalHeight;
            if((!bestOption) ||
               (bestOption.is_original && !v.is_original) ||
               (bestOptionDiff < 0 && diff > bestOptionDiff) ||
               (bestOptionDiff > 0 &&
                    diff < bestOptionDiff &&
                    diff > 0))
            {
                bestOptionIndex = parseInt(i);
                bestOptionDiff = diff;
            }
        }
        return (bestOptionIndex >= 0 ?
                    mediaOptions[bestOptionIndex] : null);
    };

    // returns the original media. if there is no original,
    // it returns the largest media
    MediaScale.getOriginalMedia = function(mediaOptions) {
        if(!mediaOptions || mediaOptions.length === 0) return null;
        var bestOptionIndex = NaN;
        var bestOptionsSize = 0;
        for(var i in mediaOptions) {
            var m = mediaOptions[i];
            if(m.is_original) {
                return m;
            }
            if(m.width > bestOptionsSize) {
                bestOptionsSize = m.width;
                bestOptionIndex = parseInt(i);
            }
        }
        return mediaOptions[bestOptionIndex];
    };

    if(typeof module === 'object') {
        module.exports = MediaScale;
    } else if (typeof window !== 'undefined') {
        if(typeof angular !== 'undefined') {
            angular.module('mikec', []).factory('MediaScale', function() {
                return MediaScale;
            });
        }
    }
    
})();
