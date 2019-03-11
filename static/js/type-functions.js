// functions type-1
function type_1(){
    var type1 = document.querySelectorAll(".type-1");
    if(type1){
        type1.forEach(element => {
            element.querySelector('.precio').addEventListener('input', function(){
                drawTextType1(this);
            });
            element.querySelector('.medida').addEventListener('input', function(){
                drawTextType1(this);
            });
        });
    }
}

// functions type-2
function type_2(){
    var type2 = document.querySelectorAll(".type-2");
    if(type2){
        type2.forEach(element => {
            var cont_text = element.querySelector('.cont-text');
            var input_medida = element.querySelector('.cont-text > .text-medida');
            var medida_clone = input_medida.cloneNode(true);
            var cont_column = document.createElement('div');
            var signo_input = document.createElement('span');
            var centavos_input = document.createElement('span');
            input_medida.remove();
            cont_column.className = 'cont-column';
            signo_input.className = 'text-signo';
            centavos_input.className = 'text-centavos';
            signo_input.setAttribute('data-id', cont_text.getAttribute('data-id'));
            centavos_input.setAttribute('data-id', cont_text.getAttribute('data-id'));
            cont_text.prepend(signo_input);
            cont_text.append(cont_column);
            cont_column.append(centavos_input);
            cont_column.append(medida_clone);
            element.querySelector('.precio').addEventListener('input', function(){
                drawTextType2(this);
            });
            element.querySelector('.medida').addEventListener('input', function(){
                drawTextType2(this);
            });
        });
    }
}

// functions type-3
function type_3(){
    var type2 = document.querySelectorAll(".type-3");
    if(type2){
        type2.forEach(element => {
            var cont_text = element.querySelector('.cont-text');
            var input_medida = element.querySelector('.cont-text > .text-medida');
            var medida_clone = input_medida.cloneNode(true);
            var cont_column = document.createElement('div');
            var signo_input = document.createElement('span');
            var centavos_input = document.createElement('span');
            input_medida.remove();
            cont_column.className = 'cont-column';
            signo_input.className = 'text-signo';
            centavos_input.className = 'text-centavos';
            signo_input.setAttribute('data-id', cont_text.getAttribute('data-id'));
            centavos_input.setAttribute('data-id', cont_text.getAttribute('data-id'));
            cont_text.prepend(signo_input);
            cont_text.append(cont_column);
            cont_column.append(centavos_input);
            cont_column.append(medida_clone);
            element.querySelector('.precio').addEventListener('input', function(){
                drawTextType2(this);
            });
            element.querySelector('.medida').addEventListener('input', function(){
                drawTextType2(this);
            });
        });
    }
}

function drawTextType1(e){
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

function drawTextType2(e){
    var id = e.getAttribute('data-id');
    switch (e.getAttribute('class')){
        case 'precio':
            var text_precio = document.querySelector(".text-precio[data-id='"+id+"']");
            var text_signo = document.querySelector(".text-signo[data-id='"+id+"']");
            var text_centavos = document.querySelector(".text-centavos[data-id='"+id+"']");
            if (e.value){ 
                text_signo.textContent = '$';
                text_precio.textContent = e.value;
                var punto = e.value.indexOf('.');
                if(punto >= 0){
                    text_precio.textContent = e.value.slice(0, punto)+'.';
                    text_centavos.textContent = e.value.slice(punto+1);
                }
                else{
                    text_centavos.textContent = "";
                }
            }
            else{
                text_signo.textContent = '';
                text_precio.textContent = '';
            }
            return;
        case 'medida':
            var text_medida = document.querySelector(".text-medida[data-id='"+id+"']");
            text_medida.textContent = e.value;
            return;
    }
}

function drawTextType3(e){
    var id = e.getAttribute('data-id');
    switch (e.getAttribute('class')){
        case 'precio':
            var text_precio = document.querySelector(".text-precio[data-id='"+id+"']");
            var text_signo = document.querySelector(".text-signo[data-id='"+id+"']");
            var text_centavos = document.querySelector(".text-centavos[data-id='"+id+"']");
            if (e.value){ 
                text_signo.textContent = '$';
                text_precio.textContent = e.value;
                var punto = e.value.indexOf('.');
                if(punto >= 0){
                    text_precio.textContent = e.value.slice(0, punto)+'.';
                    text_centavos.textContent = e.value.slice(punto+1);
                }
                else{
                    text_centavos.textContent = "";
                }
            }
            else{
                text_signo.textContent = '';
                text_precio.textContent = '';
            }
            return;
        case 'medida':
            var text_medida = document.querySelector(".text-medida[data-id='"+id+"']");
            text_medida.textContent = e.value;
            return;
    }
}