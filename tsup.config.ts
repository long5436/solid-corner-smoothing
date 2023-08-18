// tsup.config.ts
import { defineConfig } from 'tsup';
import * as preset from 'tsup-preset-solid';

const preset_options: preset.PresetOptions = {
  // array or single object
  entries: [
    {
      entry: 'src/package/index.ts',
      server_entry: true,
    },
  ],
  // Set to `true` to remove all `console.*` calls and `debugger` statements in prod builds
  drop_console: true,
  // Set to `true` to generate a CommonJS build alongside ESM
  cjs: false,
};

export default defineConfig((config) => {
  const watching = !!config.watch;

  const parsed_data = preset.parsePresetOptions(preset_options, watching);

  if (!watching) {
    const package_fields = preset.generatePackageExports(parsed_data);

    console.log(`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`);

    /*
            will update ./package.json with the correct export fields
        */
    preset.writePackageJson(package_fields);
  }

  const sd = preset.generateTsupOptions(parsed_data);
  sd.forEach((r) => {
    // r.minify = true;
    r.noExternal = ['figma-squircle', 'svgpath'];
    // r.minifyWhitespace = true;
    // r.bundle = true;
  });
  return sd;
});
