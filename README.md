# cs-compiler

*cs-compiler* は *C#* のソースコードのコンパイルや実行をサポートする。[*wes*](https://github.com/wachaon/wes)
 用のパッケージになります。

 ## インストール

 ```bat
 wes install @wachaon/cs-compiler
 ```

 ## 用法

(`replaceExt()` は *wes* の *version* が `0.13.21` 以上が必要です。)

 ```javascript
const { compile, execute } = require('/index')
const { replaceExt, resolve } = require('pathname')
const { download, existsFileSync, deleteFileSync } = require('filesystem')

const source = `using System.Media;

class Program
{
    static void Main(string[] args)
    {
        SoundPlayer player = new SoundPlayer(args[0]);
        player.PlaySync();
    }
}`

const media = 'https://www.ne.jp/asahi/music/myuu/wave/fanfare.wav'
const dist = resolve(process.cwd(), media.split('/').slice(-1)[0])
const csharp = compile(source)
const player = replaceExt(csharp, '.exe')
download(media, dist)
execute(player, dist)
if (existsFileSync(player)) console.info(deleteFileSync(player))
if (existsFileSync(dist)) console.info(deleteFileSync(dist))
 ```