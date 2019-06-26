<template>
  <span class="counter">
		<span v-for="segment in value.split(/(\d)/)" :class="{ digit: /\d/.test(segment) }">{{segment}}</span>
	</span>
</template>

<script>
export default {
  props: {
    value: String
  },
};
</script>
