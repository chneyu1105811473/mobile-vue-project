<template>
  <div class="term_service" @click.self="isShow=false" v-show="isShow">
    <div class="term_service_content">
      <p class="term_service_title" v-cloak>{{termService.title}}</p>
      <div class="scroll_box">
        <span class="term_service_capture" v-cloak>{{termService.capture}}</span>
        <template v-for="(item,index) in termService.content" >
          <section :key="index">
            <p class="title" v-html="item.title"></p>
            <div class="text" v-html="item.text"></div>
            <dl v-if="item.children">
              <template v-for="(child,index) in item.children">
                <dt :key="index+'title'">
                  <a href="javascript:void(0)" v-html="child.title"></a>
                </dt>
                <dd :key="index+'text'" v-html="child.text"></dd>
              </template>
            </dl>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyForSignUp',
  props: ['termServiceShow'],
  data () {
    return {
      termService: {
        title: 'Xplo Inc. Terms of Service',
        capture: 'Our goal at XPLO is to bring people from all around the world closer and to share each-others travels and experiences, and to make traveling more enjoyable for everyone. Here we have the list of Terms. Please read carefully.',
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
              text: 'Please remember if you believe you have seen any of the above you can report the content using our in app function or you can file a report by email; <a href="mailTo:service@xploers.com">service@xploers.com</a><br>We review these reports to determine if any violations have occurred and will take appropriate action within 24 hours. If you are in violation of these community guidelines, we may remove the content, terminate your account and/ or notify law enforcement. If you have your account terminated you will not be allowed to use XPLO again. Please take these guidelines seriously.'
            }]
          }, {
            title: '7.Research',
            text: 'Our research team at XPLO will continuously search and find ways to improve our product. Analyzing the data we have about each XPLO user is just one of many ways we can do this. '
          }, {
            title: '8.Global Access To Our Service',
            text: 'With any app you need a place to store and distribute data, XPLO is not no different. Our data centers are located around the world, including outside of your country of residence. This infrastructure is controlled and operated by XPLO inc. '
          }, {
            title: '9.Copyright ',
            text: 'We take copyright laws very serious. If you believe someone is in violation of the copyright laws (including Digital Millennium Copyright Act) you are able to report this and our XPLO team will look into it. If XPLO inc becomes aware of one its users continually infringing these laws, we will take reasonable action within our power to terminate the user’s account. We have made reporting suspected copyright easy for you, using the in-app ‘report’ button located on the top right of the screen. You may also contact us by email; <a href="mailTo:service@xploers.com">service@xploers.com.</a> '
          }, {
            title: '10.Privacy',
            text: 'You care about your privacy and so do we. To learn about how we handle the information given to us about you we encourage you to read our Privacy Policy.<br>By using XPLO you are agreeing to our Privacy Policy.'
          }, {
            title: '11.User agreement',
            text: 'In order to use the app you must agree to the Terms listed above. This is a contract that outlines our Services and the parties obligations. Please review it carefully.'
          }
        ]
      }
    }
  },
  computed: {
    isShow: {
      get () {
        return this.termServiceShow
      },
      set (val) {
        this.$emit('close', val)
      }
    }
  }
}
</script>
<style>
/* term_service样式 */
.term_service{
    position: fixed;
    top: 0;
    z-index: 1;
    width:100%;
    height: 100%;
    padding:0.8rem 0.4rem;
    box-sizing: border-box;
    background-color: rgba(2,18,49, 0.6);
    line-height: 0.36rem;
}
.term_service_content{
    margin-top: 0.3rem;
    background-color:#fff;
    height: 100%;
    border-radius: 0.1rem;
    padding:0.26rem;
    box-sizing: border-box;
    font-size:0.28rem;
}
.term_service_content .scroll_box{
    width: 100%;
    height: 90%;
    text-align: left;
    overflow-y: auto;
}
.term_service_title{
    font-family: SFUIDisplay-Medium;
    color:rgb(102,102,102);
    font-size:0.36rem;
    font-weight: 300;
}
.term_service_capture{
    font-family: SFUIDisplay-Regular;
    color:rgb(153,153,153);
    font-size:0.28rem;
    word-spacing: 0.04rem;
}
.term_service_content .title{
    font-family: SFUIDisplay-Medium;
    margin-bottom:0.15rem;
    color:rgb(102,102,102);
}
.term_service_content .text{
    font-family: SFUIDisplay-Regular;
    color:rgb(153,153,153);
}
/* 内容部分 */
.term_service dl{
    font-family: SFUIDisplay-Regular
  }
.term_service  dt{
    margin:0.2rem 0;
  }
 .term_service dd{
      font-size: 0.26rem;
      line-height: 0.36rem;
      margin: 0;
  }
 .term_service dt a{
      font-size: 0.26rem;
      text-decoration: underline;
      font-weight: bold;
      color:rgb(102,102,102);
  }
</style>
