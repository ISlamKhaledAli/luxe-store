# Salla theme — official documentation

## Theme development (Twilight)

- [Develop a theme (workflow, watcher, webpack)](https://docs.salla.dev/421878m0)
- [Create a Salla theme (Partners + `twilight.json`)](https://docs.salla.dev/421877m0)

## Salla CLI

- [Theme preview command](https://docs.salla.dev/doc-422776?nav=01HNA8QHCPJTCY5VSEZ616JCAK)
- [Create theme](https://docs.salla.dev/doc-422775/?nav=01HNA8QHCPJTCY5VSEZ616JCAK)
- [Twilight themes commands overview](https://docs.salla.dev/849558f0)
- [Salla CLI repository](https://github.com/SallaApp/Salla-CLI)
- [Report CLI / preview bugs](https://github.com/SallaApp/Salla-CLI/issues)

## This project

- Run preview: `salla theme preview` (from this folder; commit when prompted).
- If preview dies right after webpack compiles (“Command failed: pnpm run watch”), webpack was exiting because stdin closed under `execSync`. This theme sets `watchOptions.stdin: false` and `--no-watch-options-stdin` on the watch script — keep that intact.
- Open these links in the browser: `npm run docs`
- Watcher is patched (see `patches/` + `postinstall`): correct `salla theme sync` flags and safe handling when the design upload API errors.

If Twig sync shows warnings or the preview iframe still shows the default **Raed** layout, the remote `salla.design` upload endpoint may be failing—track it via the issues link above and Salla support.
