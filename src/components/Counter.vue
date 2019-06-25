<template>
  <span class="counter">
		<span v-for="char in value.split('')" :class="[/\d/.test(char) ? 'digit' : 'sep' ]">{{char}}</span>
	</span>
</template>

<style lang="scss" scoped>
.digit, .sep {
  display: inline-block;
  text-align: center;
}
.digit {
  width: 0.85em;
}
.sep {
  width: 0.4em;
}
</style>

<script>
export default {
  props: {
    value: String
  },
};
</script>
