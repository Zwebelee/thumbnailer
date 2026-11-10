# custom/

This is the only folder a company fork or deployment should change. Upstream only ever ships this README and `config.example.json` here, so pulling upstream never conflicts with your files.

- `config.json`: your overrides. Copy `config.example.json` to start. Every key is optional.
- Your assets (`logo.svg`, icons, …). Reference them as `custom/<file>`.

Everything else in this folder is gitignored upstream. In a fork, add new files once with `git add -f public/custom/<file>`.

See the "Customization" section of the main README for the full config reference.
