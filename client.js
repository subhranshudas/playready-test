// GLOBALS
var proxyServer = 'http://localhost:3000/playready';

var mediaTypes = {
    mssStaging1: {
        manifestURL: 'http://fvt.verizon.net/movies/ss/HVAB1432111723669451_SS/Run_All_Night15MSV_TVN_WARNF6074.ism/Manifest',
        customData: '<MSVApp><Event>ISSUEPLAYREADYLICENSE</Event><tokenID></tokenID><User><strUserID>resc4l8u</strUserID><strDomain>DNET</strDomain></User><TransactionInfo><strTransactionID>73fc4004-fb17-4759-b05e-01e521d06689</strTransactionID><strAccessPoint>CP000</strAccessPoint></TransactionInfo><productID>613872</productID><purchaseID>E9EFC311-471F-4F18-97D7-68891FA36F32</purchaseID><deviceID>14012020169306101452</deviceID><mediaFormat>SMOOTH_HD</mediaFormat><eRentalLicenseType>WATCH_NOW</eRentalLicenseType><assetPK>999999</assetPK><profilePK>207050</profilePK><drmAuthToken>672c204e-c5d8-4fec-9587-11778abd7eac</drmAuthToken></MSVApp>'
    },
    mssWeb: {
        manifestURL: 'http://playready.directtaps.net/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/Manifest'
    },
    mpegDash: {
        manifestURL: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd'
    }
}

var isSmoothStreaming = function(url) {
    return url.indexOf('.ism') !== -1;
}

var forceCDMFlow = function() {
    if (HTMLVideoElement.prototype.msSetMediaKeys) {
        navigator.requestMediaKeySystemAccess = undefined;
        HTMLVideoElement.prototype.setMediaKeys = undefined;
        console.log('CDMData Flow Forced...');
    }
}

var selectedOption = 'mssStaging1';
var manifest = mediaTypes[selectedOption]['manifestURL'];
var cdmData = mediaTypes[selectedOption]['customData'];

$(function () {
    //DOM JQUERY NODES
    var $load = $("#load");
    var $loadingPanel = $("#loadingPanel");
    var $videoListPanel = $("#videoListPanel");
    var $videoList = $("#videoList");
    var $videoPlayerPanel = $("#videoPlayerPanel");
    var $videoPlayer = $("#videoPlayer");
    var $captionsDiv = $("#captions-div");
     
    function playVideo(url, cdmData) {

        if(isSmoothStreaming(url)) {
            // do this only in case of MSS and nothing
            console.log('Smooth Streaming detected: going for CDMData Flow...');
            forceCDMFlow();
        }

        // Player initialization code
        var player = dashjs.MediaPlayer().create();
        player.initialize();
        player.attachView($videoPlayer[0]);
        player.attachVideoContainer($videoPlayerPanel[0]);
        player.setAutoPlay(true);

        if(cdmData && cdmData.length > 0) { // only if needed for test player
            // SET DRM OPTIONS
            player.setProtectionData({
                "com.microsoft.playready": {
                    "serverURL": proxyServer,
                    "cdmData": cdmData
                }
            });
        }

        player.attachSource(url);

        // Captions Code
        player.attachTTMLRenderingDiv($captionsDiv[0]);
        var controlbar = new ControlBar(player);
        controlbar.initialize();
    }


    // SELECT THE TYPE OF MEDIA TO BE PLAYED
    $("#mediaTypes").change(function(e){
        selectedOption = e.target.value;
        manifest = mediaTypes[selectedOption]['manifestURL'];
        cdmData = mediaTypes[selectedOption]['customData'];
    });

    $("#load").click(function(e){
        if(manifest.length > 0) {
            playVideo(manifest, cdmData);
        }
    });
   

});