({
	handleSearch : function(component,event){
		var searchTerm = component.get("v.searchTerm");
        let tempList = component.get("v.originalData");
        if(searchTerm){
            tempList = tempList.filter(obj => Object.values(obj).some(val => val.toLowerCase().includes(searchTerm.toLowerCase())));
            component.set("v.rows",tempList);
        }
        else{
            component.set("v.rows",component.get("v.originalData"));
        }
	},
    
    sortData : function(component,fieldName,sortDirection){
        var data = component.get("v.rows");
        //function to return the value stored in the field
        var key = function(a){
            return a[fieldName]; 
        }
        var reverse = sortDirection == 'asc' ? 1: -1;
        
        data.sort(function(a,b){
            //To handle null values and uppercase records during sorting
            var a = key(a) ? key(a).toLowerCase() : '';
            var b = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((a > b) - (b > a));
        });   
        component.set("v.rows",data);
    }
})