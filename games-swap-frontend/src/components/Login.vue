<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';


const emit = defineEmits<{
  (e: 'confirm'): void,
  (e: 'cancel'): void
}>()
</script>

<template>
  <VueFinalModal
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
  <form @submit="(e) => e.preventDefault()">
        <h1>INICIO SESIÓN</h1>
        <input type="email" name="email" id="email" placeholder="Correo">
        <input type="password" name="password" id="password" placeholder="Contraseña">
        <button @click="emit('confirm')">ENTRAR</button>
        <button class="register-btn" @click="emit('cancel')">¿No tienes cuenta? Regístrate</button>
    </form>
  </VueFinalModal>
</template>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirm-modal-content {
    display: flex;
    flex-direction: column;
    border-radius: 27px;
    border: 1px solid var(--Color-3, #000);
    background: var(--Color, #F6F6F6);
    padding: 2rem;
    width: 507px;
    height: 438px;
   
}
.dark .confirm-modal-content {
  background: #000;
}

h1{
    color: #9F87F5;
    text-align: center;
    font-family: Roboto;
    font-size: 30px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
form {
    display: flex;
    flex-direction: column;
}
form input {
    border-radius: 29px;
    border: 3px solid #9F87F5;
    background: #F6F6F6;
    padding: 1rem;
    margin-bottom: 50px;
}

form input #placeholder{
    color:#D3D3D3;
}

button {
    background-color: #9F87F5;
    color: white;
    width: 70%;
    margin: 0 auto;
}
button.register-btn {
    margin-top: 1rem;
    background-color: transparent;
    color: #a2a2a2;
    text-decoration: underline;
    border: none;
}
button.register-btn:hover {
    color: #000;
}

</style>