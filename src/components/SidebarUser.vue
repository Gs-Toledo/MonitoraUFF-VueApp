<template>
  <v-navigation-drawer v-model="value" app class=" !bg-[#1A375B]" permanent clipped>
    <v-list>
      <v-list-item
        v-for="(item, index) in navigationItems"
        :key="index"
        @click="navigateTo(item.route)"
        
        
      >
        <v-icon :icon="item.icon"></v-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

interface NavigationItem {
  title: string;
  icon: string;
  route: string;
}

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const router = useRouter();

const value = computed<boolean>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const navigationItems = ref<NavigationItem[]>([
  { title: 'Home', icon: 'mdi-home', route: '/home' },
  { title: 'Câmeras', icon: 'mdi-monitor', route: '/cameras' },
  { title: 'Filtro de Gravações', icon: 'mdi-film', route: '/filtro-gravacoes' }
]);

const navigateTo = (route: string) => {
  router.push(route);
  emit('update:modelValue', false);
};
</script>
