const form = document.getElementById("cadastro");
const campos = {
    firstname: document.getElementById("firstname"),
    lastname: document.getElementById("lastname"),
    email: document.getElementById("email"),
    number: document.getElementById("number"),
    password: document.getElementById("password"),
    confirmpassword: document.getElementById("confirmpassword"),
};
const sucesso = document.getElementById("sucesso");

// Máscara de celular: (81) 98552-1475
campos.number.addEventListener("input", () => {
    const d = campos.number.value.replace(/\D/g, "").slice(0, 11);
    let v = d;
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    else if (d.length > 6) v = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    campos.number.value = v;
});

const regras = {
    firstname: (v) => (v.trim().length >= 2 ? "" : "Digite seu primeiro nome."),
    lastname: (v) => (v.trim().length >= 2 ? "" : "Digite seu sobrenome."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Digite um e-mail válido."),
    number: (v) => {
        const n = v.replace(/\D/g, "").length;
        return n === 10 || n === 11 ? "" : "Digite o celular com DDD.";
    },
    password: (v) => {
        if (v.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
        if (!/\d/.test(v) || !/[a-zA-Z]/.test(v)) return "Use letras e números na senha.";
        return "";
    },
    confirmpassword: (v) => (v && v === campos.password.value ? "" : "As senhas não são iguais."),
};

function validar(nome) {
    const campo = campos[nome];
    const msg = regras[nome](campo.value);
    document.getElementById(`erro-${nome}`).textContent = msg;
    campo.classList.toggle("invalido", Boolean(msg));
    campo.setAttribute("aria-invalid", String(Boolean(msg)));
    return !msg;
}

// Valida ao sair do campo e corrige enquanto digita
Object.keys(campos).forEach((nome) => {
    campos[nome].addEventListener("blur", () => {
        if (campos[nome].value) validar(nome);
    });
    campos[nome].addEventListener("input", () => {
        if (campos[nome].classList.contains("invalido")) validar(nome);
        sucesso.hidden = true;
    });
});

// Se mudar a senha, revalida a confirmação
campos.password.addEventListener("input", () => {
    if (campos.confirmpassword.value) validar("confirmpassword");
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const resultados = Object.keys(campos).map(validar);
    const primeiroInvalido = Object.keys(campos).find((_, i) => !resultados[i]);

    if (primeiroInvalido) {
        campos[primeiroInvalido].focus();
        return;
    }

    sucesso.hidden = false;
    form.reset();
});
