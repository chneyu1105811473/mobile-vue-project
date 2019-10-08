<template>
  <div class="privacy">
    <header class="header">
        <div class="goBack iconfont" @click="goBack">&#xe65b;</div>
        <p class="policy-title" v-cloak>{{privacyTitle}}</p>
    </header>
    <div class="policiesContainer">
        <p class="contentTitle" v-cloak>{{contentTitle}}</p>
        <div class="policiesCapture">
            {{capture}}
        </div>
        <template v-for="(item,index) in content" >
            <section :key="index">
                <p class="title" v-html="item.title"></p>
                <div class="text" v-html="item.text"></div>
                <dl v-if="item.children">
                  <template v-for="(child,index) in item.children">
                    <dt :key="index+'title'">
                      <span class="tips" v-html="child.title"></span>
                    </dt>
                    <dd :key="index+'text'" v-html="child.text"></dd>
                  </template>
                </dl>
            </section>
        </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XploPrivacy',
  data () {
    return {
      privacyTitle: 'Terms and policies',
      contentTitle: 'Xplo Inc. Terms of Service',
      capture: 'Our goal at XPLO is to bring people from all around the world closer and to share each-others travels and experiences, and to make exploring more enjoyable for everyone. Here we have the list of Terms. Please read carefully.',
      content: [
        {
          title: '1.Who Can Use XPLO?',
          text: 'We want our community to be a fun and safe place for everyone. For that reason we require you to commit to a few restrictions before you can get started in the XPLO world. <br/>. You must be at least 13 years of age <br/>. You must not be a convicted sex offender <br/>. You must not have previously had an account disabled by violating our terms or policy.<br/>. You will abide by these terms and all relevant local, state, national, and international laws and regulations'
        }, {
          title: '2.You Are You:',
          text: 'We realize that everyone in the world is different and no two people are the same. Everything you see on XPLO will be unique to you. From the places you have travelled, people you follow, people who follow you and your interests it’s all unique to you.We will use the data will have from you - for example people you follow or places you have visited to make your experience personal to you, and make your time more enjoyable.'
        }, {
          title: '3.Bring You Closer To The World.',
          text: 'Whether it’s the holiday you have always dreamed of, or the latest fashion trends we at XPLO want to bring you there. We use the data we have collected from you to help make your next move one that is enjoyable and worth it. For example if you have listed ‘sports and ‘food’ as interests, when you are exploring the XPLO world you will be shown more locations to do with ‘food’ or ‘sports’. If you have recently eaten at a particular restaurant, we will recommend similar restaurants that are local for you. We understand you will only be interested in things you care about.'
        }, {
          title: '4.Express Yourself',
          text: 'We have all been and seen places locations whether around the world or in our local town and city. We want to hear from you, we want you to share your experiences. Sharing is caring, upload your photos and videos for the XPLO world to see. Comment and interact with other people’s posts. Go on an adventure through the XPLO world and share and interact with everyone around you. '
        }, {
          title: '5.Safety First',
          text: 'We want our XPLO world to be safe for everyone to use. We have a team working around the clock to insure that the XPLO community feels safe, we will not tolerate any offensive or harmful conduct towards the other users of XPLO. If we receive any complaints about any content that is uploaded we will take the appropriate action - for example, removing content, blocking access to certain accounts, disabling accounts or contacting law enforcement. '
        }, {
          title: '6.Community Guidelines',
          text: 'At XPLO, we encourage people to express themselves, live for the moment, explore and learn about the world and have fun with each other. We have created these Community Guidelines to encourage users self-expression while at the same time making our community safe for everyone at all times.',
          children: [{
            title: 'Sexually Explicit Content',
            text: '. We forbid users from uploading or promoting pornographic content.<br>. Never post, save, share sexual content involving anyone under the age of 18 - even yourself. Never ask anyone under the age of 18 for explicit photos or videos. All forms of child exploitation will be reported.'
          }, {
            title: 'Harassment & Bullying',
            text: '. Bullying or harassment of any kind will NOT BE TOLERATED.<br>. Do not upload any content with the intention of making someone feel bad. If someone blocks you, do not try to get in contact with them using another account.<br>. If you upload any content about someone else and they ask you to remove it. Please do!'
          }, {
            title: 'Threats, Violence and Harm',
            text: '. You must never threaten violence on any person, a group of people or someone’s property. Any encouragement of violence in XPLO is forbidden.<br>Glorification of self harm or content involving the encouragement of self harm will not be allowed.<br>Any kind of animal abuse is also forbidden.'
          }, {
            title: 'Impersonation & Spam',
            text: '. Impersonating anyone including, friends, family, celebrities, organizations is prohibited.<br>. We do not allow any kind of deceptive practices or spam.'
          }, {
            title: 'Hate Speech & False Information',
            text: '. Do not post any content that demeans, defames, or promotes discrimination or violence on the basis of, race, ethnicity, national origin sexual orientation, gender identity, disability.<br>XPLO forbids malicious deception and the deliberate spreading of false information thats can cause harm, such as denying the existence of tragic events.'
          }, {
            title: 'Illegal content',
            text: '. Do not use XPLO for any illegal activities, including buying or selling drugs, contraband, counterfeit goods or illegal weapons.'
          }, {
            title: 'Terrorism',
            text: '. Terrorist organizations are forbidden from using our app and we have a zero tolerance for content that advocates or advances terrorism,'
          }, {
            title: '',
            text: 'Please remember if you believe you have seen any of the above you can report the content using our in app function or you can file a report by email; service@xploers.com\nWe review these reports to determine if any violations have occurred and will take appropriate action within 24 hours. If you are in violation of these community guidelines, we may remove the content, terminate your account and/ or notify law enforcement. If you have your account terminated you will not be allowed to use XPLO again. Please take these guidelines seriously.'
          }]
        }, {
          title: '7.Research',
          text: 'Our research team at XPLO will continuously search and find ways to improve our product. Analyzing the data we have about each XPLO user is just one of many ways we can do this. '
        }, {
          title: '8.Global Access To Our Service',
          text: 'With any app you need a place to store and distribute data, XPLO is not no different. Our data centers are located around the world, including outside of your country of residence. This infrastructure is controlled and operated by XPLO inc. '
        }, {
          title: '9.Copyright ',
          text: 'We take copyright laws very serious. If you believe someone is in violation of the copyright laws (including Digital Millennium Copyright Act) you are able to report this and our XPLO team will look into it. If XPLO inc becomes aware of one its users continually infringing these laws, we will take reasonable action within our power to terminate the user’s account. We have made reporting suspected copyright easy for you, using the in-app ‘report’ button located on the top right of the screen. You may also contact us by email; service@xploers.com. '
        }, {
          title: '10.Privacy',
          text: 'You care about your privacy and so do we. To learn about how we handle the information given to us about you we encourage you to read our Privacy Policy.<br>By using XPLO you are agreeing to our Privacy Policy.'
        }, {
          title: '11.User agreement',
          text: 'In order to use the app you must agree to the Terms listed above. This is a contract that outlines our Services and the parties obligations. Please review it carefully.'
        }
      ]
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
/* css policies */
/* 全局样式 */
/* 将根节点设置成100px,则直接在目前原稿的基础上x2/100 */
p{
    margin: 0;
}
dt,dl,dd{
  margin:0;
  padding:0;
}
.privacy{
  font-family: 微软雅黑,苹方,思源黑体,PingFangSC-Regular;
}
.goBack{
  position: absolute;
  left: 0.4rem;
  top: .1rem;
  font-size:0.5rem;
  color: rgb(66,93,144);
}
.header{
    position: relative;
    padding-bottom:0.45rem;
    border-radius:0 0 50% 50%;
    text-align: center;
    overflow: hidden;
    background-color: rgba(236,240,248,1);
}
.header:after{
    content:"";
    display: inline-block;
    width:1.4rem;
    height: 1.4rem;
    margin-top: 0.25rem;
    background: url(../assets/img/img_logo@2x.png) 0 0 no-repeat;
    background-size: cover;
}
.policy-title{
    margin:0.2rem;
    text-align: center;
    font-family: SFUIDisplay-Medium;
    font-size:0.36rem;
    color:rgba(66,93,144,1)
}
/* 内容部分 */
.policiesContainer{
    padding: 0.14rem;
}
.policyTitle{
    margin:0.2rem;
    text-align: center;
    font-size:0.35rem;
    color:rgb(66,93,144)
}
.policiesCapture{
    color:rgba(130,167,208);
    font-size:0.24rem;
    line-height: 0.36rem;
}
.contentTitle{
    margin-top:0.12rem;
    margin-bottom:0.4rem;
    font-size: 0.36rem;
    text-align: center;
    font-family:Futura-Medium;
    color:rgb(66,93,144);
}
.title{
    color:rgb(66,93,144);
    font-size:0.28rem;
    font-weight: 800;
    margin:0.32rem 0;
}
.text{
    color:rgb(130,167,208);
    font-size:0.24rem;
    line-height: 0.36rem;
}
dt{
    margin:0.2rem 0;
    color:rgb(66,93,144);
}
dd{
    color:rgb(130,167,208);
    font-size: 0.24rem;
    line-height: 0.36rem
}
dt .tips{
    color: rgb(130,167,208);
    font-size: 0.24rem;
    font-weight: bold;
    border-bottom: 0.02rem solid rgb(130,167,208);
}
@media(min-width:640px){
  .privacy{
    max-width: 900px;
    margin: 0 auto 1rem;
    padding-bottom: 30px;
    box-shadow: 0 0 10px rgba(130,167,208,.3);
    border-radius: 0 0 20px 20px;
    overflow: hidden;
  }
}

</style>
