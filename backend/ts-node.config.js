module.exports = {
  esm: true,
  experimentalSpecifierResolution: 'node',
  transpileOnly: true,
  compilerOptions: {
    module: 'nodenext',
    target: 'esnext',
    moduleResolution: 'nodenext',
    allowSyntheticDefaultImports: true,
    esModuleInterop: true
  }
};
