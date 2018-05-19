function getParam(paramName) {
    paramValue = "", isFound = !1;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
}

function saveSticks() {

    console.log("[INFO] Save sticks.");

    var sticksStr = "";
    for (var i = 0; i < skull.sticks.length; i++) {
        
        sticksStr += "Vertex " + (i * 2 + 1) + " " + skull.sticks[i].startPt.x + " " + skull.sticks[i].startPt.y + " " + skull.sticks[i].startPt.z + "\n";
        var endPt_x = skull.sticks[i].startPt.x + skull.sticks[i].vec.x * skull.sticks[i].len;
        var endPt_y = skull.sticks[i].startPt.y + skull.sticks[i].vec.y * skull.sticks[i].len;
        var endPt_z = skull.sticks[i].startPt.z + skull.sticks[i].vec.z * skull.sticks[i].len;
        sticksStr += "Vertex " + (i * 2 + 2) + " " + endPt_x + " " + endPt_y + " " + endPt_z + "\n";

    }

    for (var i = 0; i < skull.sticks.length; i++) {
        sticksStr += "Edge " + (i * 2 + 1) + " " + (i * 2 + 2) + "\n";
    }

    // console.log(sticksStr);

    var fileName = "face_" + dataName["faceDataName"] + " skull_" + dataName["bodyDataName"] + " sticks_" + dataName["sticksDataName"] + ".txt";
    console.log(fileName);

    var blob = new Blob([sticksStr], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);

}