var web_version = "EP.S1.04.24.17.10";
var file_prefix = "HCB";
var vendor = "Entrypass";
var vendor_footer =
  '<a href="http://www.entrypass.net" target="_blank">EntryPass</a> Corp. (M) SDN. BHD.';
var vendor_header = 'ENTRY<span class="style6">PASS</span>';
var ColdStartTimeout = 20000;
var user_id = "ADMIN";
var login_page = "2login.htm";
var loginChk_page = "3loginChk.htm";
var menu_page = "8menu.htm";
var keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var login_debug = 0;
var ShowStatusTimeout = 5000;
function initDHTML() {
  init();
  drawBanner();
  drawFooter();
  drawPopup();
  drawLogin();
}
function initlogin() {
  init();
  drawBanner();
  drawFooter();
  drawPopup();
  get_para(drawWelcome);
  Countdown();
}
function init() {
  if (typeof popup_display_timer != "undefined") {
    clearTimeout(popup_display_timer);
  }
  if (typeof Countdown_timer != "undefined") {
    clearTimeout(Countdown_timer);
  }
  settings_changed = 0;
  IsLogin = 0;
  pid = 0;
  openLink = "";
  curr_page = null;
  hideStatus();
}
function drawBanner() {
  document.getElementById("NewBanner").innerHTML =
    '<table style="width:100%;">' +
    "<tr>" +
    '<td style="padding-left:25px" height="50" colspan="3" bgcolor="#CCCCCC" class="logo">' +
    "<p>" +
    vendor_header +
    "</p></td></tr>" +
    "<tr>" +
    '<td width="201" height="22" bgcolor="#CCCCCC">' +
    '<td width="440" height="22" align="center" bgcolor="#CCCCCC" class="text2">' +
    '<td width="265" height="22" bgcolor="#CCCCCC" align="left" class="text2"><p align="right" class="style5">Web@built: ' +
    web_version +
    "</p></td></tr>" +
    "<tr>" +
    '<td height="22" colspan="3" bgcolor="#6666CC" align="center" class="text2"></td>' +
    "</table>";
}
function drawFooter() {
  var d = new Date();
  document.getElementById("NewFooter").innerHTML =
    '<table style="width:100%; height:40px;">' +
    "<tr>" +
    '<td bgcolor="#6666CC" height="30" align="center" class="text2">Copyright &copy; ' +
    d.getFullYear() +
    " " +
    vendor_footer +
    " All rights reserved.</td></tr>" +
    "</table>";
}
function drawPopup() {
  var dhtml =
    '<div id="pop1">' +
    '<div id="popup">' +
    '<div id="confirm_text">' +
    "<p>We notice that there is no activity within 60 seconds. Please click 'Ok' to continue.</p>" +
    '<p><div id="popup_timer"></div></p>' +
    '<p><a href="javascript:hide_timer(1);" style="padding:10px;"> OK </a> <a href="javascript:hide_timer(0);" style="padding:10px;"> Cancel </a></p>' +
    "</div>" +
    "</div>" +
    "</div>";
  WriteHtml("NewPopup", dhtml);
}
function drawLogin() {
  user_id = user_id == "" ? "ADMIN" : user_id;
  document.getElementById("NewContent").innerHTML =
    "<table>" +
    '<tr valign="top">' +
    '<td style="width:580px;" class="text"><p class="title"> ' +
    vendor +
    " Device Server Manager</p>" +
    '<table style="width:300px;"width="300" align="left" class="text">' +
    '<tr><td class="loginText">Member Login</td></tr>' +
    "<tr>" +
    '<td class="textcontent" style="padding-top: 5px";><strong>Username</strong><br>' +
    '<input id="username" type="text" size="50" maxlength="6" disabled value="' +
    user_id +
    '">' +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="textcontent" style="padding-top: 5px";><strong>Password</strong><br>' +
    '<input id="Pword" type="password" value="******" size="50" maxlength="20" onKeyPress="LoginCheck(event);">' +
    '<div class="style8" id="divMayus" style="visibility:hidden">Caps Lock is ON.</div>' +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="textcontent"><p>' +
    '<button type="button" onclick="login_chk();">Login</button>' +
    '<button type="button" onclick="reset_login();">Reset</button>' +
    "</td>" +
    "</tr>" +
    "</table>" +
    "</td>" +
    "</tr>" +
    "</table>";
}
function login_chk() {
  if (chkEncode()) {
    pre_login_chk();
  }
}
function pre_login_chk() {
  disable_bg();
  get_ajax(loginChk_page, "pid=" + pid, pre_login_chk_callback);
}
function chkEncode() {
  var errorString = "";
  var alphaExp = /^[0-9a-zA-Z]+$/;
  var pass = document.getElementById("Pword").value;
  if (pass == "******" || pass == "") {
    errorString = "Please enter the password.";
  } else if (!pass.match(alphaExp)) {
    errorString = "Alphabet and Numeric Only";
  } else if (pass.length > 6) {
    errorString = "Maximum Passphrase Length is 6 characters only";
  } else {
    pass = encode64(pass);
  }
  if (errorString == "") {
    return true;
  } else {
    alert(errorString);
    return false;
  }
}
function disable_bg() {
  document.getElementById("backgroundFilter").style.display = "block";
}
function pre_login_chk_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      var resp = 1;
      try {
        resp = mygetrequest.responseText;
      } catch (e) {
        resp = 1;
      }
      if (resp == 1 && isNaN(resp) == false) {
        if (login_debug == 1) {
          alert("1: " + resp);
        }
        showStatus(
          "Another user is configuring the device. Please try again later."
        );
      } else {
        if (login_debug == 1) {
          alert("2: " + resp);
        }
        var user = encodeURIComponent(
          document.getElementById("username").value
        );
        var pass = encodeURIComponent(document.getElementById("Pword").value);
        var para = "username=" + user + "&Pword=" + encode64(pass);
        disable_bg();
        get_ajax(login_page, para, login_chk_callback);
      }
      openLink = "";
    } else {
      alert(req_error);
      location.reload(true);
    }
  }
}
function login_chk_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      try {
        pid = mygetrequest.responseText;
      } catch (e) {
        pid = 0;
      }
      if (login_debug == 1) {
        alert("3: " + pid);
      }
      if (pid != 0 && isNaN(pid) == false) {
        IsLogin = 1;
        location.href = menu_page;
      } else {
        showStatus("Login failed. Please check your username and password.");
      }
    } else {
      showStatus(req_error);
    }
  }
}
function hideStatus() {
  document.getElementById("NewStatus").innerHTML = "";
  document.getElementById("NewStatus").style.display = "none";
}
function WriteHtml(eid, msg) {
  document.getElementById(eid).innerHTML = msg;
}
function LoginCheck(e) {
  var keycode;
  if (window.event) {
    keycode = window.event.keyCode;
  } else if (e) {
    keycode = e.which;
  } else {
    return true;
  }
  if (keycode == 13) {
    login_chk();
  } else {
    capLock(e);
  }
}
function encode64(input) {
  var output = "";
  var chr1,
    chr2,
    chr3 = "";
  var enc1,
    enc2,
    enc3,
    enc4 = "";
  var i = 0;
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);
  return output;
}
function capLock(e) {
  kc = e.keyCode ? e.keyCode : e.which;
  sk = e.shiftKey ? e.shiftKey : kc == 16 ? true : false;
  if ((kc >= 65 && kc <= 90 && !sk) || (kc >= 97 && kc <= 122 && sk)) {
    document.getElementById("divMayus").style.visibility = "visible";
  } else {
    document.getElementById("divMayus").style.visibility = "hidden";
  }
}
function get_ajax(url, para, callback) {
  mygetrequest = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  mygetrequest.onreadystatechange = callback;
  mygetrequest.open(
    "GET",
    url + "?" + para + "&rnd=" + randomString() + "&",
    true
  );
  mygetrequest.send(null);
}
function randomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function enable_bg() {
  document.getElementById("backgroundFilter").style.display = "none";
}
function showStatus(msg) {
  document.getElementById("NewStatus").innerHTML = msg;
  document.getElementById("NewStatus").style.display = "block";
  setTimeout(hideStatus, ShowStatusTimeout);
}
function getHost() {
  var a = document.createElement("a");
  a.href = window.location;
  return a.hostname;
}
function reset_login() {
  document.getElementById("username").value = "ADMIN";
  document.getElementById("Pword").value = "******";
}

function StartSend() {
//   var filename = document.getElementById("datafile").files[0].name;
//   var len = file_prefix.length;
//   var ext = Right(filename, 4).toUpperCase();
//   var prefix = Left(filename, len);
//   if (filename == "") {
//     showStatus("Please select Firmware file.");
//   } else if (prefix != file_prefix) {
//     showStatus(
//       "Invalid filename. Firmware file must have the prefix <strong>" +
//         file_prefix +
//         "</strong>."
//     );
//   } else if (ext != file_ext) {
//     showStatus(
//       "Invalid firmware file. Firmware file must have extension <strong>" +
//         file_ext +
//         "</strong>."
//     );
//   } else {
//     document.getElementById("diag_img").style.display = "block";
//     document.getElementById("diag_btn").style.display = "none";
//     if (typeof Countdown_timer != "undefined") {
//       clearTimeout(Countdown_timer);
//     }
//     document.forms.item("sendform").submit();
//   }
    document.forms.item("sendform").submit();
}