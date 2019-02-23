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
    document.getElementById('prueba').addEventListener('click', function(){
        var cont = 1;
        document.getElementById('loader').style.display = 'flex';
        var cont_img = document.getElementsByClassName('cont-canvas');
        var zip = new JSZip();
        for(i=0; i<cont_img.length; i++){
            cont_img[i].firstElementChild.className = 'cont-img';
            html2canvas(cont_img[i].firstElementChild,{
                onrendered: function(canvas){ 
                    function getBase64Image(img) {
                        var canvas = document.createElement("canvas"); 
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        var dataURL = canvas.toDataURL("image/jpg");
                        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                    }
                    var img = zip.folder("imagenes");
                    var nombre = 'plantilla'+cont+'.jpg';
                    img.file(nombre,  getBase64Image(canvas), {base64: true});
                    if(cont==cont_img.length){
                        zip.generateAsync({type:"blob"})
                        .then(function(content) {
                            saveAs(content, "example.zip");
                        });
                    }   
                    cont++;
                }
            });
        }
        window.setTimeout(function(){
            $('.cont-img').removeClass('cont-img');
            document.getElementById('loader').style.display = 'none';
        },5000);     
        
    });
    var price_input = document.querySelectorAll(".precio");
    var medida_input = document.querySelectorAll(".medida");
    if(price_input){
        //let
        price_input.forEach(element => {
            element.addEventListener('input', function(){
                drawText(this);
            });
        });
    }
    if(medida_input){
        medida_input.forEach(element => {
            element.addEventListener('input', function(){
                drawText(this);
            });
        });
    }
}

function drawText(e){
    var id = e.getAttribute('data-id');
    switch (e.getAttribute('class')){
        case 'precio':
            var text_precio = document.querySelector(".text-precio[data-id='"+id+"']");
            text_precio.textContent = e.value; 
            return;
        case 'medida':
            var text_medida = document.querySelector(".text-medida[data-id='"+id+"']");
            text_medida.textContent = e.value;
            return;
    }
}

function getCSRFTokenValue(){
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    return token;
}
