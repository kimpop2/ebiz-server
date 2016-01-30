/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
angular.module('mobp.filters', [])

.filter('rawHtml', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.filter('parseDate', function() {
  return function(value) {
      return Date.parse(value);
  };
})

.filter('ttime', function() {
    return function(val) {
    	try{
          if(val === null) return '';

	        var hh = val.substring(0, 2);
	        var mm = val.substring(2, 3);
	        
	        return hh + ':' + mm + '0';	
	    }
	    catch(e){
	    	return val;
	    }

    };
})

.filter('tmonth', function() {
    return function(month, cut) {
        try{
            var yyyy = month.substring(0,4);
            var mm;
            
            //yyyy-mm
            if(cut === '-'){ 
              mm = month.substring(5,7);
            }
            else{
              mm = month.substring(4,6); 
            }
            
            mm = mm.substring(0, 1) === '0' ? mm.substring(1,2) : mm;
            
            return yyyy + '년 ' + mm + '월' ; 
        }
        catch(e){
            return month;
        }

    };
})

.filter('tyear', function() {
    return function(year, postfix) {
        try{
            if(postfix !== null)
            return year + postfix ; 
        }
        catch(e){
            return year;
        }
    };
})
;
