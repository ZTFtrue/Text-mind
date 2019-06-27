# Text-mind

  Construct a mind map through text

## How to run

 Download[release](https://github.com/ZTFtrue/Text-mind/releases) __or__ Run from source code:

```sh
npm install
npm run start
```

Then select your file,file like [this](https://github.com/ZTFtrue/Math-study/blob/master/math.gd)

The file is text file by utf-8 encoded.Distinguish comments, configurations, and body text with "###". In front of "###" is the comment and configuration, followed by the body. Currently supported configurations include indented spaces, svg height and width, respectively "svg-height, svg-width, tab-index".

Each action is a node, the content after the double space is not displayed on the node, and the double space indicates the line break. If there is an "@" at the beginning of the line, it means that the line follows the previous line and wraps.

![eg](./img/img1.jpg)
![eg](./img/img2.jpg)

## Troubled

The following problems may occur on some Linux devices.

```sh
[12419:0602/204432.273114:FATAL:setuid_sandbox_host.cc(157)] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that ./node_modules/electron/dist/chrome-sandbox is owned by root and has mode 4755.
```

[reference](https://github.com/electron/electron/issues/17972)。

```sh
sudo chown root your_path/node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 your_path/node_modules/electron/dist/chrome-sandbox
```

or

```sh
sudo sysctl kernel.unprivileged_userns_clone=1
```
