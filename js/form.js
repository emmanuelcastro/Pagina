let registerForm = document.getElementById('register-form');
let inputs = document.querySelectorAll('#register-form input')

const tests = {
    'user-name': /^[a-zA-Z0-9_-]{6,14}$/,
    'user-pass': /^[a-zA-Z0-9]{8,12}/,
    'user-email': /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+$/
}
let camposValidados = {
    'user-name': false,
    'user-pass': false,
    'user-email': false,
    'terminos': false,
}
const validarIngresos = function (event) {
    let name = event.target.name;
    let input = event.target;
    if( name != 'terminos'){
        validarCampo(input);
    }
    else{
        validarTerminos();
    }
}
let datosUsuario = {
    'user-name': null,
    'user-pass': null,
    'user-email': null,
    'intereses': [],
    'loggedIn': false
}
const validarCampo = function (input) {
    let name = input.name;
    let valorActual = input.value;
    if (tests[name].test(valorActual)) {
        //pasa la comprobacion
        input.classList.add('glow-passed');
        input.classList.remove('glow-error');
        borrarMsjError(name);
        datosUsuario[name] = valorActual;
        camposValidados[name] = true;
    }
    else {
        input.classList.add('glow-error');
        input.classList.remove('glow-passed');
        mostrarMsjError(name);
        camposValidados[name] = false;
    }

}
const validarTerminos = function () {
    let terminos = document.getElementById('terminos');
    if (terminos.checked) {
        terminos.classList.remove('glow-error');
        terminos.classList.add('glow-passed');
        borrarMsjError(terminos.name)
        camposValidados['terminos'] = true;
    }
    else {
        terminos.classList.remove('glow-passed');
        terminos.classList.add('glow-error');
        mostrarMsjError(terminos.name)
        camposValidados['terminos'] = false;
    }
}
const mostrarMsjError = function (inputName) {
    let p = document.getElementById(`${inputName}-error`);
    switch (inputName) {
        case 'user-name':
            p.innerText = 'Nombre de usuario no válido';
            p.classList.remove('noVisible');
            break
        case 'user-pass':
            p.innerText = 'La contraseña debe tener una longitud minima de 8 caracteres y solo puede contener letras y números.';
            p.classList.remove('noVisible');
            break
        case 'user-email':
            p.innerText = 'Ingrese una dirección de correo válida.';
            p.classList.remove('noVisible');
            break
        case 'terminos':
            p.innerText = 'Debe aceptar los terminos y condiciones';
            p.classList.remove('noVisible');
            break

    }
}
const borrarMsjError = function (inputName) {
    let p = document.getElementById(`${inputName}-error`);
    p.innerText = '';
    p.classList.add('noVisible');
}
//Añado los event listeners a los inputs del formulario
inputs.forEach(input => {
    //Todos los type='text' van a usar los eventos 'input' y 'blur'
    //El unico type='checkbox' con evento 'change' es el de id terminos
    if (input.type !== 'checkbox') {
        input.addEventListener('input', validarIngresos)
        input.addEventListener('blur', validarIngresos)
    }
    else {
        if (input.id === 'terminos') {
            input.addEventListener('change', validarIngresos)
        }

    }
}
)
const comprobarDatosUsuario = function () {
    //devuelve false si algun campo no tiene valor
    for (clave in datosUsuario) {
        if (datosUsuario[clave] === null) {
            return false
        }
    }
    return true
}
const guardarDatosUsuario = function () {
    for (prop in datosUsuario) {
        if (datosUsuario[prop] === null) {
            //si hay un null, ese campo esta vacío
            return false
        }
    }
    sessionStorage.setItem(datosUsuario['user-name'], JSON.stringify(datosUsuario))
    return true
    //si no encuentro ningún campo vacío, guardo el objeto datosUsuario en sessionStorage

}
const comprobarIntereses = function () {
    let checkboxes = document.querySelectorAll('#intereses input[type="checkbox"]');
    let marcados = 0;
    for (checkbox of checkboxes) {
        if (checkbox.checked) {
            marcados += 1;
            datosUsuario['intereses'].push(checkbox.value)
        }
    }
    if (marcados === 0) {
        document.getElementById('intereses-error').classList.remove('noVisible');
        return false
    }
    else {
        document.getElementById('intereses-error').classList.add('noVisible');
        return true
    }
}
const validarFormulario = function (event) {
    //Ver que todos los campos esten validados, revisando el objeto camposValidados
    if ( comprobarDatosUsuario() && comprobarCamposValidados() && comprobarIntereses() ) {
        if (sessionStorage.getItem(datosUsuario['user-name']) === null) {
            event.preventDefault();
            guardarDatosUsuario();
            document.getElementById('mensaje-redireccion').style.display = "flex";
            let body= document.getElementsByTagName('body')[0];
            let main = document.getElementById('main');
            body.removeChild(main)
            setTimeout(()=>{
                window.location.assign( '../index.html');
            },3000)
        } else {
            event.preventDefault();
        }
    } else {
        event.preventDefault();
    }

}
const comprobarCamposValidados = function(){
    for( clave in camposValidados){
        if( camposValidados[clave] === false){
            return false
        }
    }
    return true
}
registerForm.addEventListener('submit', validarFormulario )