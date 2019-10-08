<template>
  <div class="telcodeContainer">
    <div class="searchInput">
      <input type="text" placeholder="Select your country of residence" v-model="searchText">
    </div>
    <!-- 热门 -->
    <ul class="codeList hotCode" ref="hotCode">
      <template v-for="(item,index) in hotCode" >
        <li :key="index" @click="selectCountry(item.code)" v-show="!searchText">
          <div class="marginLeft">
            <span class="name">{{item.coutry}}</span>
            <span class="code">{{'+'+item.code}}</span>
          </div>
        </li>
      </template>
    </ul>
    <!-- 所有记录 -->
    <div class="listLine">All countries / areas</div>
    <ul class="codeList allCode">
      <li class="noResult" v-show="filterList.length <= 0">no result</li>
      <template v-for="(item,index) in filterList">
        <li :key="index" @click="selectCountry(item.code)">
          <div class="marginLeft">
            <span class="name">{{item.name_full}}</span>
            <span class="code">{{'+'+item.code}}</span>
          </div>
        </li>
      </template>
    </ul>
    <ul class="filterList" v-show="!searchText">
      <template v-for="(item,index) in filterStr.split('')">
        <li :key="index" @click.self="filterCountry(index)">
          {{item}}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import dataCode from '@/assets/data/AreaCode'
export default {
  name: 'TelphoneCode',
  props: {
    hotCode: {
      type: Array,
      default: function () {
        return [
          {
            coutry: 'United States',
            code: '1'
          }, {
            coutry: 'United Kingdom',
            code: '44'
          }, {
            coutry: 'Germany',
            code: '49'
          }, {
            coutry: 'France',
            code: '33'
          }, {
            coutry: 'Russia',
            code: '7'
          }
        ]
      }
    }
  },
  data () {
    return {
      codeList: dataCode,
      filterStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      searchText: ''
    }
  },
  computed: {
    filterList () {
      return this.codeList.filter(item => item['name_full'].toLowerCase().includes(this.searchText.toLowerCase()))
    }
  },
  methods: {
    filterCountry (val) {
      this.capital = this.filterStr.charAt(val)
      this.filterIndex = this.codeList.findIndex(item => item['name_full'][0] === this.capital)
      const base = document.getElementsByClassName('listLine')[0].offsetTop// 滚动部分到顶部的基本高度
      const baseHeight = window.getComputedStyle(document.getElementsByTagName('li')[0]).height.slice(0, -2)// li的基本高度
      const scrollContainer = document.getElementById('app')
      scrollContainer.scrollTop = baseHeight * this.filterIndex + base
    },
    selectCountry (val) {
      this.$emit('sendCountryCode', val)
      history.back()
    }
  }
}
</script>

<style scoped>
  .telcodeContainer{
    position: absolute;
    width:100%;
    top:1rem;
    padding-top:0.26rem;
  }
  .searchInput{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin:0 0.2rem;
    height: 0.7rem;
    border-radius: 0.36rem;
    border:0.02rem solid rgb(239,239,244);
    overflow: hidden;
  }
  .searchInput input{
    font-family:'Lato', sans-serif;
    display: flex;
    align-items: center;
    width:100%;
    height: 100%;
    padding: 0.2rem;
    font-size: 0.24rem;
    color:rgb(51,51,51);
    background-color: transparent;
  }
  .searchInput input::placeholder{
    color:rgb(102,102,102);
  }
  .searchInput::before{
    content: "";
    display: block;
    margin-left:0.4rem;
    margin-top:.1rem;
    width:0.36rem;
    height: 0.36rem;
    background: url(../../../assets/img/trendingSearch@2x.png) 0 0 no-repeat;
    background-size: contain;
  }
  .codeList li .marginLeft{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:85%;
    height: 0.8rem;
    padding-left: 0.4rem;
    border-bottom: solid rgb(236,240,248) 0.02rem;
  }
  .codeList li:hover{
    background-color: rgb(234,239,247);
  }
  .codeList li:hover .name{
    color:rgb(66,93,144);
  }
  .codeList .name{
    font-family: 'Lato', sans-serif;
    font-size:0.28rem;
    color:rgb(102,102,102);
  }
   .codeList .code{
    font-family:'Lato', sans-serif;
    font-size:0.28rem;
    color:rgb(45,132,253);
  }
  .listLine{
    font-family: 'Lato', sans-serif;
    display: flex;
    align-items: center;
    height: 0.6rem;
    padding-left: 0.4rem;
    box-sizing:border-box;
    font-size:0.24rem;
    color:rgb(51,51,51);
    background-color: rgb(246,247,248);
  }
  .hotCode,.allCode{
    margin: 0.2rem 0;
  }
  .hotCode li:last-of-type,.allCode li:last-of-type{
    border-bottom: none;
  }
  .filterList{
    position: fixed;
    align-items: center;
    font-family: "SFUIDisplay-Medium";
    top:2.4rem;
    right: 0;
    width:8%;
    text-align: center;
  }
  .filterList::before{
    content: "";
    display: inline-block;
    width:0.24rem;
    height: 0.24rem;
    background: url(../../../assets/img/trendingSearch@2x.png) 0 0 no-repeat;
    background-size: contain;
  }
  .filterList li{
    font-family:SFUIDisplay-Regular;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.26rem;
    font-size:0.25rem;
    transform:scale(.8);
    color:rgb(102,102,102);
  }
  .filterList li:active{
    color:rgb(66,93,144);
  }
  .noResult{
    text-align: center;
    color: rgb(102,102,102);
  }

</style>
