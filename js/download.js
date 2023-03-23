function fnExcelReport(){
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    var tab = document.getElementById('selTbl'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
    }
    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs", true, "afvalroutes.xlsx");
    }  
    else  {            //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  
	}
    return (sa);
}

var download =  function (data, strFileName, strMimeType) {
	
	var self = window, // this script is only for browsers anyway...
		u = "application/octet-stream", // this default mime also triggers iframe downloads
		m = strMimeType || u, 
		x = data,
		D = document,
		a = D.createElement("a"),
		z = function(a){return String(a);},
		B = (self.Blob || self.MozBlob || self.WebKitBlob || z);
		B=B.call ? B.bind(self) : Blob ;
		var fn = strFileName || "download",
		blob, 
		fr;

	if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
		x=[x, m];
		m=x[0];
		x=x[1]; 
	}


	//go ahead and download dataURLs right away
	if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
		return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
			navigator.msSaveBlob(d2b(x), fn) : 
			saver(x) ; // everyone else can save dataURLs un-processed
	}//end if dataURL passed?
	
	blob = x instanceof B ? 
		x : 
		new B([x], {type: m}) ;
	
	
	function d2b(u) {
		var p= u.split(/[:;,]/),
		t= p[1],
		dec= p[2] == "base64" ? atob : decodeURIComponent,
		bin= dec(p.pop()),
		mx= bin.length,
		i= 0,
		uia= new Uint8Array(mx);

		for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

		return new B([uia], {type: t});
	 }
	  
	function saver(url, winMode){
		
		if ('download' in a) { //html5 A[download] 			
			a.href = url;
			a.setAttribute("download", fn);
			a.innerHTML = "downloading...";
			D.body.appendChild(a);
			setTimeout(function() {
				a.click();
				D.body.removeChild(a);
				if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
			}, 66);
			return true;
		}

		if(typeof safari !=="undefined" ){ // handle non-a[download] safari as best we can:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
			if(!window.open(url)){ // popup blocked, offer direct download: 
				if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
			}
			return true;
		}
		
		//do iframe dataURL download (old ch+FF):
		var f = D.createElement("iframe");
		D.body.appendChild(f);
		
		if(!winMode){ // force a mime that will download:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
		}
		f.src=url;
		setTimeout(function(){ D.body.removeChild(f); }, 333);
		
	}

	if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
		return navigator.msSaveBlob(blob, fn);
	} 	
	
	if(self.URL){ // simple fast and modern way using Blob and URL:
		saver(self.URL.createObjectURL(blob), true);
	}else{
		// handle non-Blob()+non-URL browsers:
		if(typeof blob === "string" || blob.constructor===z ){
			try{
				return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  ); 
			}catch(y){
				return saver( "data:" +  m   + "," + encodeURIComponent(blob)  ); 
			}
		}
		
		// Blob but not URL:
		fr=new FileReader();
		fr.onload=function(e){
			saver(this.result); 
		};
		fr.readAsDataURL(blob);
	}	
	return true;
}

var dlCsv = function( sep ) {
	if( !sep ) sep = ";";
	
	var feats =  select.getFeatures().getArray();
	var csvRows = [];

	for(var i=0, l=feats.length; i<l; ++i){
		csvRows.push( feats[i].get('WS_OIDN') + sep + feats[i].get('LSTRNM') );
	}

	var csvString = csvRows.join("%0A");
	var a         = document.createElement('a');
	a.href        = 'data:attachment/csv,' + csvString;
	a.target      = '_blank';
	a.download    = 'myFile.csv';
	document.body.appendChild(a);
	a.click();

	// var feats =  select.getFeatures().getArray();
	// var csvContent = "data:text/csv;charset=utf-8,";
	// csvContent += 'ID'+ sep +'NAME\r\n'
	// feats.forEach(function(feat, index){
		// dataString = feat.get('WS_OIDN') + sep + feat.get('LSTRNM');
		// csvContent += index < feats.length -1 ? dataString+ '\r\n' : dataString;
	// }); 
	// var encodedUri = encodeURI(csvContent);
	// var link = document.createElement("a");
	// link.setAttribute("href", encodedUri);
	// link.setAttribute("download", "afvalroutes.tab");
	// document.body.appendChild(link); // Required for FF
	// link.click();
}
