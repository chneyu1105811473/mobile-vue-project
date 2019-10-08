<template>
  <div class="stepperPop">
    <stepper v-model="value" :min="1" :max="10" :integer="true" @change="onChange"/>
  </div>
</template>

<script>
import {Stepper} from 'vant'
export default {
  name: 'StepperPop',
  components: {Stepper},
  props: {
    duration: {
      default: 5,
      type: Number
    }
  },
  computed: {
    value: {
      get () {
        return this.duration
      },
      set (val) {}
    }
  },

  methods: {
    onChange (val) {
      console.log('change', val)
      this.$emit('sendDuration', val)
    }
  }
}
</script>

<style scoped>
.stepperPop{
  display: flex;
  justify-content: center;
}
</style>
