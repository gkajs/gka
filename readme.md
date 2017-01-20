gka
---

Generate Keyframes Animation  or Tiny Images

Install
-------
Install [node](http://nodejs.org) then:
```sh
$ npm install -g gka
```
*Linux/Mac users may need to run the above with `sudo`*


Usage
-----
```
$ gka <options> <files>

-f, --folder <string> image folder
-r, --rename <string> rename
-s, --sprites <string> sprites image
-i, --image <string> tiny image

```

Examples
--------


Generate Keyframes Animation - **Normal style**

```sh
$ gka -r [name] -f [imageFolderPath]
```

Generate Keyframes Animation - **Sprites style**

```sh
$ gka -r [name] -f [imageFolderPath] -s true
```

Tiny Images

```sh
$ gka -i [imageFolderPath]
```
