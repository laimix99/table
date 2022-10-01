<script setup>
import { onMounted, ref, computed } from 'vue';

import axios from 'axios';

const items = ref(null);

const ops = computed(() => {
  return [
    // { field: 'name', op: 'contains', value: 'two' },
    // { field: 'distance', op: 'gt', value: 1 },
    { field: 'name', op: 'sort', value: false },
  ];
});

onMounted(async () => {
  const { data } = await axios.post('/api/items', {
    ops: ops.value,
  });
  items.value = data;
});
</script>

<template>
  <div class="bg-red-400 hover:bg-red-100">
    <div v-if="items">
      <div v-for="(i, ii) in items.data" :key="i.id">
        <span>{{ i.name }}</span>
        <small>{{ i }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
