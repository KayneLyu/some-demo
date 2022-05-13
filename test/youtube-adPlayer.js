var ytInitialPlayerResponse = null;
(function uniplayerVideoTagSetupScript () {
  var player;
  var activeConfig;
  var latestConfig;
  var autonavState;
  function fireEvent (target, name, detail) { target.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail })) }
  function createPlayer (config, webPlayerContextConfig) {
    var playerApi = document.getElementById("player");
    yt.player.Application.create(playerApi, config, webPlayerContextConfig);
    window["pis"] = "initialized";
    fireEvent(window, "player-initialized");
    var playerEl = playerApi.firstElementChild;
    playerEl.addEventListener("onStateChange", function (state) { fireEvent(playerEl, "player-state-change", { state: state }) });
    playerEl.addEventListener("onDetailedError", function (errorStateData) { fireEvent(playerEl, "player-detailed-error", { errorStateData: errorStateData }) });
    playerEl.addEventListener("onError", function (errorCode) { fireEvent(playerEl, "player-error", { errorCode: errorCode }) });
    playerEl.addEventListener("onPlayVideo", function (videoData) { fireEvent(playerEl, "on-play-autonav-video", { videoData: videoData }) });
    playerEl.addEventListener("onPlaylistPrevious", function () { fireEvent(playerEl, "on-play-previous-autonav-video") });
    playerEl.addEventListener("onFullscreenToggled", function (isCurrentlyFullscreen) { fireEvent(playerEl, "player-fullscreen-change", { isCurrentlyFullscreen: isCurrentlyFullscreen }) });
    playerEl.addEventListener("onAutoplayBlocked", function (data) { fireEvent(playerEl, "player-dom-paused") });
    playerEl.addEventListener("onYtShowToast", function (data) { fireEvent(playerEl, "yt-show-toast", data) });
    playerEl.addEventListener("innertubeCommand", function (data) { fireEvent(playerEl, "yt-innertube-command", data) });
    playerEl.addEventListener("updateKevlarOrC3Companion", function (data) { fireEvent(playerEl, "yt-update-c3-companion", data) });
    playerEl.addEventListener("onVideoDataChange", function (data) { fireEvent(playerEl, "video-data-change", data) });
    playerEl.addEventListener("onVideoProgress", function (data) { fireEvent(playerEl, "video-progress", data) });
    playerEl.addEventListener("onMutedAutoplayChange", function (isMutedAutoplay) { fireEvent(playerEl, "muted-autoplay-change", { isMutedAutoplay: isMutedAutoplay }) });
    playerEl.addEventListener("localmediachange", function (data) { fireEvent(playerEl, "local-media-change", data) });
    return playerEl
  }
  function getRawPlayerResponse (config) {
    if (config && config["args"] && config["args"]["raw_player_response"]) {
      return config["args"]["raw_player_response"];
    }
    return null
  }
  function updatePlayerConfig (config, webPlayerContextConfig, loadFromBlankConfig) {
    var hadPlayer = !!player;
    if (loadFromBlankConfig && !hadPlayer) {
      player = createPlayer(config, webPlayerContextConfig);
      return
    }
    if (!config) {
      if (player) player.stopVideo();
      return
    }
    if (player && config) {
      player.loadVideoByPlayerVars(config.args);
    } else {
      player = createPlayer(config, webPlayerContextConfig);
    }
    if (!hadPlayer && getRawPlayerResponse(config) == ytInitialPlayerResponse) {
      return;
    }
    player.playVideo()
  } 
  window.setAutonavStateInPlayer = function (newAutonavState) { 
    autonavState = newAutonavState; 
    if (player) {
      player.setAutonavState(autonavState)
    } 
  }; 
  window.getPlayer = function () { return player }; 
  window.destroyPlayer = function () { player = null }; 
  window.loadPlayerConfig = function (newConfig, watchNextResponse, unused_botguardData, webPlayerContextConfig, useRawPlayerResponse, loadFromBlankConfig) {
    latestConfig = newConfig; 
    window.whenPlayerReady(function () {
      if (latestConfig != newConfig) {
        return;
      } 
      if (loadFromBlankConfig && !player) { 
        updatePlayerConfig(latestConfig, webPlayerContextConfig, true); 
        return
      } 
      if (useRawPlayerResponse) { 
        if (getRawPlayerResponse(activeConfig) != getRawPlayerResponse(newConfig)) { 
          activeConfig = newConfig; 
          updatePlayerConfig(activeConfig, webPlayerContextConfig, false) 
        } 
      } else if (activeConfig != newConfig) {
        activeConfig = newConfig; 
        updatePlayerConfig(activeConfig, webPlayerContextConfig, false)
      } if (player) { 
        player.updateVideoData({ "raw_watch_next_response": watchNextResponse }); 
        player.setAutonavState(autonavState)
      }
    })
  }
})();
window.getPlayer().getAdState()