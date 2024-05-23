# CodeSigningPlugin

This plugin can be used to sign chunks so that their integrity can be verified before execution. You should consider code-signing your chunks when you are using CodeSplitting or ModuleFederation and want to deliver parts of your code remotely to the end-user. Compatible with both JS and Hermes-bytecode bundles.

## Usage

```js title="webpack.config.js"
import * as Repack from '@callstack/repack';

new Repack.plugins.CodeSigningPlugin({
  enabled: mode === 'production',
  privateKeyPath: './code-signing.pem',
  excludeChunks: /local/,
});
```

## Configuration

### privateKeyPath

- **Required**
- Type: `string`

Path to the private key. This can be either a relative path or an absolute one. Relative paths are resolved within `context` provided with project configuration.

### enabled

- Type: `boolean`
- Default: `true`

Whether to enable the plugin. You typically want to enable the plugin only for production builds and disable it for development.

### exludeChunks

- Type: `string[] | RegExp | RegExp[]`
- Default: `[]`

Names of chunks to exclude from code-signing. You might want to use this if some of the chunks in your setup are not being delivered remotely and don't need to be verified.

## Guide

To add code-signing to your app, you first need to generate a pair of cryptographic keys that will be used for both signing the bundles (private key) and verifying their integrity in runtime.

### Creating key pair

In terminal, navigate to your project directory and enter the following commands:

```sh
ssh-keygen -t rsa -b 4096 -m PEM -f code-signing.pem
openssl rsa -in code-signing.pem -pubout -outform PEM -out code-signing.pem.pub
```

### Add the plugin

After that, you need to add `CodeSigningPlugin` to your configuration. Make sure the `privateKeyPath` points to the location of your `code-signing.pem`.

```js title="webpack.config.js" {14-17}
// ...
plugins: [
  new Repack.RepackPlugin({
    context,
    mode,
    platform,
    devServer,
    output: {
      bundleFilename,
      sourceMapFilename,
      assetsPath,
    },
  }),
  new Repack.plugins.CodeSigningPlugin({
    enabled: mode === 'production',
    privateKeyPath: './code-signing.pem',
  }),
];
```

### Add the public key

To be able to verify the bundles in runtime, we need to add the public key (`code-signing.pem.pub`) to the app assets. The public key needs to be included for every platform separately.

#### iOS

You need to add the public key to `ios/<appName>/Info.plist` under the name `RepackPublicKey`. Add the following to your `Info.plist` and then copy the contents of `code-signing.pem.pub` and paste them inside of the `<string>` tags:

```xml title="Info.plist"
<plist>
<dict>
	<key>RepackPublicKey</key>
	<string>
        <!-- contents of your code-signing.pem.pub -->
	</string>
</dict>
</plist>
```

#### Android

You need to add the public key to `android/app/src/main/res/values/strings.xml` under the name `RepackPublicKey`. Add the following to your `strings.xml` and then copy the contents of `code-signing.pem.pub` and paste them inside of the `<string>` tags:

```xml title="strings.xml"
<resources>
	<string name="RepackPublicKey">
        <!-- contents of your code-signing.pem.pub -->
	</string>
</resources>
```

### Enable verification

By default, the bundles are not verified since code-signing is entirely optional. You can enable bundle verification by modyifing the return value of `resolver` added through `ScriptManager.shared.addResolver`.

Go to `index.js` and modify your `ScriptManager` setup like this:

```js title="index.js" {17}
import { ScriptManager, Federated } from '@callstack/repack/client';

const containers = {
  MiniApp: 'http://localhost:9000/[name][ext]',
};

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const resolveURL = Federated.createURLResolver({ containers });

  const url = resolveURL(scriptId, caller);
  if (url) {
    return {
      url,
      query: {
        platform: Platform.OS,
      },
      verifyScriptSignature: __DEV__ ? 'off' : 'strict',
    };
  }
});
```

Integrity verification can be set (through `verifyScriptSignature`) to one of the 3 levels:
| Value | Description |
|---------------|-------------|
| `strict` | Always verify the integrity of the bundle |
| `lax` | Verify the integrity only if the signtarure is present |
| `off` | Never verify the integrity of the bundle |
