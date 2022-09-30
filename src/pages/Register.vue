<template>
  <div class="login">
    <div class="main">
      <div class="header">Register</div>
      <div>
        <label for="name">name</label>
        <input id="name" type="text" v-model="name">
      </div>
      <div class="content">
        <label for="email">E-mail</label>
        <input id="email" type="text" v-model="email">
      </div>
      <div>
        <label for="password">password</label>
        <input id="password" type="password" v-model="password" @keyup.enter="makeRegister">
      </div>
      <div class="buttons">
        <button @click="makeRegister">submit</button>
      </div>

      <div class="error" v-if="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/services/auth.service'

export default {
  name: 'Login',
  data () {
    return {
      name: 'user',
      email: 'user@user.com',
      password: '123456',
      error: ''
    }
  },

  methods: {
    async makeRegister () {
      try {
        await AuthService.makeRegister({ nama: this.name, mail: this.email, pass: this.password })
        this.error = ''
        await this.$router.push('login')
      } catch (error) {
        this.$store.commit('toast/NEW', { type: 'error', message: error.message })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;

  .main {
    padding: 30px 15px;
    background: #fff;
    width: 400px;
    border-radius: 2px;
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, .2),
    0 24px 38px 3px rgba(0, 0, 0, .14),
    0 9px 46px 8px rgba(0, 0, 0, .12);

    .header {
      text-align: center;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
    }

    .error {
      background-color: red;
      padding: 10px;
      font-size: 12px;
      opacity: 1;
      transition: all 0.5s;
    }
  }
}
</style>
