function initSearch(){
    document.getElementById('next').addEventListener('click', function(){
        if(getChkCheked()){
            Swal.fire({
                title: '¿Continuar?',
                type: 'question',
                text: "Se mostrarán las imagenes de los productos seleccionados",
                showCancelButton: true,
                //confirmButtonColor: '#3085d6',
                //cancelButtonColor: '#d33',
                confirmButtonText: 'Ir'
            }).then((result) => {
                var form = document.getElementsByTagName('form')[0];
                form.submit();
            })
        }
        else{
            Swal.fire({
                type: 'warning',
                title: 'Ningún producto seleccionado',
                confirmButtonText: 'Cerrar'
            })
        }
    });
    document.getElementById('search').addEventListener('input', function(){
        getProducts(this);
    });
}

function getChkCheked(){
    var chkb = document.querySelectorAll("input[type='checkbox']:checked");
    if(chkb.length){
        return true;
    }
    return false;
}

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
        input.name = 'chkb'
        label.appendChild(input);
        label.appendChild(span);
    });
    ul.setAttribute('data-display', 'show');
}

function clean(){
    var ul = document.getElementsByClassName('collection')[0];
    while (ul.lastChild){
        ul.removeChild(ul.lastChild);
    }
    ul.setAttribute('data-display', 'hide');
}

function initCanvas(){
    var images = document.getElementsByTagName('img');
    if(images.length){
        for(i = 0; i < images.length; i++){
            var canvas = images[i].nextElementSibling;
            if(canvas){
                canvas.height = images[i].height;
                canvas.width = images[i].width;
                var context = canvas.getContext("2d");
                context.drawImage(images[i], 0, 0, canvas.width, canvas.height);
            }
        }
        var price_input = document.querySelectorAll(".precio");
        var medida_input = document.querySelectorAll(".medida");
        if(price_input){
            price_input.forEach(element => {
                element.addEventListener('input', function(){
                    drawPrice(this);
                });
            });
        }
        if(medida_input){
            medida_input.forEach(element => {
                element.addEventListener('input', function(){
                    drawMedida(this);
                });
            });
        }
    }
}

function drawPrice(e){
    var canvas = document.querySelector("canvas[data-id='"+e.getAttribute('data-id')+"']");
    var context = canvas.getContext("2d");
    console.log(context);
    // context.fillText();
    context.font = "40pt Calibri";
    context.fillText(e.value, 400, 200);
}

function drawMedida(e){

}

function getCSRFTokenValue(){
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    return token;
}
