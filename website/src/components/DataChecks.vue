<template>
  <ul>
    <template v-for="(check, index) in checks">
      <li :key="index">
        <template v-if="check.type == 'check'">
          <span v-if="check.result.status === true">✅</span>
          <span v-if="check.result.status !== true">❌</span>
        </template>
        {{ check.title }}
        <template v-if="check.type == 'item'">
          <DataChecks :checks="check.children" />
        </template>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'DataChecks',
  props: {
    checks: Array
  }
}
</script>
