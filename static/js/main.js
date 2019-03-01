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
    var chkb = document.querySelectorAll(".cont-selected-items input[type='checkbox']:checked");
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
        input.addEventListener('click',function(){createListSelectedResults(this)});
        label.appendChild(input);
        label.appendChild(span);
    });
    ul.setAttribute('data-display', 'show');
}

function createListSelectedResults(e){
    if(e.checked){
        var ul2 = document.getElementsByClassName('collection')[1];
        ul2.setAttribute('data-display', 'show');
        var clone = e.closest('li').cloneNode(true)
        ul2.append(clone);
    }
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
        document.getElementById('loader').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        var cont_img = document.querySelectorAll('.cont-canvas');
        var zip = new JSZip();
        cont_img.forEach((element, index) => {
            element.firstElementChild.className = 'cont-img';
            html2canvas(element.firstElementChild).then(function(canvas){
                var dataURL = canvas.toDataURL('image/jpeg', 0.95);
                var canvas_url = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
                var img = zip.folder("imagenes");
                var nombre = 'plantilla'+index+'.jpg';
                console.log(nombre);
                img.file(nombre,  canvas_url, {base64: true});
                if(index==cont_img.length-1){
                    zip.generateAsync({type:"blob"})
                    .then(function(content) {
                        saveAs(content, "example.zip");
                    });
                }
            });
        });
        window.setTimeout(function(){
            $('.cont-img').removeClass('cont-img').addClass('preview-cont-img');
            document.getElementById('loader').style.display = 'none';
            document.body.style.overflowY = 'scroll';
        },5000);     
    });
    var price_input = document.querySelectorAll(".precio");
    var medida_input = document.querySelectorAll(".medida");
    if(price_input){
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
            if (e.value){
                text_precio.textContent = '$' + e.value;
            }
            else{
                text_precio.textContent = '';
            }
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
