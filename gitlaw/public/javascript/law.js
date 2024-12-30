// uncomment these when running local or backend

//var json = require('./ley2.json');
//const Diff = require('diff');

var lawversion1='';
var lawversion2='';

// version1 before version2
function hasChanges(jsondata,version1,version2){
	var hasChangesVar = false;
	if (version2==''){
		return false;
	}
	if (version1==version2){
		return false;
	}
	if ( Array.isArray(jsondata.content)){
		//console.log("---Traverse");
		for (var index=0; index<jsondata.content.length;index++){
			hasChangesVar = hasChangesVar || hasChanges(jsondata.content[index],version1,version2);
		}
		return hasChangesVar;
	} else {
		if (jsondata.versions){
			var dates = Object.keys(jsondata.versions).sort();

			for ( var index = dates.length-1;index>0;index--){
				if ( ( version2 >= dates[index]) && (version1< dates[index]) ){
					return true;
				}
			}
		}
		else {
			return false;
		}
	}
}

function printArticle(indent,jsondata,version1,version2){
	var generatedhtml='';

	if ( version2 == '') {
		generatedhtml = indent + '<article class="'+jsondata.class+'" id="maindoc">';
		generatedhtml = generatedhtml + '\n' + indent + indent + jsondata.text;
		

		if ( Array.isArray(jsondata.content)){
			//console.log("---Traverse");
			generatedhtml = generatedhtml + '\n' + indent + indent + jsondata.desc;
		
			for (var index=0; index<jsondata.content.length;index++){
				generatedhtml = generatedhtml + '\n' + printArticle(indent+"  ",jsondata.content[index],version1,version2);
			}
		} else {
			//console.log("---String");
			if (jsondata.versions){
				var dates = Object.keys(jsondata.versions).sort();

				for ( var index = dates.length-1;index>0;index--){
					if ( version1 >= dates[index]){
						generatedhtml = generatedhtml + '\n' + indent + indent + jsondata.versions[dates[index]].desc;
		
						generatedhtml = generatedhtml + '\n' + indent + indent +jsondata.versions[dates[index]].content;
						generatedhtml = generatedhtml + '\n' + indent + '</article>';

						return generatedhtml;
					}
				}

				generatedhtml = generatedhtml + '\n' + indent + indent +jsondata.versions[dates[0]].content;

				
			} else {
				generatedhtml = generatedhtml + '\n' + indent + indent + jsondata.desc;
		
				generatedhtml = generatedhtml + '\n' + indent + indent +jsondata.content;	
			}
			
		}

		generatedhtml = generatedhtml + '\n' + indent + '</article>';

		return generatedhtml;

	} else {
		// compare versions
		if ( ! hasChanges(jsondata,version1,version2) ){
			return '';
		}

		if (indent==''){
			generatedhtml = indent + '<article class="'+jsondata.class+'" id="maindoc">';
		} else {
			generatedhtml = indent + '<article class="'+jsondata.class+'" >';
		}
		generatedhtml = generatedhtml + '\n' + indent + indent + jsondata.text;
		

		if ( Array.isArray(jsondata.content)){
			//console.log("---Traverse");
			generatedhtml = generatedhtml + '\n' + indent + indent + jsondata.desc;
		
			var filler = '';
			for (var index=0; index<jsondata.content.length;index++){
				if (! hasChanges(jsondata.content[index],version1,version2) ){ 
					filler = '\n' + indent + indent + '<p>(...)</p>';
				} else {
					generatedhtml = generatedhtml + filler;
					generatedhtml = generatedhtml + '\n' + printArticle(indent+"  ",jsondata.content[index],version1,version2);
					filler = '';
				}
			}
			generatedhtml = generatedhtml + filler;
		} else {
			var dates = Object.keys(jsondata.versions).sort();
			var date1 = dates[0];
			var date2 = '';
			for ( var index = dates.length-1;index>0;index--){
				if ( ( date2 == '') && ( version2 >= dates[index]) ){
					date2 = dates[index];
				}
				if ( ( date1 == '') && ( version1 >= dates[index])){
					date1 = dates[index];
				}
			}

			var differences = Diff.diffWords(jsondata.versions[date1].desc+jsondata.versions[date1].content, 
				                             jsondata.versions[date2].desc+jsondata.versions[date2].content);
			for ( var index=0;index<differences.length;index++){
				if ( (! (differences[index].added) ) && (! (differences[index].removed)) ){
					generatedhtml = generatedhtml + '\n' + indent + indent + differences[index].value;
				} else if ( (differences[index].added) && ( ! (differences[index].removed)) ){

					generatedhtml = generatedhtml + '\n' + indent + indent + '<ins>' + 
					                differences[index].value.replaceAll('</p>','</ins></p>').replaceAll('<p>','<p><ins>') + '</ins>';
				} else if (  ( ! (differences[index].added) ) && (differences[index].removed) ){
					generatedhtml = generatedhtml + '\n' + indent + indent + '<del>' + 
									differences[index].value.replaceAll('</p>','</del></p>').replaceAll('<p>','<p><del>') + '</del>';
				}
			}
			console.log(differences);
			
		}

		generatedhtml = generatedhtml + '\n' + indent + '</article>';

		return generatedhtml;
	}

	
}

function historyLabel(index,versions){
	var year = versions[index].substring(0, 4);
	var month = versions[index].substring(4, 6);
	var day = versions[index].substring(6, 8);

	var ret_val = day + "/" + month + "/" + year;

	if (index == 0){
		ret_val = ret_val +  " (inicial)";
	}

	if (index == versions.length-1){
		ret_val = ret_val + " (actual)"
	}

	return ret_val;
}


function printHistory(json){
	//console.log("printHistory started");

	var ret_html='';

	var ret_menus='<div id="multilink" style="position: absolute;display: none;z-index: 100;background-color: #AAAAAA;" >TEXTO TEXTO</div>';

	var versions = json.versions;

	for (var index=versions.length-1;index>=0;index--){
		ret_html = ret_html + 
		'<div class="timeline__item timeline__item--right" onclick="showMenuVersion(event,\''+versions[index]+'\')">\n'+
  		'   <div class="timeline__bubble" id="bubble_'+versions[index]+'" style="background-color: #fff;border: 4px solid #000;border-radius: 50%;content: \'\';height: 20px;right: -10px;-webkit-transform: translateY(-50%);-ms-transform: translateY(-50%);transform: translateY(-50%);top: 50%;width: 20px;z-index: 3;/*! left: -10px; */position: relative;/*! margin-top: 40px; */top: 30px;left: -50px;">\n'+
  		'   </div>\n'+
        '   <div class="timeline__item__inner" style="position: relative;top: -10px;left: -20px;width: 100%;">\n'+
        '   <div class="timeline__content__wrap"><div class="timeline__content" id="history_label_'+versions[index]+'" style="padding-top: 5px;padding-bottom: 5px;">\n'+
          historyLabel(index,versions)+
        '	</div>\n'+
        '</div></div>\n'+
        '</div>\n';

        //ret_menus = ret_menus +
        //'<div id="menu_'+versions[index]+'" style="position: absolute;display: none;z-index: 100;background-color: #AAAAAA;" >TEXTO TEXTO</div>';

	}

	//console.log(ret_html);

   return [ret_html,ret_menus];

}



//console.log(printArticle("",json,'19920828',''));
//console.log(printArticle("",json,'19781229','20240217'));

//console.log(printHistory(json));
