const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));

app.post("/HS.bin", (req, res) => {
  res.send(
    '<script language="javascript" type="text/javascript">window.StopSend(1);</script>'
  );
  res.status(200);
});

app.post("/api/lpr", (req, res) => {
  res.status(200);
  res.send("OK");
})

app.get("/devices", (req, res) => {
  setTimeout(() => {
    res.json({
      payload: [
        {
          name: "Nmini",
          category: "A Series Controller",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          value: 0,
          desc: "Our most powerful controller",
        },
        {
          name: "Nmini",
          category: "A Series Controller",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          value: 0,
          desc: "Our most geng chau controller",
        },
        {
          name: "Nmini",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          category: "A Series Controller",
          value: 0,
          desc: "Our most cokia controller",
        },
        {
          name: "Nmini",
          category: "A Series Controller",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          value: 0,
          desc: "Our most cokia controller",
        },
        {
          name: "Nmini",
          category: "3rd Party Controller",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          value: 0,
        },
        {
          name: "Nmini",
          category: "B Series Controller",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          value: 0,
        },
        {
          name: "Nmini",
          category: "EntryPass Controller",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          value: 0,
        },
        {
          name: "Nmini",
          category: "EntryPass Controller",
          imageUrl:
            "https://picsum.photos/seed/" +
            (Math.random() * 100 + 1) +
            "/200/200",
          value: 0,
        },
      ],
    });
    res.status(200);
  }, 3000);
});

app.get("/discovery-devices", (req, res) => {
  setTimeout(() => {
    res.json({
      payload: [
        {
          mac: "00:2C:3D:4E:5F:6A",
          ip: "192.168.0.11",
          configured: true,
          vendor: "Juniper",
          logo: "https://via.placeholder.com/150?text=Juniper+Logo",
        },
        {
          mac: "00:2D:3E:4F:5A:6B",
          ip: "192.168.0.12",
          configured: false,
          vendor: "Huawei",
          logo: "https://via.placeholder.com/150?text=Huawei+Logo",
        },
        {
          mac: "00:2E:3F:4A:5B:6C",
          ip: "192.168.0.13",
          configured: true,
          vendor: "Linksys",
          logo: "https://via.placeholder.com/150?text=Linksys+Logo",
        },
        {
          mac: "00:2F:3A:4B:5C:6D",
          ip: "192.168.0.14",
          configured: false,
          vendor: "Synology",
          logo: "https://via.placeholder.com/150?text=Synology+Logo",
        },
        {
          mac: "00:3A:4B:5C:6D:7E",
          ip: "192.168.0.15",
          configured: true,
          vendor: "Netgear",
          logo: "https://via.placeholder.com/150?text=Netgear+Logo",
        },
        {
          mac: "00:3B:4C:5D:6E:7F",
          ip: "192.168.0.16",
          configured: true,
          vendor: "Samsung",
          logo: "https://via.placeholder.com/150?text=Samsung+Logo",
        },
        {
          mac: "00:3C:4D:5E:6F:7A",
          ip: "192.168.0.17",
          configured: false,
          vendor: "Cisco",
          logo: "https://via.placeholder.com/150?text=Cisco+Logo",
        },
        {
          mac: "00:3D:4E:5F:6A:7B",
          ip: "192.168.0.18",
          configured: true,
          vendor: "Belkin",
          logo: "https://via.placeholder.com/150?text=Belkin+Logo",
        },
        {
          mac: "00:3E:4F:5A:6B:7C",
          ip: "192.168.0.19",
          configured: false,
          vendor: "Xiaomi",
          logo: "https://via.placeholder.com/150?text=Xiaomi+Logo",
        },
        {
          mac: "00:3F:4A:5B:6C:7D",
          ip: "192.168.0.20",
          configured: true,
          vendor: "Tenda",
          logo: "https://via.placeholder.com/150?text=Tenda+Logo",
        },
      ],
    });
    res.status(200);
  }, 3000);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
