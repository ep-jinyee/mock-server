var file_prefix = "HCB";
var web_version = "EP.S1.04.24.17.10";
var vendor = "Entrypass";
var vendor_footer =
  '<a href="http://www.entrypass.net" target="_blank">EntryPass</a> Corp. (M) SDN. BHD.';
var vendor_header = 'ENTRY<span class="style6">PASS</span>';
var ColdStartTimeout = 20000;
var user_id = "ADMIN";
var file_ext = ".WEB";
var ResetTimeout = 10000;
var ShowPopupTimeout = 40000;
var CountdownTimeout = 15;
var ShowStatusTimeout = 5000;
var changes_saved =
  'Changes saved. Please click "Apply Settings" for changes to take effect.';
var req_error = "An error has occured while making the request.";
var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var DISABLE_ADDRESS = "0.0.0.0";
var DEFAULT_PORT = 2020;
var debug = 0;
var login_debug = 0;
var IsLogin = 0;
var pid = 0;
var openLink = "";
var curr_page = null;
var Alert_timer;
var ResetType;
var upgrade_success = 0;
var Countdown_timer;
var Refresh_timer = 0;
var settings_changed = 0;
var es = encodeURIComponent(" ");
var main_page = "0index.htm";
var login_page = "2login.htm";
var loginChk_page = "3loginChk.htm";
var para_page = "4para.htm";
var status_page = "6status.htm";
var is_IP = 0;
var is_not_valid_IP = 0;
var reset_node = 0;
var redundant_node = 0;
var current_active_node = 0;
function randomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function get_sjax(url, para, callback) {
  mygetrequest = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  mygetrequest.onreadystatechange = callback;
  mygetrequest.open(
    "GET",
    url + "?" + para + "&rnd=" + randomString() + "&",
    false
  );
  mygetrequest.send(null);
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
        drawMenu();
        get_para(drawWelcome);
        Countdown();
      } else {
        showStatus("Login failed. Please check your username and password.");
      }
    } else {
      showStatus(req_error);
    }
  }
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
function pre_login_chk() {
  disable_bg();
  get_ajax(loginChk_page, "pid=" + pid, pre_login_chk_callback);
}
function login_chk() {
  if (chkEncode()) {
    pre_login_chk();
  }
}
function update_admin_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      get_para(drawAdmin);
      settings_changed = 1;
      showStatus(changes_saved);
    } else {
      showStatus(req_error);
    }
  }
}
function update_admin() {
  if (verifyConfirm()) {
    var rpt = encodeURIComponent(document.getElementById("AR5").value);
    var usr = encodeURIComponent(document.getElementById("X0").value);
    var pss = encodeURIComponent(document.getElementById("X1").value);
    var AR6 = document.getElementById("Zs").checked == true ? 1 : 0;
    var para = "pid=" + pid + "&X0=" + usr + "&AR6=" + AR6;
    if (pss != "" && pss != "******") {
      para += "&X1=" + pss;
    }
    if (document.getElementById("AR5").checked) {
      para += "&AR5=" + rpt;
    }
    para += "&es=" + es;
    disable_bg();
    get_ajax(main_page, para, update_admin_callback);
  }
}
function change_net_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      get_para(drawLAN);
    } else {
      showStatus(req_error);
    }
  }
}
function change_net() {
  var node = encodeURIComponent(
    document.getElementById("redundant_node").value
  );
  var current_active = encodeURIComponent(
    document.getElementById("current_active_node").value
  );
  var para = "pid=" + pid + "&G=" + node + "&J=" + current_active;
  reset_node = 0;
  disable_bg();
  get_ajax(main_page, para, change_net_callback);
}
function update_net_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      get_para(drawLAN);
      settings_changed = 1;
      showStatus(changes_saved);
    } else {
      showStatus(req_error);
    }
  }
}
function update_net() {
  if (verifySetting()) {
    var para = "pid=" + pid;
    var ip_address = encodeURIComponent(document.getElementById("Ii").value);
    var subnet_mask = encodeURIComponent(
      document.getElementById("subnet_mask").value
    );
    var gateway = encodeURIComponent(document.getElementById("Ig").value);
    var server_port = encodeURIComponent(document.getElementById("W0").value);
    var ddns_ip = encodeURIComponent(
      document.getElementById("dynamic_dns").value
    );
    var ae_port = encodeURIComponent(document.getElementById("W1").value);
    var host_ip = encodeURIComponent(document.getElementById("Ir").value);
    var resolved_ip = encodeURIComponent(document.getElementById("Ik").value);
    var ethernet;
    if (
      !verify_ControllerIP_NotSameAs_ServerIP(
        document.getElementById("Ii").value,
        document.getElementById("Ir").value
      )
    ) {
      return;
    }
    if (document.getElementById("B1").checked && is_IP) {
      alert("Caution, Host Name must not a static IP!");
      return;
    }
    if (is_not_valid_IP && document.getElementById("B2").checked) {
      alert("Caution, invalid static IP!");
      return;
    }
    if (
      !verifyNumRange(document.getElementById("W1").value, "Port Forwarding")
    ) {
      return;
    }
    if (true == document.getElementById("B1").checked) {
      if (reset_node) {
      } else {
        if (!verifyIP(document.getElementById("dynamic_dns").value, "DNS IP")) {
          return;
        }
        if (
          !isValid(document.getElementById("Ir").value, "Host Name / Static IP")
        ) {
          return;
        }
        if (
          !verifyNumRange(document.getElementById("W0").value, "Port Number")
        ) {
          return;
        }
      }
    } else if (true == document.getElementById("B2").checked) {
      if (reset_node) {
      } else {
        if (
          !isValid(document.getElementById("Ir").value, "Host Name / Static IP")
        ) {
          return;
        }
        if (
          !verifyNumRange(document.getElementById("W0").value, "Port Number")
        ) {
          return;
        }
      }
    }
    if (document.getElementById("E1").checked) {
      ethernet = encodeURIComponent(document.getElementById("E1").value);
    } else if (document.getElementById("E2").checked) {
      ethernet = encodeURIComponent(document.getElementById("E2").value);
    }
    var ddns_type;
    if (document.getElementById("B1").checked) {
      ddns_type = encodeURIComponent(document.getElementById("B1").value);
    } else if (document.getElementById("B2").checked) {
      ddns_type = encodeURIComponent(document.getElementById("B2").value);
    }
    redundant_node = encodeURIComponent(
      document.getElementById("redundant_node").value
    );
    current_active_node = encodeURIComponent(
      document.getElementById("current_active_node").value
    );
    if (reset_node) {
      ddns_ip = DISABLE_ADDRESS;
      server_port = DEFAULT_PORT;
      if (document.getElementById("B1").checked) {
        host_ip = "None";
      } else if (document.getElementById("B2").checked) {
        host_ip = DISABLE_ADDRESS;
      }
    }
    para +=
      "&G=" +
      redundant_node +
      "&J=" +
      current_active_node +
      "&Ii=" +
      ip_address +
      "&Is=" +
      subnet_mask +
      "&Ig=" +
      gateway +
      "&W0=" +
      server_port +
      "&E=" +
      ethernet +
      "&B=" +
      ddns_type +
      "&IS=" +
      ddns_ip +
      "&W1=" +
      ae_port +
      "&IR=" +
      reset_node +
      "&Ir=" +
      host_ip;
    para += "&es=" + es;
    disable_bg();
    get_ajax(main_page, para, update_net_callback);
  }
}
function change_com_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      get_para(drawSerial);
    } else {
      showStatus(req_error);
    }
  }
}
function change_com() {
  var com = encodeURIComponent(document.getElementById("commPort").value);
  var para = "pid=" + pid + "&t=" + com;
  disable_bg();
  get_ajax(main_page, para, change_com_callback);
}
function update_com_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      get_para(drawSerial);
      settings_changed = 1;
      showStatus(changes_saved);
    } else {
      showStatus(req_error);
    }
  }
}
function update_com() {
  var commPort = encodeURIComponent(document.getElementById("commPort").value);
  var baudRate = encodeURIComponent(document.getElementById("baudRate").value);
  var dataBits = encodeURIComponent(document.getElementById("dataBits").value);
  var flowControl = encodeURIComponent(
    document.getElementById("flowControl").value
  );
  var parity = encodeURIComponent(document.getElementById("parity").value);
  var stopBits = encodeURIComponent(document.getElementById("stopBits").value);
  var para =
    "pid=" +
    pid +
    "&t=" +
    commPort +
    "&T=" +
    baudRate +
    "&U2=" +
    dataBits +
    "&U4=" +
    flowControl +
    "&U1=" +
    parity +
    "&U3=" +
    stopBits +
    "&es=" +
    es;
  disable_bg();
  get_ajax(main_page, para, update_com_callback);
}
function session_chk_callback() {
  if (mygetrequest.readyState == 4) {
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      var resp;
      try {
        resp = mygetrequest.responseText;
      } catch (e) {
        resp = 0;
      }
      if (resp != 0 && isNaN(resp) == false) {
        if (IsLogin == 1) {
          if (openLink == "WEL") {
            drawWelcome();
          } else if (openLink == "MAI") {
            drawAdmin();
          } else if (openLink == "NET") {
            drawLAN();
          } else if (openLink == "SER") {
            drawSerial();
          } else if (openLink == "DIA") {
            drawDiag();
          }
          hideStatus();
          Countdown();
        }
      } else {
        GoHome();
      }
      openLink = "";
    } else {
      alert(req_error);
      GoHome();
    }
  }
}
function session_chk_callbackWODraw() {
  if (mygetrequest.readyState == 4) {
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      var resp;
      try {
        resp = mygetrequest.responseText;
      } catch (e) {
        resp = 0;
      }
      if (resp != 0 && isNaN(resp) == false) {
        if (IsLogin == 1) {
          hideStatus();
          Countdown();
        }
      } else {
        GoHome();
      }
      openLink = "";
    } else {
      alert(req_error);
      GoHome();
    }
  }
}
function session_chk(draw) {
  if (draw) get_ajax(loginChk_page, "pid=" + pid, session_chk_callback);
  else get_ajax(loginChk_page, "pid=" + pid, session_chk_callbackWODraw);
}
function get_status_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(mygetrequest.responseText);
      } else {
        xmlDoc = mygetrequest.responseXML;
      }
      ip_address =
        xmlDoc.getElementsByTagName("ip_address")[0].childNodes[0].nodeValue;
      ip_address = chk_string(ip_address);
      reset_status =
        xmlDoc.getElementsByTagName("reset_status")[0].childNodes[0].nodeValue;
      reset_status = chk_string(reset_status);
      if (ResetType == "Apply Default Settings") {
        setTimeout(curr_page, ColdStartTimeout);
      } else {
        setTimeout(curr_page, ResetTimeout);
      }
    }
  }
}
function get_status(redraw) {
  curr_page = redraw;
  disable_bg();
  get_ajax(status_page, "pid=" + encodeURIComponent(pid), get_status_callback);
}
function get_para_callback() {
  if (mygetrequest.readyState == 4) {
    enable_bg();
    if (
      mygetrequest.status == 200 ||
      window.location.href.indexOf("http") == -1
    ) {
      if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(mygetrequest.responseText);
      } else {
        xmlDoc = mygetrequest.responseXML;
      }
      serial_no =
        xmlDoc.getElementsByTagName("serial_no")[0].childNodes[0].nodeValue;
      firmware_version =
        xmlDoc.getElementsByTagName("firmware_version")[0].childNodes[0]
          .nodeValue;
      mac_address =
        xmlDoc.getElementsByTagName("mac_address")[0].childNodes[0].nodeValue;
      serial_no = chk_string(serial_no);
      firmware_version = chk_string(firmware_version);
      mac_address = chk_string(mac_address);
      disable_reporting =
        xmlDoc.getElementsByTagName("disable_reporting")[0].childNodes[0]
          .nodeValue;
      commit_setting =
        xmlDoc.getElementsByTagName("commit_setting")[0].childNodes[0]
          .nodeValue;
      user_pass =
        xmlDoc.getElementsByTagName("user_pass")[0].childNodes[0].nodeValue;
      heap1 = xmlDoc.getElementsByTagName("heap1")[0].childNodes[0].nodeValue;
      heap2 = xmlDoc.getElementsByTagName("heap2")[0].childNodes[0].nodeValue;
      stack = xmlDoc.getElementsByTagName("stack")[0].childNodes[0].nodeValue;
      disable_reporting = chk_string(disable_reporting);
      commit_setting = chk_string(commit_setting);
      user_id = chk_string(user_id);
      user_pass = chk_string(user_pass);
      heap1 = chk_string(heap1);
      heap2 = chk_string(heap2);
      stack = chk_string(stack);
      node_select1 =
        xmlDoc.getElementsByTagName("node_select1")[0].childNodes[0].nodeValue;
      node_select2 =
        xmlDoc.getElementsByTagName("node_select2")[0].childNodes[0].nodeValue;
      active_node1 =
        xmlDoc.getElementsByTagName("active_node1")[0].childNodes[0].nodeValue;
      active_node2 =
        xmlDoc.getElementsByTagName("active_node2")[0].childNodes[0].nodeValue;
      ip_address =
        xmlDoc.getElementsByTagName("ip_address")[0].childNodes[0].nodeValue;
      subnet_mask =
        xmlDoc.getElementsByTagName("subnet_mask")[0].childNodes[0].nodeValue;
      gateway =
        xmlDoc.getElementsByTagName("gateway")[0].childNodes[0].nodeValue;
      server_port =
        xmlDoc.getElementsByTagName("server_port")[0].childNodes[0].nodeValue;
      ethernet_100 =
        xmlDoc.getElementsByTagName("ethernet_100")[0].childNodes[0].nodeValue;
      ethernet_10 =
        xmlDoc.getElementsByTagName("ethernet_10")[0].childNodes[0].nodeValue;
      ddns_type1 =
        xmlDoc.getElementsByTagName("ddns_type1")[0].childNodes[0].nodeValue;
      ddns_type2 =
        xmlDoc.getElementsByTagName("ddns_type2")[0].childNodes[0].nodeValue;
      ddns_ip =
        xmlDoc.getElementsByTagName("ddns_ip")[0].childNodes[0].nodeValue;
      ae_port =
        xmlDoc.getElementsByTagName("ae_port")[0].childNodes[0].nodeValue;
      host_ip =
        xmlDoc.getElementsByTagName("host_ip")[0].childNodes[0].nodeValue;
      resolved_ip =
        xmlDoc.getElementsByTagName("resolved_ip")[0].childNodes[0].nodeValue;
      node_select1 = chk_string(node_select1);
      node_select2 = chk_string(node_select2);
      active_node1 = chk_string(active_node1);
      active_node2 = chk_string(active_node2);
      ip_address = chk_string(ip_address);
      subnet_mask = chk_string(subnet_mask);
      gateway = chk_string(gateway);
      server_port = chk_string(server_port);
      ethernet_100 = chk_string(ethernet_100);
      ethernet_10 = chk_string(ethernet_10);
      ddns_type1 = chk_string(ddns_type1);
      ddns_type2 = chk_string(ddns_type2);
      ddns_ip = chk_string(ddns_ip);
      ae_port = chk_string(ae_port);
      host_ip = chk_string(host_ip);
      resolved_ip = chk_string(resolved_ip);
      com_select1 =
        xmlDoc.getElementsByTagName("com_select1")[0].childNodes[0].nodeValue;
      com_select2 =
        xmlDoc.getElementsByTagName("com_select2")[0].childNodes[0].nodeValue;
      com_select3 =
        xmlDoc.getElementsByTagName("com_select3")[0].childNodes[0].nodeValue;
      baud_rate1 =
        xmlDoc.getElementsByTagName("baud_rate1")[0].childNodes[0].nodeValue;
      baud_rate2 =
        xmlDoc.getElementsByTagName("baud_rate2")[0].childNodes[0].nodeValue;
      baud_rate3 =
        xmlDoc.getElementsByTagName("baud_rate3")[0].childNodes[0].nodeValue;
      baud_rate4 =
        xmlDoc.getElementsByTagName("baud_rate4")[0].childNodes[0].nodeValue;
      baud_rate5 =
        xmlDoc.getElementsByTagName("baud_rate5")[0].childNodes[0].nodeValue;
      baud_rate6 =
        xmlDoc.getElementsByTagName("baud_rate6")[0].childNodes[0].nodeValue;
      baud_rate7 =
        xmlDoc.getElementsByTagName("baud_rate7")[0].childNodes[0].nodeValue;
      baud_rate8 =
        xmlDoc.getElementsByTagName("baud_rate8")[0].childNodes[0].nodeValue;
      baud_rate9 =
        xmlDoc.getElementsByTagName("baud_rate9")[0].childNodes[0].nodeValue;
      baud_rate10 =
        xmlDoc.getElementsByTagName("baud_rate10")[0].childNodes[0].nodeValue;
      baud_rate11 =
        xmlDoc.getElementsByTagName("baud_rate11")[0].childNodes[0].nodeValue;
      baud_rate12 =
        xmlDoc.getElementsByTagName("baud_rate12")[0].childNodes[0].nodeValue;
      data_bits1 =
        xmlDoc.getElementsByTagName("data_bits1")[0].childNodes[0].nodeValue;
      data_bits2 =
        xmlDoc.getElementsByTagName("data_bits2")[0].childNodes[0].nodeValue;
      flow_control1 =
        xmlDoc.getElementsByTagName("flow_control1")[0].childNodes[0].nodeValue;
      flow_control2 =
        xmlDoc.getElementsByTagName("flow_control2")[0].childNodes[0].nodeValue;
      flow_control3 =
        xmlDoc.getElementsByTagName("flow_control3")[0].childNodes[0].nodeValue;
      parity1 =
        xmlDoc.getElementsByTagName("parity1")[0].childNodes[0].nodeValue;
      parity2 =
        xmlDoc.getElementsByTagName("parity2")[0].childNodes[0].nodeValue;
      parity3 =
        xmlDoc.getElementsByTagName("parity3")[0].childNodes[0].nodeValue;
      stop_bits1 =
        xmlDoc.getElementsByTagName("stop_bits1")[0].childNodes[0].nodeValue;
      stop_bits2 =
        xmlDoc.getElementsByTagName("stop_bits2")[0].childNodes[0].nodeValue;
      stop_bits3 =
        xmlDoc.getElementsByTagName("stop_bits3")[0].childNodes[0].nodeValue;
      com_select1 = chk_string(com_select1);
      com_select2 = chk_string(com_select2);
      com_select3 = chk_string(com_select3);
      baud_rate1 = chk_string(baud_rate1);
      baud_rate2 = chk_string(baud_rate2);
      baud_rate3 = chk_string(baud_rate3);
      baud_rate4 = chk_string(baud_rate4);
      baud_rate5 = chk_string(baud_rate5);
      baud_rate6 = chk_string(baud_rate6);
      baud_rate7 = chk_string(baud_rate7);
      baud_rate8 = chk_string(baud_rate8);
      baud_rate9 = chk_string(baud_rate9);
      baud_rate10 = chk_string(baud_rate10);
      baud_rate11 = chk_string(baud_rate11);
      baud_rate12 = chk_string(baud_rate12);
      data_bits1 = chk_string(data_bits1);
      data_bits2 = chk_string(data_bits2);
      flow_control1 = chk_string(flow_control1);
      flow_control2 = chk_string(flow_control2);
      flow_control3 = chk_string(flow_control3);
      parity1 = chk_string(parity1);
      parity2 = chk_string(parity2);
      parity3 = chk_string(parity3);
      stop_bits1 = chk_string(stop_bits1);
      stop_bits2 = chk_string(stop_bits2);
      stop_bits3 = chk_string(stop_bits3);
      disable_ethernet =
        xmlDoc.getElementsByTagName("disable_ethernet")[0].childNodes[0]
          .nodeValue;
      disable_dns_ip =
        xmlDoc.getElementsByTagName("disable_dns_ip")[0].childNodes[0]
          .nodeValue;
      disable_ae =
        xmlDoc.getElementsByTagName("disable_ae")[0].childNodes[0].nodeValue;
      disable_hostname =
        xmlDoc.getElementsByTagName("disable_hostname")[0].childNodes[0]
          .nodeValue;
      diag1 = xmlDoc.getElementsByTagName("diag1")[0].childNodes[0].nodeValue;
      diag2 = xmlDoc.getElementsByTagName("diag2")[0].childNodes[0].nodeValue;
      disable_ethernet = chk_string(disable_ethernet);
      disable_dns_ip = chk_string(disable_dns_ip);
      disable_ae = chk_string(disable_ae);
      disable_hostname = chk_string(disable_hostname);
      diag1 = chk_string(diag1);
      diag2 = chk_string(diag2);
      controller_commited = xmlDoc.getElementsByTagName(
        "controller_commited"
      )[0].childNodes[0].nodeValue;
      controller_commited = chk_string(controller_commited);
      if (controller_commited == "20" && IsLogin == 0) {
        drawCommit();
      } else {
        curr_page();
      }
    } else {
      showStatus("HTTP request error: " + mygetrequest.status);
    }
  }
}
function get_para(redraw) {
  curr_page = redraw;
  disable_bg();
  get_ajax(para_page, "pid=" + encodeURIComponent(pid), get_para_callback);
}
function show_net_settings() {
  document.getElementById("net_settings").style.display = "block";
  document.getElementById("ddns_settings").style.display = "none";
  document.getElementById("TitleLink").style.backgroundColor = "#CCCCFF";
  document.getElementById("TitleLink2").style.backgroundColor = "#EEEEEE";
  document.getElementById("net_settings_tab").style.backgroundColor = "#CCCCFF";
  document.getElementById("ddns_settings_tab").style.backgroundColor =
    "#EEEEEE";
  Countdown();
  session_chk(0);
}
function server_settings() {
  show_hide_DNS_or_IP();
  if (true == document.getElementById("B2").checked) {
    document.getElementById("dynamic_dns").disabled = true;
  }
  document.getElementById("current_active_node").disabled = true;
  document.getElementById("net_settings").style.display = "none";
  document.getElementById("ddns_settings").style.display = "block";
  document.getElementById("TitleLink").style.backgroundColor = "#EEEEEE";
  document.getElementById("TitleLink2").style.backgroundColor = "#CCCCFF";
  document.getElementById("net_settings_tab").style.backgroundColor = "#EEEEEE";
  document.getElementById("ddns_settings_tab").style.backgroundColor =
    "#CCCCFF";
  Countdown();
  session_chk(0);
}
function enable_bg() {
  document.getElementById("backgroundFilter").style.display = "none";
}
function disable_bg() {
  document.getElementById("backgroundFilter").style.display = "block";
}
function hideStatus() {
  document.getElementById("NewStatus").innerHTML = "";
  document.getElementById("NewStatus").style.display = "none";
}
function showStatus(msg) {
  document.getElementById("NewStatus").innerHTML = msg;
  document.getElementById("NewStatus").style.display = "block";
  setTimeout(hideStatus, ShowStatusTimeout);
}
function Goto(pageLink) {
  openLink = pageLink;
  session_chk(1);
}
function send_cmd(type) {
  if (IsLogin == 1) {
    var fConfirm;
    var fChanges;
    if (type == "Sign out" && settings_changed == 1) {
      fChanges = confirm("Save settings before sign out ?");
      if (fChanges) {
        type = "Apply Settings";
      }
      fConfirm = true;
      settings_changed == 0;
    } else {
      fConfirm =
        type == "Sign out"
          ? true
          : confirm("Please confirm action: <" + type.toUpperCase() + ">");
    }
    if (fConfirm) {
      var YD;
      var AR3;
      var AR4;
      var eS;
      openLink = "";
      Countdown();
      if (type == "Apply Settings") {
        YD = "0";
        AR3 = "0";
        AR4 = "0";
        eS = "Save";
      } else if (type == "Apply Default Settings") {
        YD = "0";
        AR3 = "D";
        AR4 = "0";
        eS = "0";
      } else if (type == "Reset Device") {
        YD = "0";
        AR3 = "0";
        AR4 = "4";
        eS = "0";
      } else if (type == "Sign out") {
        YD = "L";
        AR3 = "0";
        AR4 = "0";
        eS = "0";
      }
      YD = encodeURIComponent(YD);
      AR3 = encodeURIComponent(AR3);
      AR4 = encodeURIComponent(AR4);
      eS = encodeURIComponent(eS);
      var para =
        "pid=" +
        pid +
        "&YD=" +
        YD +
        "&AR3=" +
        AR3 +
        "&AR4=" +
        AR4 +
        "&eS=" +
        eS;
      ResetType = type;
      get_sjax(main_page, para, null);
      init();
      if (ResetType == "Sign out") {
        GoHome();
      } else {
        drawReset();
      }
    }
  }
}
function ResetDone() {
  var htmlText =
    'Please click <a class="ResultText" href="javascript:GoHome();">here</a> to login again.';
  if (ResetType == "Apply Settings") {
    if (reset_status == 10) {
      var new_ip = "http://" + ip_address;
      htmlText =
        '<p align="left" class="title">New IP address is saved successfully! </p>';
      htmlText +=
        'Please browse with the new IP address at <a class="ResultText" href="#" onclick="window.open(\'' +
        new_ip +
        "');\">" +
        new_ip +
        "</a>.";
    } else if (reset_status == 11) {
      htmlText =
        '<p align="left" class="title">Fail to resolve new IP address.</p>';
      htmlText +=
        "IP address exists in the network. Please try to enter another new IP address.<br>";
    } else if (reset_status == 12) {
      htmlText =
        '<p align="left" class="title">New parameter setting is successfully saved.</p>' +
        'Please click <a class="ResultText" href="javascript:GoHome();">here</a> to login again.';
    } else if (reset_status == 13) {
      htmlText =
        '<p align="left" class="title">Session Expired.</p>' +
        "Save parameter is not permitted." +
        'Please click <a class="ResultText" href="javascript:GoHome();">here</a> to login again.';
    } else {
      htmlText =
        '<p align="left" class="title">Settings saved.</p>' +
        'Please click <a class="ResultText" href="javascript:GoHome();">here</a> to login again.';
    }
  } else if (ResetType == "Apply Default Settings") {
    htmlText =
      '<p align="left" class="title">Factory Default Successful. </p>' +
      "Please note that IP address has been<br>" +
      "changed back to factory default IP <b><192.168.1.100></b>.<br>" +
      '<p>Please click <a class="ResultText" href="http://192.168.1.100">here</a> to continue.</p>';
  } else if (ResetType == "Reset Device") {
    htmlText =
      '<p align="left" class="title">Device Reset Successful. </p>' +
      'Please click <a class="ResultText" href="javascript:GoHome();">here</a> to login again.';
  }
  document.getElementById("NewContent").innerHTML =
    "<div>" + htmlText + "</div>";
}
function showStopSendMsg() {
  if (upgrade_success == 1) {
    document.getElementById("NewContent").innerHTML =
      '<p class="title">Firmware upgrade <span class="successText">COMPLETED</span></p><p class="textNewContent">The device will now reboot. Please click <a class="ResultText" href="javascript:GoHome();">here</a> to login again.</p>';
  } else {
    document.getElementById("NewContent").innerHTML =
      '<p class="title">Firmware upgrade <span class="errorText">FAILED</span></p><p class="textNewContent">Please contact the technical team for assistance.</p>';
  }
}
function StopSend(success) {
  IsLogin = 0;
  pid = 0;
  openLink = "";
  curr_page = null;
  drawMenu();
  document.getElementById("NewContent").innerHTML =
    '<p class="textNewContent">Upload complete. Waiting for controller to reset ... <img src="5loader.gif"/></p>';
  upgrade_success = success;
  setTimeout(showStopSendMsg, ColdStartTimeout);
}
function reset_login() {
  document.getElementById("username").value = "ADMIN";
  document.getElementById("Pword").value = "******";
}
function enableDNS(status) {
  if (status != "B0") {
    document.getElementById("redundant_node").disabled = false;
    document.getElementById("dynamic_dns").disabled = false;
    document.getElementById("Ir").disabled = false;
    document.getElementById("W1").disabled = false;
    document.getElementById("Ir").value = "";
    if (status == "B1") {
      document.getElementById("dynamic_dns").disabled = true;
    }
  }
  show_hide_DNS_or_IP();
}
function show_hide_DNS_or_IP() {
  if (true == document.getElementById("B1").checked) {
    document.getElementById("HostOrIP").innerHTML = "Host Name";
    document.getElementById("_Ik0").style.display = "";
    document.getElementById("_Ik3").style.display = "";
  } else if (true == document.getElementById("B2").checked) {
    document.getElementById("HostOrIP").innerHTML = "IP Address";
    document.getElementById("_Ik0").style.display = "none";
    document.getElementById("_Ik3").style.display = "none";
  }
}
function getHost() {
  var a = document.createElement("a");
  a.href = window.location;
  return a.hostname;
}
function getPath() {
  var a = document.createElement("a");
  a.href = window.location;
  return a.pathname.substr(0, 1) === "/" ? a.pathname : "/" + a.pathname;
}
function chk_string(str) {
  return str.charAt(0) == "^" ? "" : str;
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
var keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
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
function capLock(e) {
  kc = e.keyCode ? e.keyCode : e.which;
  sk = e.shiftKey ? e.shiftKey : kc == 16 ? true : false;
  if ((kc >= 65 && kc <= 90 && !sk) || (kc >= 97 && kc <= 122 && sk)) {
    document.getElementById("divMayus").style.visibility = "visible";
  } else {
    document.getElementById("divMayus").style.visibility = "hidden";
  }
}
function verifyConfirm() {
  var alphaExp = /^[0-9a-zA-Z]+$/;
  var pass = document.getElementById("X1").value;
  if (document.getElementById("X1").disabled == false) {
    if (
      document.getElementById("X1").value != document.getElementById("Rt").value
    ) {
      alert("Passwords do not match. Please try again\n");
      return false;
    } else if (document.getElementById("X1").value.length < 6) {
      alert("Passwords field is less than 6 characters. Please try again\n");
      return false;
    } else if (!pass.match(alphaExp)) {
      alert("Only alphabet and numeric is allow. Please try again\n");
      return false;
    } else {
      document.getElementById("Rt").value = "";
      return true;
    }
  }
  return true;
}
function enableAdmin() {
  if (document.getElementById("X1").disabled == true) {
    document.getElementById("X1").disabled = false;
    document.getElementById("Rt").disabled = false;
  } else {
    document.getElementById("X1").disabled = true;
    document.getElementById("Rt").disabled = true;
  }
  document.getElementById("X1").value = "";
  document.getElementById("Rt").value = "";
}
function verify_ControllerIP_NotSameAs_ServerIP(
  Controller_ipValue,
  Server_ipValue
) {
  if (Controller_ipValue == Server_ipValue) {
    alert("Controller IP Address must not same as Server IP Address");
    return false;
  } else {
    return true;
  }
}
function verifyIP(ipValue, theName) {
  var errorString = "";
  var ipArray = ipValue.match(ipPattern);
  if (ipValue == "0.0.0.0") {
    if (!(theName == "Default Gateway")) {
      errorString = theName + ": " + ipValue + " can not be zero.";
    }
  }
  if (ipArray == null || ipValue == "255.255.255.255") {
    errorString = theName + ": " + ipValue + " is not a valid IP address.";
  } else {
    for (i = 1; i <= 4; i++) {
      thisSegment = ipArray[i];
      if (thisSegment > 255) {
        errorString = theName + ": " + ipValue + " is not a valid IP address.";
        i = 4;
      }
    }
  }
  if (errorString == "") {
    return true;
  } else {
    alert(errorString);
    return false;
  }
}
function IsHostName(HostValue, theName) {
  var ipArray = HostValue.match(ipPattern);
  is_IP = ipArray;
  if (ipArray) {
    alert("Host Name must not a static IP!");
    return false;
  }
  if (hasWhiteSpace(HostValue)) {
    alert('Host Name : "' + HostValue + '" must not having whitespace!');
    return false;
  }
  is_IP = 0;
  return true;
}
function verifyNumRange(numValue, theName) {
  var errorString = "";
  if ("Port Number" == theName && 1 == reset_node) {
    return true;
  }
  if (/^ *[0-9]+ *$/.test(numValue) && numValue > 0 && numValue <= 65535) {
    return true;
  } else {
    errorString =
      theName +
      ": contains invalid characters or value (must within 1 to 65535).";
    alert(errorString);
    return false;
  }
}
function isValid(s, msg) {
  if (document.getElementById("B1").checked) {
    if (s == "") {
      alert(msg + " is empty!");
      return false;
    }
    if (!IsHostName(s, "Host Name / Static IP")) {
      return false;
    }
    return true;
  } else if (document.getElementById("B2").checked) {
    if (verifyIP(s, msg)) {
    } else {
      return false;
    }
    if (!s.match(ipPattern)) {
      is_not_valid_IP = 1;
      alert(s + " is not valid IP!");
      return false;
    } else {
      is_not_valid_IP = 0;
      return true;
    }
  } else {
    is_not_valid_IP = 0;
    return true;
  }
}
function verifySetting() {
  var ok = false;
  ToResetNode();
  if (!CheckActiveNodeBeforeReset()) {
    ok = VerifyInputBasedOn_DNS_selection();
  }
  return ok;
}
function hasWhiteSpace(s) {
  return /\s/g.test(s);
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
  drawMenu();
}
function initlogin() {
  init();
  get_ajax(login_page, 0, login_chk_callback);
  drawBanner();
  drawFooter();
  drawPopup();
  Countdown();
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
function drawWelcome() {
  document.getElementById("NewContent").innerHTML =
    '<table style="width:800px;height:66;"><tr><td>' +
    '<p class="title">Welcome</p>' +
    '<p class="textNewContent">The ' +
    vendor +
    " Security Management System offers impressive features that rivals most international systems while maintaining its competitiveness in terms of value for money. It is driven by our obsession to make it absolutely user friendly yet not compromising on the performance and reliability.</p>" +
    '<p class="textNewContent">Powered by the ' +
    vendor +
    " Team, it has been designed as a scalable system that will grow with your business. It is very cost effective and can be applied to all applications from a simple door access requirement to a fully functional and integrated security system such as incorporating vehicle access, lift access, intrusion monitoring and even guard touring.</p>" +
    '<p class="title">Hardware Information</p>' +
    '<table style="width:460px;height:66;">' +
    "<tr>" +
    '<td width="120"><p class="text">Serial Number</p></td>' +
    '<td width="329"><label><input name=r disabled value="' +
    serial_no +
    '" size="50" maxlength="30"></label></td></tr>' +
    "<tr>" +
    '<td class="text"><p>Firmware Version</p></td>' +
    '<td><input name=r2 disabled value="' +
    firmware_version +
    '" size="50" maxlength="50"></td></tr>' +
    "<tr>" +
    '<td class="text"><p>MAC Address</p></td>' +
    '<td><input size="50" maxlength="30" name=c disabled value="' +
    mac_address +
    '"></td></tr>' +
    "</table>" +
    "</td></tr></table>";
}
function ShowUpd() {
  document.getElementById("noupdate").style.display = "none";
  document.getElementById("updated").style.display = "block";
}
function drawMenu() {
  if (IsLogin == 1) {
    document.getElementById("NewMenu").innerHTML =
      '<div class="SideMenu">' +
      '<div class="SideMenuItem"><a href="javascript:Goto(\'WEL\');" title="Welcome">Welcome</a></div>' +
      '<div class="SideMenuItem"><a href="javascript:Goto(\'MAI\');" title="Admin Setting">Admin</a></div>' +
      '<div class="SideMenuItem"><a href="javascript:Goto(\'NET\');" title="Network Setting">Network</a></div>' +
      '<div class="SideMenuItem"><a href="javascript:Goto(\'SER\');" title="Serial Setting">Serial</a></div>' +
      '<div class="SideMenuItem"><a href="javascript:Goto(\'DIA\');" title="Firmware Upload">Firmware Upload</a></div></div>' +
      '<div class="SideMenu">' +
      '<div class="SideMenuItem" id="noupdate"><a href="javascript:send_cmd(\'Apply Settings\');" title="Apply Settings">Apply Settings </a></div>' +
      '<div class="SideMenuItem"><a href="javascript:send_cmd(\'Apply Default Settings\');" title="Apply Defaults">Apply Default Settings</a></div>' +
      '<div class="SideMenuItem"><a href="javascript:send_cmd(\'Reset Device\');" title="Reset Device">Reset Device</a></div>' +
      '<div class="SideMenuItem"><a href="javascript:send_cmd(\'Sign out\');" title="Sign out">Sign Out</a></div></div>';
  } else {
    document.getElementById("NewMenu").innerHTML = "";
  }
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
function drawAdmin() {
  document.getElementById("NewContent").innerHTML =
    "<table>" +
    '<tr valign="top"><td class="text">' +
    '<p class="title">Administration</p>' +
    '<table style="width:458px;">' +
    "<tr>" +
    '<td class="solidTableTitle"><p style="text-align:center" class="style2">Setting</p></td>' +
    '<td class="solidTableTitle" style="text-align:center"><span class="style2">Detail</span></td>' +
    '<td class="solidTableTitle" style="text-align:center"><span class="style2">Modified</span></td></tr>' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Disable Service Reporting</p></td><td class="solidTable">&nbsp;</td>' +
    '<td class="solidTable" style="text-align:center"><input type=checkbox id="AR5" name=AR5 ' +
    disable_reporting +
    " ></td></tr>" +
    "<tr>" +
    '<td class="solidTable"><p class="text">Commiting Setting</p></td>' +
    '<td class="solidTable">&nbsp;</td>' +
    '<td class="solidTable" style="text-align:center"><input type=checkbox id="Zs" name=Zs ' +
    commit_setting +
    "></td></tr>" +
    "<tr>" +
    '<td class="solidTable"><p class="text">User ID</p></td>' +
    '<td class="solidTable"><input id="X0" name=X0 size="25" maxlength="5" disabled value="' +
    user_id +
    '"></td>' +
    '<td class="solidTable" style="text-align:center"><input type=checkbox id="Xr" name=Xr onClick="javascript:enableAdmin()"></td></tr>' +
    "<tr>" +
    '<td width="165" class="solidTable"><p class="text">User Password</p></td>' +
    '<td width="185" class="solidTable"><input id="X1" name=X1 type="password" disabled value="' +
    user_pass +
    '" size="25" maxlength="6"></td>' +
    '<td width="80" class="solidTable">&nbsp;</td></tr>' +
    "<tr >" +
    '<td class="solidTable"><p class="text">Confirm Password</p></td>' +
    '<td class="solidTable"><input id="Rt" name=Rt type="password" disabled size="25" maxlength="6"></td>' +
    '<td class="solidTable">&nbsp;</td></tr>' +
    "</table>" +
    '<p><input type=hidden id="AR6" name=AR6></p>' +
    '<p><button type="button" onclick="update_admin()">Save changes</button></p>';
  "</td>" + "</tr>" + "</table>";
}
function drawLAN() {
  document.getElementById("NewContent").innerHTML =
    "<table>" +
    "<tr>" +
    '<td class="text">' +
    '<p class="title">Network Setting</p>' +
    '<table style="width:540px;text-align:center;">' +
    "<tr>" +
    '<td id="net_settings_tab" style="padding: 10px 0px 5px 0px; border-style: none; background-color: #CCCCFF;width:50%;" ><a href="javascript:show_net_settings();" id="TitleLink" class="TitleLink">Controller Setting</a></td>' +
    '<td id="ddns_settings_tab" style="padding: 10px 0px 5px 0px; border-style: none; width:50%;"><a href="javascript:server_settings();" id="TitleLink2" class="TitleLink2">Server Setting</a></td>' +
    "</tr>" +
    "</table>" +
    '<div id="net_settings" style="display: block; padding: 10px 10px 10px 10px; background-color: #CCCCFF; width:520px; height:165px;">' +
    '<table style="width:520px; height:66;">' +
    '<td class="solidTable"><p class="text">IP Address</p></td>' +
    '<td class="solidTable"><input id=Ii name="Ii" size="30" maxlength="15" value="' +
    ip_address +
    '"></td></tr>' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Subnet Mask</p></td>' +
    '<td class="solidTable"><input id="subnet_mask" name="subnet_mask" size="30" maxlength="15" value="' +
    subnet_mask +
    '"></td></tr>' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Gateway IP Address</p></td>' +
    '<td class="solidTable"><input id=Ig name="Ig" size="30" maxlength="15" value="' +
    gateway +
    '"></td></tr>' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Port Number / Listen Port</p></td>' +
    '<td class="solidTable"><input id=W1 name="W1" size="30" maxlength="5" value="' +
    ae_port +
    '"></td></tr>' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Ethernet Speed</p></td>' +
    '<td class="solidTable">' +
    '<p class="text"><input type=radio id="E1" name="E" value="F" ' +
    ethernet_100 +
    " " +
    disable_ethernet +
    "> 100Mbps<!--/p-->" +
    '<!--p class="text"--><input type=radio id="E2" name="E" value="S" ' +
    ethernet_10 +
    " " +
    disable_ethernet +
    "> 10Mbps</p></td></tr>" +
    "</table>" +
    "</div>" +
    '<div id="ddns_settings" style="display:none; padding: 10px 10px 10px 10px; background-color: #CCCCFF; width:520px; height:270px;">' +
    '<table style="width:520px; height:66;">' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Redundant Server</p></td>' +
    '<td class="solidTable">' +
    '<select id="redundant_node" name=G onChange="change_net();">' +
    '<option id="GA" value="A" ' +
    node_select1 +
    ">Server  1</option>" +
    '<option id="GB" value="B" ' +
    node_select2 +
    ">Server  2</option></select>" +
    "</td></tr>" +
    "<tr>" +
    '<td class="solidTable" width="140" scope="col"><p class="text">Connection using</p></td>' +
    '<td class="solidTable" width="85" scope="col"><p class="text"><input type=radio id="B1" name="B" value="2" onClick="javascript:enableDNS(\'B2\');" ' +
    ddns_type1 +
    ">DDNS" +
    "&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;" +
    '<input type=radio id="B2" name="B" value="1" onClick="javascript:enableDNS(\'B1\');" ' +
    ddns_type2 +
    ">IP Address</p></td>" +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="solidTable"><p id="HostOrIP" class="text"></p></td>' +
    '<td class="solidTable"><input id="Ir" name="Ir" size="30" maxlength="30" value="' +
    host_ip +
    '" ' +
    disable_hostname +
    "></td></tr>" +
    '<tr id="_Ik0">' +
    '<td class="solidTable" id="_Ik1"><p class="text">Resolved Host IP</p></td>' +
    '<td class="solidTable" id="_Ik2"><input id="Ik" name="Ik" size="30" maxlength="30" value="' +
    resolved_ip +
    '" disabled></td></tr>' +
    '<tr id="_Ik3">' +
    '<td class="solidTable"><p class="text">DNS Server IP</p></td>' +
    '<td class="solidTable"><input id="dynamic_dns" name="dynamic_dns" size="30" maxlength="15" value="' +
    ddns_ip +
    '" ' +
    disable_dns_ip +
    "></td></tr>" +
    "<tr>" +
    '<td class="solidTable"><p class="text">Server Active Engine Port / Send Port</p></td>' +
    '<td class="solidTable"><input id="W0" name="W0" size="30" maxlength="30" value="' +
    server_port +
    '"></td></tr>' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Reset Node Setting</p></td>' +
    '<td class="solidTable"><button type="button" id="IR" onclick="ClearTextBox()">Reset</button></td></tr>' +
    "</table><p></p>" +
    '<table style="width:520px;">' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Current Active Server</p></td>' +
    '<td class="solidTable">' +
    '<select id="current_active_node" name=J onChange="change_net();">' +
    '<option value="A" ' +
    active_node1 +
    ">Server  1</option>" +
    '<option value="B" ' +
    active_node2 +
    ">Server  2</option></select>" +
    "</td></tr>" +
    "</table><p></p>" +
    "</div>" +
    '<p><button type="button" onclick="update_net()">Save changes</button></p>' +
    "</td>" +
    "</tr>" +
    "</table>";
}
function drawSerial() {
  document.getElementById("NewContent").innerHTML =
    "<table>" +
    '<tr valign="top">' +
    '<td class="text">' +
    '<p class="title">Serial Setting</p>' +
    '<table style="width:418px;">' +
    "<tr>" +
    '<td class="solidTableTitle" style="border:none;width:132"><p align="left" class="text">COM Selection :</p></td>' +
    '<td class="solidTableTitle" style="border:none;width:266;text-align:left;">' +
    '<span class="datavalue">' +
    '<select id="commPort" name=t onChange="change_com();">' +
    '<option value="A" ' +
    com_select1 +
    ">COM1</option>" +
    '<option value="B" ' +
    com_select2 +
    ">COM2</option>" +
    '<option value="C" ' +
    com_select3 +
    ">COM3</option>" +
    "</select>" +
    "</span></td></tr>" +
    "</table>" +
    '<table style="width:418px;height:66;" border: 1px;>' +
    "<tr>" +
    '<td class="solidTableTitle" width="132"><p align="center" class="style2">Serial COM</p></td>' +
    '<td class="solidTableTitle" width="266"><div align="center"><span class="style2">Setting</span></div></td></tr>' +
    "<tr>" +
    '<td class="solidTable"><p class="text">Baud Rate</p></td>' +
    '<td class="solidTable">' +
    '<span class="datavalue">' +
    '<select id="baudRate" name=T>' +
    '<option value="A" ' +
    baud_rate1 +
    ">300</option>" +
    '<option value="B" ' +
    baud_rate2 +
    ">600</option>" +
    '<option value="C" ' +
    baud_rate3 +
    ">1200</option>" +
    '<option value="D" ' +
    baud_rate4 +
    ">2400</option>" +
    '<option value="E" ' +
    baud_rate5 +
    ">4800</option>" +
    '<option value="F" ' +
    baud_rate6 +
    ">9600</option>" +
    '<option value="G" ' +
    baud_rate7 +
    ">14400</option>" +
    '<option value="H" ' +
    baud_rate8 +
    ">19200</option>" +
    '<option value="I" ' +
    baud_rate9 +
    ">38400</option>" +
    '<option value="J" ' +
    baud_rate10 +
    ">57600</option>" +
    '<option value="K" ' +
    baud_rate11 +
    ">115200</option>" +
    '<option value="L" ' +
    baud_rate12 +
    ">230400</option></select>" +
    "</span></td></tr>" +
    "<tr>" +
    '<td class="solidTable"><p class="text">Data Bits</p></td>' +
    '<td class="solidTable">' +
    '<span class="datavalue">' +
    '<select id="dataBits" name=U2>' +
    '<option value="7" ' +
    data_bits1 +
    ">7</option>" +
    '<option value="8" ' +
    data_bits2 +
    ">8</option></select>" +
    "</span></td></tr>" +
    "<tr>" +
    '<td class="solidTable"><p class="text">Flow Control</p></td>' +
    '<td class="solidTable">' +
    '<span class="datavalue">' +
    '<select id="flowControl" name=U4>' +
    '<option value="n" ' +
    flow_control1 +
    ">None</option>" +
    '<option value="X" ' +
    flow_control2 +
    ">Xon/Xoff</option>" +
    '<option value="R" ' +
    flow_control3 +
    ">RTS/CTS</option></select></span></td></tr>" +
    "<tr>" +
    '<td class="solidTable"><p class="text">Parity</p></td>' +
    '<td class="solidTable">' +
    '<span class="datavalue">' +
    '<select id="parity" name=U1>' +
    '<option value="N" ' +
    parity1 +
    ">None</option>" +
    '<option value="E" ' +
    parity2 +
    ">Even</option>" +
    '<option value="O" ' +
    parity3 +
    ">Odd</option></select></span></td></tr>" +
    "<tr>" +
    '<td class="solidTable"><p class="text">Stop Bits</p></td>' +
    '<td class="solidTable">' +
    '<span class="datavalue">' +
    '<select id="stopBits" name=U3>' +
    '<option value="1" ' +
    stop_bits1 +
    ">1</option>" +
    '<option value="H" ' +
    stop_bits2 +
    ">1.5</option>" +
    '<option value="2" ' +
    stop_bits3 +
    ">2</option></select></span></td></tr>" +
    "</table>" +
    '<p><button type="button" onclick="update_com()">Save changes</button></p>' +
    "</td>" +
    "</tr>" +
    "</table>";
  if (file_prefix == "NMINI2") {
    var x = document.getElementById("commPort");
    x.remove(2);
  }
}
function Right(str, n) {
  if (n <= 0) {
    return "";
  } else if (n > String(str).length) {
    return str;
  } else {
    var iLen = String(str).length;
    return String(str).substring(iLen, iLen - n);
  }
}
function Left(str, n) {
  if (n <= 0) {
    return "";
  } else if (n > String(str).length) {
    return str;
  } else {
    return String(str).substring(0, n);
  }
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
function drawDiag() {
  document.getElementById("NewContent").innerHTML =
    "<table>" +
    '<tr valign="top">' +
    '<td class="text">' +
    '<p class="title">Firmware Upload</p>' +
    '<form id="sendform" action="HS.bin" enctype="multipart/form-data" method="post" target="upload_target">' +
    '<p><input type="file" id="datafile" name="datafile" size="30" ' +
    diag2 +
    "></p>" +
    '<p><div id="diag_btn"><button type="button" onclick="StartSend();">Upload firmware</button></div></p>' +
    '<p><div id="diag_img"><p class="textNewContent">Uploading firmware ... <img src="5loader.gif"/></p></div></p>' +
    "<p>1. Please take note that web upload firmware have the extension <strong>.web</strong>." +
    "<p>2. Please do not leave the page until the firmware upload is completed.</p>" +
    '<p class="errorText" style="font-size: 12px; text-align:left;">3. Please ensure correct firmware being flashed, failure of such may cause total system malfunction.</p>' +
    "</form></td></tr>" +
    '</table><iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe>';
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
function drawReset() {
  var dhtml =
    '<div><p class="title">  Please Wait ...</p>' +
    '<p class="style7">Please wait while the configuration is being validated...<br>' +
    "At the end of the process, the unit will reboot in order to apply new settings.</p>" +
    '<p><img src="5loader.gif"/></p></div>';
  WriteHtml("NewContent", dhtml);
  if (ResetType == "Apply Settings") setTimeout("get_status(ResetDone)", 3000);
  else get_status(ResetDone);
}
function drawCommit() {
  var dhtml =
    '<div class="errorText">*** Parameter Configuration is prohibited !!! ***<br><br>' +
    "You are <strong>NOT ALLOW</strong> to make further changes on the parameter setting.<br>" +
    "Please reset board to factory default to proceed. <br />Thank you.</div>";
  WriteHtml("NewContent", dhtml);
}
function WriteHtml(eid, msg) {
  document.getElementById(eid).innerHTML = msg;
}
var milisec = 0;
var seconds = CountdownTimeout;
function display_timer() {
  if (seconds == 0) {
    hide_timer(0);
  }
  if (milisec <= 0) {
    milisec = 9;
    seconds -= 1;
  }
  if (seconds <= -1) {
    milisec = 0;
    seconds += 1;
  } else {
    milisec -= 1;
    document.getElementById("popup_timer").innerHTML = seconds + "." + milisec;
    popup_display_timer = setTimeout(display_timer, 100);
  }
}
function pop_timer() {
  disable_bg();
  document.getElementById("NewPopup").style.display = "block";
  document.getElementById("pop1").style.display = "block";
  seconds = CountdownTimeout;
  display_timer();
}
function hide_timer(refresh) {
  clearTimeout(popup_display_timer);
  enable_bg();
  document.getElementById("pop1").style.display = "none";
  document.getElementById("NewPopup").style.display = "none";
  if (refresh == 1) {
    Countdown();
    session_chk(1);
  } else {
    GoHome();
  }
}
function cancel_Countdown() {
  if (typeof Countdown_timer != "undefined") {
    clearTimeout(Countdown_timer);
  }
}
function Countdown() {
  cancel_Countdown();
  Countdown_timer = setTimeout(pop_timer, ShowPopupTimeout);
}
function GoHome() {
  window.location = "http://" + getHost();
}
function CheckActiveNodeBeforeReset() {
  redundant_node = encodeURIComponent(
    document.getElementById("redundant_node").value
  );
  current_active_node = encodeURIComponent(
    document.getElementById("current_active_node").value
  );
  if (redundant_node == current_active_node && 1 == reset_node) {
    reset_node = 0;
    alert("Caution, active server setting is not allow to reset!");
    return true;
  } else {
    return false;
  }
}
function ClearTextBox() {
  if (true == document.getElementById("B2").checked) {
    document.getElementById("Ir").value = "";
    document.getElementById("W0").value = "";
  } else if (true == document.getElementById("B1").checked) {
    document.getElementById("Ir").value = "";
    document.getElementById("dynamic_dns").value = "";
    document.getElementById("W0").value = "";
  } else {
  }
}
function ToResetNode() {
  var Server_IP = document.getElementById("Ir").value;
  var dsn_IP = document.getElementById("dynamic_dns").value;
  var ServerPort = document.getElementById("W0").value;
  if (true == document.getElementById("B1").checked) {
    if (
      Server_IP == "0.0.0.0" ||
      Server_IP == "" ||
      dsn_IP == "0.0.0.0" ||
      dsn_IP == "" ||
      ServerPort == "0" ||
      ServerPort == ""
    ) {
      reset_node = 1;
      return true;
    } else {
      reset_node = 0;
      return false;
    }
  } else if (true == document.getElementById("B2").checked) {
    if (
      Server_IP == "0.0.0.0" ||
      Server_IP == "" ||
      ServerPort == "0" ||
      ServerPort == ""
    ) {
      reset_node = 1;
      return true;
    } else {
      reset_node = 0;
      return false;
    }
  } else {
    return false;
  }
}
function VerifyInputBasedOn_DNS_selection() {
  if (true == document.getElementById("B1").checked) {
    if (reset_node) {
      return CheckNetworkSetting();
    } else {
      return (
        CheckNetwork_And_ServerSetting() &&
        verifyIP(document.getElementById("dynamic_dns").value, "DNS IP")
      );
    }
  } else if (true == document.getElementById("B2").checked) {
    if (reset_node) {
      return CheckNetworkSetting();
    } else {
      return CheckNetwork_And_ServerSetting();
    }
  } else {
    return false;
  }
}
function CheckNetworkSetting() {
  return (
    verifyIP(document.getElementById("Ii").value, "IP Address") &&
    verifyIP(document.getElementById("subnet_mask").value, "Subnet Mask") &&
    verifyIP(document.getElementById("Ig").value, "Default Gateway") &&
    verify_ControllerIP_NotSameAs_ServerIP(
      document.getElementById("Ii").value,
      document.getElementById("Ir").value
    ) &&
    verifyNumRange(document.getElementById("W1").value, "Port Forwarding")
  );
}
function CheckNetwork_And_ServerSetting() {
  return (
    CheckNetworkSetting() &&
    isValid(document.getElementById("Ir").value, "Host Name / Static IP") &&
    verifyNumRange(document.getElementById("W0").value, "Port Number")
  );
}
