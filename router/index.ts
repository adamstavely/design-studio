import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/color-comparison',
    name: 'ColorComparison',
    component: () => import('../components/ColorComparison.vue'),
  },
  {
    path: '/gradients',
    name: 'Gradients',
    component: () => import('../views/Gradients.vue'),
  },
  // other existing routes...
{
  path: '/color-comparison',
  name: 'ColorComparison',
  component: () => import('../views/ColorComparisonView.vue')
},];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;