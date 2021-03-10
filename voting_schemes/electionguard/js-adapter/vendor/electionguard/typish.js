var Module=typeof pyodide._module!=="undefined"?pyodide._module:{};Module.checkABI(1);if(!Module.expectedDataFileDownloads){Module.expectedDataFileDownloads=0;Module.finishedDataFileDownloads=0}Module.expectedDataFileDownloads++;(function(){var loadPackage=function(metadata){var PACKAGE_PATH;if(typeof window==="object"){PACKAGE_PATH=window["encodeURIComponent"](window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/")}else if(typeof location!=="undefined"){PACKAGE_PATH=encodeURIComponent(location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/")}else{throw"using preloaded data can only be done on a web page or in a web worker"}var PACKAGE_NAME="typish.data";var REMOTE_PACKAGE_BASE="typish.data";if(typeof Module["locateFilePackage"]==="function"&&!Module["locateFile"]){Module["locateFile"]=Module["locateFilePackage"];err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")}var REMOTE_PACKAGE_NAME=Module["locateFile"]?Module["locateFile"](REMOTE_PACKAGE_BASE,""):REMOTE_PACKAGE_BASE;var REMOTE_PACKAGE_SIZE=metadata.remote_package_size;var PACKAGE_UUID=metadata.package_uuid;function fetchRemotePackage(packageName,packageSize,callback,errback){var xhr=new XMLHttpRequest;xhr.open("GET",packageName,true);xhr.responseType="arraybuffer";xhr.onprogress=function(event){var url=packageName;var size=packageSize;if(event.total)size=event.total;if(event.loaded){if(!xhr.addedTotal){xhr.addedTotal=true;if(!Module.dataFileDownloads)Module.dataFileDownloads={};Module.dataFileDownloads[url]={loaded:event.loaded,total:size}}else{Module.dataFileDownloads[url].loaded=event.loaded}var total=0;var loaded=0;var num=0;for(var download in Module.dataFileDownloads){var data=Module.dataFileDownloads[download];total+=data.total;loaded+=data.loaded;num++}total=Math.ceil(total*Module.expectedDataFileDownloads/num);if(Module["setStatus"])Module["setStatus"]("Downloading data... ("+loaded+"/"+total+")")}else if(!Module.dataFileDownloads){if(Module["setStatus"])Module["setStatus"]("Downloading data...")}};xhr.onerror=function(event){throw new Error("NetworkError for: "+packageName)};xhr.onload=function(event){if(xhr.status==200||xhr.status==304||xhr.status==206||xhr.status==0&&xhr.response){var packageData=xhr.response;callback(packageData)}else{throw new Error(xhr.statusText+" : "+xhr.responseURL)}};xhr.send(null)}function handleError(error){console.error("package error:",error)}var fetchedCallback=null;var fetched=Module["getPreloadedPackage"]?Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE):null;if(!fetched)fetchRemotePackage(REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE,function(data){if(fetchedCallback){fetchedCallback(data);fetchedCallback=null}else{fetched=data}},handleError);function runWithFS(){function assert(check,msg){if(!check)throw msg+(new Error).stack}Module["FS_createPath"]("/","lib",true,true);Module["FS_createPath"]("/lib","python3.8",true,true);Module["FS_createPath"]("/lib/python3.8","site-packages",true,true);Module["FS_createPath"]("/lib/python3.8/site-packages","typish",true,true);Module["FS_createPath"]("/lib/python3.8/site-packages/typish","functions",true,true);Module["FS_createPath"]("/lib/python3.8/site-packages/typish","classes",true,true);Module["FS_createPath"]("/lib/python3.8/site-packages/typish","decorators",true,true);Module["FS_createPath"]("/lib/python3.8/site-packages","typish-1.9.1-py3.8.egg-info",true,true);function DataRequest(start,end,audio){this.start=start;this.end=end;this.audio=audio}DataRequest.prototype={requests:{},open:function(mode,name){this.name=name;this.requests[name]=this;Module["addRunDependency"]("fp "+this.name)},send:function(){},onload:function(){var byteArray=this.byteArray.subarray(this.start,this.end);this.finish(byteArray)},finish:function(byteArray){var that=this;Module["FS_createPreloadedFile"](this.name,null,byteArray,true,true,function(){Module["removeRunDependency"]("fp "+that.name)},function(){if(that.audio){Module["removeRunDependency"]("fp "+that.name)}else{err("Preloading file "+that.name+" failed")}},false,true);this.requests[this.name]=null}};function processPackageData(arrayBuffer){Module.finishedDataFileDownloads++;assert(arrayBuffer,"Loading data file failed.");assert(arrayBuffer instanceof ArrayBuffer,"bad input to processPackageData");var byteArray=new Uint8Array(arrayBuffer);var curr;var compressedData={data:null,cachedOffset:29216,cachedIndexes:[-1,-1],cachedChunks:[null,null],offsets:[0,1065,2088,3417,4512,5630,6712,8013,9142,10429,11595,12739,13959,15007,16230,17341,18660,19863,21020,22262,23579,24792,25925,27132,28221,29095],sizes:[1065,1023,1329,1095,1118,1082,1301,1129,1287,1166,1144,1220,1048,1223,1111,1319,1203,1157,1242,1317,1213,1133,1207,1089,874,121],successes:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]};compressedData.data=byteArray;assert(typeof Module.LZ4==="object","LZ4 not present - was your app build with  -s LZ4=1  ?");Module.LZ4.loadPackage({metadata:metadata,compressedData:compressedData});Module["removeRunDependency"]("datafile_typish.data")}Module["addRunDependency"]("datafile_typish.data");if(!Module.preloadResults)Module.preloadResults={};Module.preloadResults[PACKAGE_NAME]={fromCache:false};if(fetched){processPackageData(fetched);fetched=null}else{fetchedCallback=processPackageData}}if(Module["calledRun"]){runWithFS()}else{if(!Module["preRun"])Module["preRun"]=[];Module["preRun"].push(runWithFS)}};loadPackage({files:[{filename:"/lib/python3.8/site-packages/typish/_meta.py",start:0,end:238,audio:0},{filename:"/lib/python3.8/site-packages/typish/__init__.py",start:238,end:1686,audio:0},{filename:"/lib/python3.8/site-packages/typish/_types.py",start:1686,end:2114,audio:0},{filename:"/lib/python3.8/site-packages/typish/_state.py",start:2114,end:3370,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_is_optional_type.py",start:3370,end:3995,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/__init__.py",start:3995,end:3995,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_get_alias.py",start:3995,end:5190,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_instance_of.py",start:5190,end:6688,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_common_ancestor.py",start:6688,end:7825,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_subclass_of.py",start:7825,end:13534,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_is_from_typing.py",start:13534,end:13777,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_get_type_hints_of_callable.py",start:13777,end:15360,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_get_args.py",start:15360,end:15777,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_get_simple_name.py",start:15777,end:16313,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_get_mro.py",start:16313,end:17223,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_get_type.py",start:17223,end:21673,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_is_type_annotation.py",start:21673,end:22525,audio:0},{filename:"/lib/python3.8/site-packages/typish/functions/_get_origin.py",start:22525,end:23552,audio:0},{filename:"/lib/python3.8/site-packages/typish/classes/__init__.py",start:23552,end:23552,audio:0},{filename:"/lib/python3.8/site-packages/typish/classes/_cls_function.py",start:23552,end:26473,audio:0},{filename:"/lib/python3.8/site-packages/typish/classes/_cls_dict.py",start:26473,end:28361,audio:0},{filename:"/lib/python3.8/site-packages/typish/classes/_something.py",start:28361,end:33128,audio:0},{filename:"/lib/python3.8/site-packages/typish/classes/_subscriptable_type.py",start:33128,end:34708,audio:0},{filename:"/lib/python3.8/site-packages/typish/classes/_union_type.py",start:34708,end:34886,audio:0},{filename:"/lib/python3.8/site-packages/typish/classes/_literal.py",start:34886,end:37416,audio:0},{filename:"/lib/python3.8/site-packages/typish/decorators/__init__.py",start:37416,end:37416,audio:0},{filename:"/lib/python3.8/site-packages/typish/decorators/_hintable.py",start:37416,end:41280,audio:0},{filename:"/lib/python3.8/site-packages/typish-1.9.1-py3.8.egg-info/dependency_links.txt",start:41280,end:41281,audio:0},{filename:"/lib/python3.8/site-packages/typish-1.9.1-py3.8.egg-info/PKG-INFO",start:41281,end:49593,audio:0},{filename:"/lib/python3.8/site-packages/typish-1.9.1-py3.8.egg-info/requires.txt",start:49593,end:49671,audio:0},{filename:"/lib/python3.8/site-packages/typish-1.9.1-py3.8.egg-info/SOURCES.txt",start:49671,end:51394,audio:0},{filename:"/lib/python3.8/site-packages/typish-1.9.1-py3.8.egg-info/not-zip-safe",start:51394,end:51395,audio:0},{filename:"/lib/python3.8/site-packages/typish-1.9.1-py3.8.egg-info/top_level.txt",start:51395,end:51402,audio:0}],remote_package_size:33312,package_uuid:"94b2774f-fb90-4982-8a85-cbff882f37bc"})})();