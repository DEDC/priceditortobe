document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('next').addEventListener('click', getChkCheked);
    document.getElementById('search').addEventListener('keyup', function(){
        getProducts(this);
    });
});

function getProducts(e){
    var texto = e.value.trim();
    if(texto){
        $.ajax({
            method: "POST",
            url: "ajax/producto",
            data: {csrfmiddlewaretoken: getCSRFTokenValue(), texto : texto}
        }).done(function(productos){
            if (productos.length !== 0){
                createListResults(productos);
            }
        }).fail(function(){
            console.log('falló papá');
        });
    }
    else{
        clean();
    }
}

function createListResults(productos){
    clean();
    var ul = document.getElementsByClassName('collection')[0];
    productos.forEach(e => {
        var li = document.createElement('li');
        var div = document.createElement('div');
        var label = document.createElement('label')
        var input = document.createElement('input');
        var span = document.createElement('span');
        li.className = 'collection-item';
        ul.appendChild(li);
        div.textContent = e.fields.nombre;
        li.appendChild(div);
        label.className = 'secondary-content';
        div.appendChild(label);
        input.type = 'checkbox';
        input.value = e.pk;
        label.appendChild(input);
        label.appendChild(span);
    });
    ul.setAttribute('data-display', 'show');
}

function getChkCheked(){
    var chkb_arr = [];
    var chkb = document.querySelectorAll("input[type='checkbox']:checked");
    if(chkb.length){
        chkb.forEach(element => {
            chkb_arr.push(element.value);
        });    
        console.log(chkb_arr);
    }
}

function clean(){
    var ul = document.getElementsByClassName('collection')[0];
    while (ul.lastChild){
        ul.removeChild(ul.lastChild);
    }
    ul.setAttribute('data-display', 'hide');
}

function getCSRFTokenValue(){
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    return token;
}
