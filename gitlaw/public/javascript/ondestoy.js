
// Article classes in order (first top, last bottom)
var article_classes = [];
var offsetview = 120;
var navtitle;

function onde_init(art_classes){
  navtitle = document.getElementById('Navigation');
  navtitle.innerHTML="";

}

function updateCurArticle(curarticle) {

  var newcurarticle=curarticle;

   console.log("updateCurArticle");

   if (curarticle == undefined){
      var list;
      list = getChildArticleNodes(document.getElementById("maindoc"));
      console.log("BODY");
      //console.log(list);
      for (var index=0;index<list.length;index++) {
         //console.log(list[index]);
         if ( isVisibleElementTopHidden(list[index]) ){
            console.log("NEW CURRENT");
            newcurarticle = updateCurArticle(list[index]);
         }
      }

   } else {
      var list;
      list = getChildArticleNodes(curarticle);
      console.log("ARTICLE");
      console.log(curarticle);
      //console.log(list);
      for (var index=0;index<list.length;index++) {
         //console.log(list[index]);
         if ( isVisibleElementTopHidden(list[index]) ){
            console.log("NEW CURRENT");
            newcurarticle = updateCurArticle(list[index]);
         }
      }
   }

   return newcurarticle;

}

function getChildArticleNodes(node) {
  var children = new Array();
  for(var child in node.childNodes) {
      if(node.childNodes[child].nodeType == 1) {
          //console.log( node.childNodes[child].tagName);
          if ( node.childNodes[child].tagName == "ARTICLE" ){
            children.push(node.childNodes[child]);
          }
      }
  }
  return children;
}

  // returns true if part of the element is visible but its heading is not
  function isVisibleElementTopHidden(element) {
    const elementbounds = element.getBoundingClientRect();

    var firstheading = element.firstElementChild;
    const headingbounds = firstheading.getBoundingClientRect();

    if ( ( headingbounds.bottom <= offsetview ) && ( elementbounds.bottom>offsetview ) ){
      return true;
    }
    return false;
  }

  // returns true if part of the element is visible
  function checkElementIsVisible(element){
    const elementbounds = element.getBoundingClientRect();

    return ( (elementbounds.top <= ( window.innerHeight || document.documentElement.clientHeight)) &&
             ( (elementbounds.bottom)>offsetview ) );
    
  }

  // return true if element is totally not visible above
  function checkElementIsUp(element){
    const elementbounds = element.getBoundingClientRect();

    return ( elementbounds.bottom< offsetview );
  }

  // return true if element is totally not visible below
  function checkElementIsDown(element){
    const elementbounds = element.getBoundingClientRect();

    return ( elementbounds.top > ( window.innerHeight && document.documentElement.clientHeight) );
  }

  function IsHiddenOnTop(value) { 
      const item = value.getBoundingClientRect(); 
      //console.log(item.top);
      //console.log(item.bottom);
      //console.log(document.documentElement.clientHeight);

      return (item.bottom <= offsetview); 
  } 


  // curaticle represents the inner most <article> whose top part is hidden
  // on any scroll a check starting from curarticle to
  // * If it is still visibible and top part hidden:
  //   * If there are any childs start on top one see if new curarticle, if found repeat
  // * Else or undefined:
  //   * Start from first level of body->articles if any mark as current and repeat
  // 
  //var curarticle = undefined;
/*
  function getChildArticleNodes(node) {
    var children = new Array();
    for(var child in node.childNodes) {
        if(node.childNodes[child].nodeType == 1) {
            //console.log( node.childNodes[child].tagName);
            if ( node.childNodes[child].tagName == "ARTICLE" ){
              children.push(node.childNodes[child]);
            }
        }
    }
    return children;
  }
*/
  


/*
  var titulos = ['preambulo','tit1','tit2','tit3','tit4','tit5','tit6','tit7','tit8','tit9','tit10',
                  'dispadicionales','disptransitorias','dispderogatoria', 'dispfinal']; // filled from law.json
  var capitulos = ['cap1']; // filled from law.json
  var articulos = ['art10']; // filled from law.json

  var visibilities = {};

  

  // There is a one line of them still showing
  var curTitulo = -1;
  var curCapitulo = -1;
  var curArticulo = -1;

  // returns prev, current, next title to check if any
  function getTituloToCheck(){

    if ( titulos.length == 0 ) {
        return ['','',''];
     }

     if ( curTitulo < 0 ) {
         return ['','',titulos[0]];
     }

     if ( curTitulo == 0 ){
        if (titulos.length > 1 ){
          return ['',titulos[0],titulos[1]];
        } else {
          return ['',titulos[0],''];
        }
     }

     if ( curTitulo >= titulos.lenght ){
         return [titulos[titulos.length-1],'',''];
     }

     if ( curTitulo == titulos.lenght-1 ){
         return [titulos[curTitulo-1],titulos[curTitulo],''];
     }

     return [titulos[curTitulo-1],titulos[curTitulo],titulos[curTitulo+1]];

  }
*/

/*
  function getTituloToCheck2(currentpos){

    if ( titulos.length == 0 ) {
        return ['','',''];
     }

     if ( currentpos < 0 ) {
         return ['','',titulos[0]];
     }

     if ( currentpos == 0 ){
        if (titulos.length > 1 ){
          return ['',titulos[0],titulos[1]];
        } else {
          return ['',titulos[0],''];
        }
     }

     if ( currentpos >= titulos.lenght ){
         return [titulos[titulos.length-1],'',''];
     }

     if ( currentpos == titulos.lenght-1 ){
         return [titulos[currentpos-1],titulos[currentpos],''];
     }

     return [titulos[currentpos-1],titulos[currentpos],titulos[currentpos+1]];

  }
*/
/*
  function findNewCurrent(currentpos,direction){

    const FWD = 1;
    const BKG = -1;
    
    console.log("find new current");
    console.log(currentpos);
    console.log(direction);

    if (currentpos < 0) {
      if (direction == BKG){
        return '';
      } else {
        return findNewCurrent(currentpos+1,FWD);
      }
   
    } else if (currentpos > titulos.lenght-1) {
      if (direction == FWD){
        return '';
      } else {
        return findNewCurrent(currentpos-1,BKG);
      }
    }

    var [prevtitulo,current,nexttitulo] = getTituloToCheck2(currentpos);

    console.log("CURRENT INSIDE RANGE");

 


      var element = document.getElementById(current); 

      if ( element == null){
        console.log("ID NOT FOUND: "+current);
        return '';
      }

      if ( checkElementIsVisible(element) ){
        if ( isVisibleElementTopHidden(element) ){
          curTitulo = currentpos;
          return current;
        } else {
          //if ( prevtitulo == ''){
          //  return '';
          //}
          //var prevelement = document.getElementById(prevtitulo);
          //if ( checkElementIsVisible(prevelement) ){
            if (direction != FWD){
              return findNewCurrent(currentpos-1,BKG);
            } else {
              return '';
            }
            
          //} else {
          //  return '';
          //}
        }

      } else if ( checkElementIsDown(element) ) {
        console.log("ELEMENT IS NOT VISIBLE DOWN");
        //if ( prevtitulo == ''){
        //  return '';
        //}
        //var prevelement = document.getElementById(prevtitulo);
        //if ( checkElementIsVisible(prevelement) ){
          if (direction != FWD){
              return findNewCurrent(currentpos-1,BKG);
            } else {
              return '';
            }
        //} else {
        //  return '';
        //}
      } else if ( checkElementIsUp(element) ) {
        console.log("ELEMENT IS NOT VISIBLE DOWN");
        //if ( nexttitulo == ''){
        //  return '';
        //}
        //var nextelement = document.getElementById(nexttitulo);
        //if ( checkElementIsVisible(nextelement) ){
          if (direction != BKG){
              return findNewCurrent(currentpos+1,FWD);
            } else {
              return '';
            }
          
        //} else {
        //  return '';
        //}
      } else {
         return 'Error 1';
      }

    }

          function isVisible(id){
             if (id in visibilities){
                return visibilities[id];
             } else {
                visibilities[id]=false;
                return false;
             }
          }

          function setVisible(id,visible){
            visibilities[id]=visible;
          }



  

  function showTitles() {

  }

  */


function updateTitles(newcurarticle) {

  if (newcurarticle == undefined){
    navtitle.innerHTML="";
    return;
  }

  var text = "";

  var curarticle = newcurarticle;

  while ( curarticle.tagName == "ARTICLE" ){
    var firstheading = curarticle.firstElementChild;
    if ( firstheading.tagName.startsWith("H") && ( curarticle.parentElement.tagName == "ARTICLE" )){
       text = firstheading.innerHTML + " " + text;
    }
    curarticle=curarticle.parentElement;
  
  }

  navtitle.innerHTML=text;
  
}


function updateTitle(){
  var title = updateTitleTitle() + ". ";// + updateTitleChapter();
  console.log(title);
  var navtitle = document.getElementById('Navigation');
  navtitle.innerHTML=title;
}

  function updateTitleTitle(){

     var [prev,cur,next] = getTituloToCheck();

     console.log("updateTitleTitle");
     console.log(cur);
     console.log(titulos);

     if ( ( cur != '' ) && (! visibilities[cur]) ) {
        return cur;
     }

     return '<none>';
  }


  /*        function updateTitleTitle(){
             var candidate = "";
             if (visibilities[titulos[0]]){
                 console.log("First Title");
                 return candidate;
             }
             for (var i = 1; i < titulos.length; i++) {
              if (visibilities[titulos[i]]){
                console.log("Intermediate Title");
                return titulos[i-1];
              }
             }
             console.log("Last Title");
             return titulos[titulos.length-1];
          }
  */

          function updateTitleChapter(){
             var candidate = "";
             if (visibilities[capitulos[0]]){
                 console.log("First Title");
                 return candidate;
             }
             for (var i = 1; i < capitulos.length; i++) {
              if (visibilities[capitulos[i]]){
                console.log("Intermediate Title");
                return capitulos[i-1];
              }
             }
             console.log("Last Title");
             return capitulos[capitulos.length-1];
          }

