(function(globalObject) {

    function makeBelieveElement(obj, length) {    
        this.obj = obj;
        this.length = length;
    }

    function query(cssSelector) {
        var item = document.querySelectorAll(cssSelector)
        var length = item.length
        return new makeBelieveElement(item, length);
    }

    //Ex. 4
    makeBelieveElement.prototype.parent = function(cssSelector = ''){
        parentElements = [];
        for (i = 0; i < this.length; i++){
            var elem = this.obj[i].parentNode;
            if(elem)
                if(cssSelector === ''){
                    parentElements.push(elem);
                }
                else{
                    if(elem.matches(cssSelector)){
                        parentElements.push(elem);
                    }
                }
        }
        return new makeBelieveElement(parentElements, parentElements.length);
    }

    //Ex. 5
    makeBelieveElement.prototype.grandParent = function(cssSelector = ''){
        grandParentElem = this.parent().parent(cssSelector);
        return new makeBelieveElement(grandParentElem, grandParentElem.length);
    }

    //Ex. 6
    makeBelieveElement.prototype.ancestor = function(cssSelector = ''){
        ancestorElements = [];
        var grandPar = this.grandParent();
        for(var i = 0; i < grandPar.length; i++){
            ancestorElem = grandPar.obj.obj[i];
            if(ancestorElem){
                var elemFound = ancestorElem.closest(cssSelector);
                if(elemFound){
                    ancestorElements.push(elemFound);
                }
                
            }
        }
        return new makeBelieveElement(ancestorElements, ancestorElements.length);
    }

    //Ex. 7
    makeBelieveElement.prototype.onClick = function(func){
        for (i = 0; i < this.length; i++){
            this.obj[i].addEventListener("click", function(){
                func(event);
            });
        }
        return this;
    }

    //Ex. 8
    makeBelieveElement.prototype.insertText = function(text) {
        for (i = 0; i < this.length; i++){
            this.obj[i].innerText = text;
        }
        return this;
    }

    //Ex. 9
    makeBelieveElement.prototype.append = function(input){
        if (typeof input !== "string"){
            for (i = 0; i < this.obj.length; i++){
                this.obj[i].insertAdjacentElement('beforeend', input.parentNode);
            }                
        }
        else{
            for (i = 0; i < this.length; i++){
                this.obj[i].innerHTML += input;
            } 
        }
        return this;        
    }

    //Ex. 10
    makeBelieveElement.prototype.prepend = function(input){
        if (typeof input !== "string"){
            for (var i = 0; i < this.length; i++){
                this.obj[i].insertAdjacentElement('afterbegin', input.parentNode);
            }                
        }
        else{
            for (var i = 0; i < this.length; i++){
                this.obj[i].innerHTML = input + this.obj[i].innerHTML;
            } 
        }
        return this;        
    }

    //Ex. 11
    makeBelieveElement.prototype.delete = function(){
        for (var i = 0; i < this.length; i++){
            while(this.obj[i].firstChild){
                this.obj[i].removeChild(this.obj[i].firstChild);
            }
        }
    }

    //Ex. 13
    makeBelieveElement.prototype.css = function(property, value){
        for (var i = 0; i < this.length; i++){
            this.obj[i].style[property] = value;
        }
        return this;
    }

    //Ex. 14
    makeBelieveElement.prototype.toggleClass = function(classString){
        for (var i = 0; i < this.length; i++){
            this.obj[i].classList.toggle(classString);
        }
        return this;
    }

    //Ex. 15
    makeBelieveElement.prototype.onSubmit = function(func){
        for(var i = 0; i < this.length; i++){
            this.obj[i].addEventListener("submit", function(){
                func(event);
            });
        }
        return this;
    }

    //Ex. 16
    makeBelieveElement.prototype.onInput = function(func){
        for (var i = 0; i < this.length; i++){
            this.obj[i].addEventListener("input", function(){
                func(event);
            });
        }
        return this;
    }

    globalObject.__ = query;

    //Ex. 12
    globalObject.__.ajax = function(xmlObject={url:'',method: 'GET',timeout: 0,data: {},header: {},success: null,failed: null, beforeSend: null}) {
        var request = new XMLHttpRequest();
        
        if(xmlObject.url === ""){
            console.log("URL is required");
            return;
        }
       
        request.open(xmlObject.method, xmlObject.url);
        request.timeout = xmlObject.timeout * 1000;

        for(let key in xmlObject.headers) {
            request.setRequestHeader(key, xmlObject.headers[key]);
        }
       
        request.onerror = xmlObject.fail;
        request.ontimeout = xmlObject.fail;
        request.onload = xmlObject.success;

        if(xmlObject.beforeSend !== null){
            xmlObject.beforeSend(request);
        }

        request.send(xmlObject.data);
    }

})(window);

