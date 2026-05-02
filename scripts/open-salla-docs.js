/**
 * Opens official Salla theme / CLI documentation in your default browser.
 * Run: npm run docs
 */
const { exec } = require("child_process");

const urls = [
  "https://docs.salla.dev/421878m0",
  "https://docs.salla.dev/doc-422776?nav=01HNA8QHCPJTCY5VSEZ616JCAK",
  "https://docs.salla.dev/849558f0",
  "https://github.com/SallaApp/Salla-CLI",
  "https://github.com/SallaApp/Salla-CLI/issues",
];

function open(url) {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) console.error(url, err.message);
  });
}

console.log("Opening Salla documentation in your browser…");
urls.forEach((u, i) => setTimeout(() => open(u), i * 400));
