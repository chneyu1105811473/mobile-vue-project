<template>
    <div>
        <div class="appealContainer">
            <div class="iconContainer">
                <div class="checkdeIcon">
                    <img
                    :src="checkedIcon"
                    alt="appeal get picture" />
                </div>
            </div>
            <p class="checkedContent">
               We have received your appeal request.
               The results will be sent to your email address within two business days.
            </p>
        </div>
        <div class="btn">
          <settings-btn :options="btnOptions" @click="DoneFn"/>
        </div>
    </div>
</template>

<script>
import dagou from '@/assets/img/gou@2x.png'
import SettingsBtn from '@/components/SettingsBtn'

export default {
  name: 'Appeal',
  components: {SettingsBtn},
  data () {
    return {
      checkedIcon: dagou,
      btnOptions: {
        name: 'Done',
        isActive: true
      }
    }
  },
  methods: {
    DoneFn () {
      // 申诉成功 此处定义一个appealed方法和ios交互
      localStorage.removeItem('Authorization')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.appealContainer{
    padding: 0.4rem;
    box-sizing: border-box;
}
.checkdeIcon{
    text-align: center;
}
.checkedContent{
    font-family: SFUIDisplay-Regular;
    margin-top: 1rem;
    color: rgb(153,153,153);
    font-size:0.32rem;
    letter-spacing: 0;
    line-height: 0.4rem;
}
.iconContainer{
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
}
.checkdeIcon{
    width: 1.8rem;
    height: 1.8rem;
}
.btn{
  margin-top: 3.5rem;
}
</style>
