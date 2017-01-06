gka
---

Generate Keyframes Animation

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
-r, --rename <string>   
 
```

Examples
--------

```sh
$ gka -r [name] -f [filepath]

or

Sprites
$ gka -r [name] -f [filepath] -s true

```

Test
-----

```sh
$ node test -r [name] -f [filepath]
```
