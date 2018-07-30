<template>
  <div class="container-lg p-4">
    <div class="Subhead">
      <div class="Subhead-heading">Admin mode</div>
    </div>
    <div class="markdown-body">
      <p>When you activate <strong>admin mode</strong> you will see extra tools on the web app to make it easier.</p>
      <p>Admin mode status: <strong>{{ activated ? 'ON' : 'OFF' }}</strong></p>
      <p>
        <button
          class="btn btn-primary"
          @click="toggleAdminMode"
        >Toggle</button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    activated() {
      return this.$store.state.admin
    }
  },
  methods: {
    toggleAdminMode() {
      this.$store.dispatch('toggleAdminMode')
    }
  }
}
</script>

<style>
</style>
