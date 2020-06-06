const express = require("express");
const os = require("os");
const ifaces = os.networkInterfaces();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => res.send(getIfacesAddresses()));

app.get("/whos-there", (req, res) => {
  res.send(getIfacesAddresses());
});

function getIfacesAddresses() {
  return Object.keys(ifaces).map(function (ifname) {
    var alias = 0;
    return ifaces[ifname].map(function (iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      let addr
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        addr = ifname+":"+alias + iface.address
      } else {
        // this interface has only one ipv4 adress
        addr = ifname + iface.address
      }
      ++alias;
      return addr
    }).filter(iface => !!iface);
  }).filter(ifaces => ifaces.length > 0);
}

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
