“使用严格” ；
//加载所需要的模块
var  http  =  require （'http' ）;
var  url  =  require （'url' ）;
var  fs  =  require （'fs' ）;
var  path  =  require （'path' ）;
var  cp  =  require （'child_process' ）;

//创建服务
var  httpServer  =  http 。createServer （processRequest ）;

var  port  =  80 ;

//指定一个监听的接口
httpServer 。监听（端口， 功能（） {
    控制台。日志（`应用程序正在端口：$ { port } `上运行）；
    控制台。log （`url：http：// localhost：$ { port } ` ）;
    cp 。exec （`explorer http：// localhost：$ { port } ` ， function  （） {
    } ）;
} ）;

//响应请求的函数
函数 processRequest  （请求， 响应） {
    // mime类型
    var  mime  =  {
        “ css”：“ text / css” ，
        “ gif”：“ image / gif” ，
        “ html”：“ text / html” ，
        “ ico”：“ image / x-icon” ，
        “ jpeg”：“ image / jpeg” ，
        “ jpg”：“ image / jpeg” ，
        “ js”：“ text / javascript” ，
        “ json”：“ application / json” ，
        “ pdf”：“ application / pdf” ，
        “ png”：“ image / png” ，
        “ svg”：“ image / svg + xml” ，
        “ swf”：“ application / x-shockwave-flash” ，
        “ tiff”：“ image / tiff” ，
        “ txt”：“文本/纯文本” ，
        “ wav”：“ audio / x-wav” ，
        “ wma”：“ audio / x-ms-wma” ，
        “ wmv”：“ video / x-ms-wmv” ，
        “ xml”：“ text / xml”
    } ;
    
    //请求里面切出标识符字符串
    var  requestUrl  =  request 。网址;
    // url模块的parse方法接受一个字符串，返回一个url对象，切出来路径
    var  pathName  =  url 。解析（requestUrl ）。路径名;

    //对路径解码，防止中文乱码
    var  pathName  =  解码URI （pathName ）;

    //解决301重定向问题，如果pathname没以/结尾，并且没有扩展名
    //如果（！pathName.endsWith（'/'）&& path.extname（pathName）===''）{
    // pathName + ='/';
    // var redirect =“ http：//” + request.headers.host + pathName;
    // response.writeHead（301，{
    //位置：重定向
    //}）;
    // //response.end方法用来响应完成后关闭本次对话，也可以编写HTTP响应的具体内容。
    // response.end（）;
    //}

    //获取资源文件的绝对路径
    var  filePath  =  path 。解析（__dirname  +  pathName ）;
    控制台。日志（filePath ）;
    //获取对应文件的文档类型
    //我们通过path.extname来获取文件的后缀名。由于extname返回值包含“。”，所以通过slice方法来剔除掉”。”，
    //对于没有后缀名的文件，我们一律认为是未知。
    var  ext  =  path 。extname （pathName ）;
    ext  =  ext吗？分机。切片（1 ）：“未知” ；

    //未知的类型一律用“ text / plain”类型
    var  contentType  =  mime [ ext ]  ||  “文本/纯文本” ；

    fs 。stat （filePath ， （err ， stats ） =>  {
        如果 （err ） {
            反应。writeHead （404 ， {  “ content-type”：“ text / html”  } ）；
            反应。结束（“ <h1> 404未找到</ h1>” ）；
        }
        //没出错且文件存在
        如果 （！ERR  &&  统计。ISFILE （）） {
            readFile （filePath ， contentType ）;
        }
        //如果路径是目录
        如果 （！ERR  &&  统计。isDirectory （）） {
            var  html  =  “ <head> <元字符集='utf-8'/> </ head> <body> <ul>” ；
            //读取该路径下文件
            fs 。readdir （filePath ， （err ， files ） =>  {
                如果 （err ） {
                    控制台。log （“读取路径失败！” ）;
                }  其他 {
                    //整理一个链接表，方便用户访问
                    var  flag  =  false ;
                    对于 （文件的var  个文件）{   
                        //如果在目录下找到index.html，直接读取这个文件
                        如果 （file  ===  “ index.html” ） {
                            READFILE （文件路径 +  （文件路径[ 文件路径。长度- 1 ] == '/' ？'' ：'/' ） +  '的index.html' ， “text / html的” ）;
                            标志 =  true ;
                            休息;
                        } ;
                        HTML  + =  `<LI> <a href=' ${ 文件 }'> $ { 文件} </A> </ LI>` ;
                    }
                    如果（！标志） {
                        html  + =  '</ ul> </ body>' ;
                        反应。writeHead （200 ， {  “ content-type”：“ text / html”  } ）；
                        反应。结束（html ）;
                    }
                }
            } ）;
        }

        //读取文件的函数
        函数 readFile （filePath ， contentType ）{
            反应。writeHead （200 ， {  “ content-type”：contentType  } ）；
            //建立流对象，读文件
            var  stream  =  fs 。createReadStream （filePath ）;
            //错误处理
            流。on （'error' ， function （） {
                反应。writeHead （500 ， {  “ content-type”：contentType  } ）；
                反应。结束（“ <h1> 500服务器错误</ h1>” ）；
            } ）;
            //读取文件
            流。管道（响应）;
        }
    } ）;
}
