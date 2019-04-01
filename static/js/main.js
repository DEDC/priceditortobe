// principalCliente
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
                confirmButtonText: 'Ir',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if(result.value){
                    var form = document.getElementsByTagName('form')[0];
                    form.submit();
                }
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
    var search = document.getElementById('search'); 
    var radios = document.querySelectorAll("input[type='radio']");
    search.addEventListener('input', function(){
        getProducts(this);
    });
    radios.forEach(element => {
        element.addEventListener('click', function(){
            getProducts(search);
        });
    });
}

function getChkCheked(){
    var chkb = document.querySelectorAll(".cont-selected-items input[type='checkbox']:checked");
    if(chkb.length){
        return true;
    }
    return false;
}

function getRadioCheked(){
    var radios = document.querySelectorAll("input[type='radio']");
    for (var i = 0; i < radios.length; i++) {
        if(radios[i].checked){
            return radios[i].id;
        }
    }
}

function getProducts(e){
    var texto = e.value.trim();
    var preloader = document.getElementsByClassName('preloader-wrapper')[0];
    var info = document.getElementById('info');
    var categoria = getRadioCheked();
    if(texto){
        $.ajax({
            method: "POST",
            url: "ajax/producto",
            beforeSend : function(){
                preloader.className += ' active';
            },
            data: {csrfmiddlewaretoken: getCSRFTokenValue(), texto : texto, categoria : categoria}
        }).done(function(productos){
            preloader.classList.remove('active');
            info.textContent = '';
            if (productos.length !== 0){
                createListResults(productos);
            }
            else{
                clean();
                info.textContent = 'No hay resultados';
            }
        }).fail(function(){
            console.log('falló papá');
        });
    }
    else{
        info.textContent = '';
        preloader.classList.remove('active');
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

// mostrarProductos
function initCanvas(){
    document.getElementById('prueba').addEventListener('click', function(){
        document.getElementById('loader').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        var cont_img = document.querySelectorAll('.cont-canvas');
        var date = new Date();
        var zip = new JSZip();
        var filename = 'MMChedraui '+date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+'.zip' 
        cont_img.forEach((element, index) => {
            var imgname = element.querySelector('img').src;
            imgname = imgname.slice(imgname.lastIndexOf('/')+1,imgname.lastIndexOf('.'));
            element.firstElementChild.className = 'cont-img';
            html2canvas(element.firstElementChild).then(function(canvas){
                var dataURL = canvas.toDataURL('image/jpeg', 0.95);
                var canvas_url = dataURL.replace(/^data:image\/(jpeg);base64,/, "");
                var img = zip.folder("imagenes");
                var nombre = imgname+'-'+(index+1)+'.jpg';
                img.file(nombre,  canvas_url, {base64: true});
                if(index==cont_img.length-1){
                    zip.generateAsync({type:"blob"})
                    .then(function(content) {
                        saveAs(content, filename);
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
}

function getCSRFTokenValue(){
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    return token;
}

// principalAdmin
function principalAdmin(){
    $('#user-table').DataTable({ 
        "lengthChange": false, 
        "info": false,
        "language": {
            "paginate": {
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
            "zeroRecords": "Sin resultados",
            "search" : "BUSCAR :"
        } 
    });
    $('#category-table').DataTable({ 
        "lengthChange": false, 
        "info": false,
        "language": {
            "paginate": {
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
            "zeroRecords": "Sin resultados",
            "search" : "BUSCAR :"
        }
    });
    $('#product-table').DataTable({ 
        "lengthChange": false, 
        "info": false, 
        "language": {
            "paginate": {
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
            "zeroRecords": "Sin resultados",
            "search" : "BUSCAR :"
        }
    });
    $('.card-panel').on('click', function () {
        $($(this).attr('data-target')).show().siblings('.tabla').hide();
        $(this).children('i').addClass('active');
        $(this).parent().siblings().children().children('i').removeClass('active');
    });
    var modal = new tingle.modal({
        footer: false,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close"
    });
    $('#product-table tbody tr .show-img a').on('click', function (e) {
            e.preventDefault();
            modal.open();
            modal.setContent('<img src="/static/images/' + $(this).text() + '" class="responsive-img">');
        });
    $('#product-table').on( 'draw.dt', function () {
        $('#product-table tbody tr .show-img a').on('click', function (e) {
            e.preventDefault();
            modal.open();
            modal.setContent('<img src="/static/images/' + $(this).text() + '" class="responsive-img">');
        });
    });
}

// registroUsuario
function registroUsuario(){
    var select = document.querySelector('select');
    var select_m = document.querySelector('#cont-select');
    select_m.style.display = 'none';
    var instances = M.FormSelect.init(select);
    document.querySelector("input[type='checkbox']").addEventListener('click', function () {
        if (this.checked) {
            select_m.style.display = 'block';
        }
        else {
            select_m.style.display = 'none';
            select.selectedIndex = 0;
        }
    });
}

// registroProducto
function registroProducto(){
    var elems = document.querySelector('select');
    var instances = M.FormSelect.init(elems);
    var img = document.getElementsByTagName('img')[0];
    var color_input = document.getElementById('id_color');
    color_input.value = '';
    var file = document.getElementById('id_imagen');
    var fileReader = new FileReader();
    file.addEventListener('change', function (e) {
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.addEventListener('load', function () {
            img.src = fileReader.result;
            img.addEventListener('load', function () {
                $(img).off('click');
                $(img).broiler(function (color) {
                    var hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
                    color_input.value = hex;
                    color_input.focus();
                });
            });
        });
    });
}

// editarProducto
function editarProducto(){
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    var img = document.getElementsByTagName('img')[0];
    var color_input = document.getElementById('id_color');
    var file = document.getElementById('id_imagen');
    file.removeAttribute('required');
    var fileReader = new FileReader();
    $(img).off('click');
    $(img).broiler(function (color) {
        var hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
        color_input.value = hex;
        color_input.focus();
    });
    file.addEventListener('change', function (e) {
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.addEventListener('load', function () {
            img.src = fileReader.result;
            img.addEventListener('load', function () {
                $(img).off('click');
                $(img).broiler(function (color) {
                    var hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
                    color_input.value = hex;
                    color_input.focus();
                });
            });
        });
    });
}

// editarUsuario
function editarUsuario(){
    var pass = document.getElementsByName('password')[0];
    var select = document.querySelector('select');
    var instances = M.FormSelect.init(select);
    pass.removeAttribute('required')
    pass.disabled = true;
    document.getElementById('active-pass').addEventListener('click', function () {
        pass.disabled = false;
        pass.focus();
    });
}
