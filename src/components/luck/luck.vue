<template>
  <div class="luck-back">
    <div class="guide"><a href="https://docs.qq.com/doc/DT1BYdmlwWEZYcmRH" target="_blank">抽奖工具使用指南</a></div>
    <div class="modal" v-show="show">
      <div class="modal-cover"></div>
      <div class="modal-content">
        <div class="close" @click="closeModal()">×</div>
        <div class="selectHead">
          <select v-model="selectHead">
            <option value="unselected">请选择用于抽奖的数据列</option>
            <template v-for="(item, index) in headArray" v-show="headArray.length>0">
              <option :key="index" :value="item">{{(index + 1)}} - {{item}}</option>
            </template>
          </select>
        </div>
        <div class="import">
          <button class="lucky-btn" @click="importTable()">导入</button>
        </div>
      </div>
    </div>
    <div class="modal" v-show="luckyModal">
      <div class="modal-cover"></div>
      <div class="modal-content">
        <div class="close" @click="luckyModal=false">×</div>
        <div class="luckyText">
          <textarea rows="3" :value="luckyList"></textarea>
        </div>
      </div>
    </div>
    <div class="luck-content ce-pack-end">
      <div class="luck-user user-list">
        <div class="luck-user-title">
          <span>抽奖名单</span>
        </div>
        <ol id="userlist" class="luck-user-list">
          <template v-for="(item, i) in userList" v-show="userList.length>0">
            <li :key="i">
              <div class="portrait"></div>
              <div class="luckuserName">{{item}}</div>
            </li>
          </template>
        </ol>
        <div class="luck-user-btn">
          <vue-xlsx-table class="import-btn" @on-select-file="handleOk">导入名单</vue-xlsx-table>
        </div>
      </div>
      <div id="luckuser" class="slotMachine">
        <div id="prize" class="slot">
          <span id="user" class="name" v-show="rollingSubtitle">{{rollTitle}}</span>
        </div>
      </div>
      <div class="luck-content-btn">
        <a id="start" class="start" @click="start()">{{rollingSubtitle === false ? '开始':'抽取幸运用户'}}</a>
      </div>
      <div class="setting">
        <div class="menu">
          <div class="line">
            <label>奖项设置：</label>
            <input id="grade" placeholder="设置奖项，如一等奖"/>
          </div>
          <div class="line">
            <label>奖品内容：</label>
            <input id="details" placeholder="奖品内容"/>
          </div>
          <div class="line">
            <label>奖品数量：</label>
            <input id="count" placeholder="奖品数量"/>
          </div>
          <div class="line luck-content-btn">
            <a @click="save()">保存设置</a>
          </div>
        </div>
      </div>
      <div class="luck-user luck-list">
        <div class="luck-user-title">
          <span>中奖名单</span>
        </div>
        <ul id="luckUserList" class="luck-user-list">
          <template v-for="(item, i) in luckyUserList">
            <li :key="i" class="awards-title">{{item.awards.grade}}：{{item.awards.details}}*{{item.awards.count}}</li>
            <li :key="luckyUser" v-for="luckyUser in item.lucky">
              <div class="portrait"></div>
              <div class="luckuserName">{{luckyUser}}</div>
            </li>
          </template>
        </ul>
        <div class="luck-user-btn">
          <a id="drawList" @click="exportList()">导出名单</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'lucky',
  data () {
    return {
      // 模态框显示状态
      show: false,
      // 导入的表格数据
      table: [],
      // 抽奖名单
      userList: [],
      // 选择要导入的列
      headArray: [],
      // 导入的表格数据
      tableData: '',
      // 选择用于抽奖的数据列的选择值
      selectHead: 'unselected',
      // 抽奖的滚动字幕
      rollingSubtitle: false,
      // 滚动中的标题
      rollTitle: '',
      // 中奖用户在数组中的下标
      luckIndex: '',
      // 保存的到名单的下标
      awardsNum: 0,
      // 中奖名单
      luckyUserList: [
        // {
        //   awards: {
        //     grade: '一等奖测试',
        //     details: '测试',
        //     count: '3'
        //   },
        //   lucky: ['123456', '123456', '123456']
        // }
      ],
      // 是否正在抽奖中的状态（滚动字幕）
      isStart: false,
      // 导出名单的模态框显示隐藏
      luckyModal: false,
      // 导出名单的文本
      luckyList: ''
    }
  },
  methods: {
    // 导入名单，本地打开xlsx表格文件
    handleOk (convertedData) {
      console.log(convertedData)
      if (convertedData) {
        this.tableData = convertedData
        this.headArray = convertedData.header
        this.openModal()
      }
    },
    openModal () {
      this.show = true
    },
    closeModal () {
      this.show = false
    },
    // 导入表格数据到抽奖名单中
    importTable () {
      let list = []
      if (this.selectHead !== 'unselected') {
        let arr = this.tableData.body
        let num = 0
        // 遍历表格中的全部数据
        for (let i in arr) {
          // 遍历每一行数据
          for (let j in arr[i]) {
            // 只取指定列的数据
            if (j === this.selectHead) {
              list.push(arr[i][j])
              // 跳出当前循环
              break
            }
          }
          num++
        }
        this.userList = list
        // 遍历完毕后关闭模态框
        if (num === arr.length) {
          console.log(this.userList.length)
          this.closeModal()
        }
      } else {
        alert('请选择要导入的数据列')
      }
    },
    // 生成随机数，取对应下标用户添加到滚动字幕上
    startNum () {
      if (this.userList.length === 0) {
        alert('请先导入抽奖名单')
        return
      }
      if (this.awardsNum === 0) {
        alert('请先设置奖项')
        return
      }
      // 当状态为true时，不再生成随机数
      if (this.isStart) {
        console.log('已有定时器')
        return
      }
      if (this.luckyUserList.length > 0) {
        // 取奖项设置里设置的奖品数量
        let num = this.luckyUserList[this.awardsNum - 1].awards.count
        // 取中奖名单里的用户数量
        let luckyLen = this.luckyUserList[this.awardsNum - 1].lucky.length
        if (parseInt(num) === luckyLen) {
          alert('本次抽奖已结束，请设置新的奖项')
          return
        }
      }
      // 显示滚动字幕
      this.rollingSubtitle = true
      let count = 0
      // 生产随机数，并将随机到的用户显示在滚动字幕上。
      this.timer = setInterval(() => {
        // Math.random() * (21 - 1) 生成一个0至20的随机数（带小数）
        // Math.round(Math.random() * (21 - 1)) 将生成的随机小数四舍五入取整数，即为中奖用户在this.userList数组里的下标
        let num = Math.round(Math.random() * (this.userList.length - 1))
        this.luckIndex = num
        count++
        console.log('%i，随机数：%i, 用户数：%s', count, num, this.userList.length)
        // 显示用户到字幕上
        this.rollTitle = this.userList[num]
      }, 0)
      // 设置一个状态，表示正在抽奖中
      this.isStart = true
    },
    // 开始抽奖
    start () {
      // 字幕在滚动时，抽取一名幸运用户
      if (this.rollingSubtitle === true) {
        // 返回一个数组副本，防止直接操作数组
        let userList = this.userList.slice()
        let luckyUser = userList[this.luckIndex]
        console.log('中奖用户：%s', luckyUser)
        // 添加中奖用户到中奖名单
        this.luckyUserList[this.awardsNum - 1].lucky.push(luckyUser)
        // 从抽奖名单中移除已中奖用户，防止重复中奖
        userList.splice(this.luckIndex, 1)
        // 更新抽奖名单数组
        this.userList = userList
        // 取奖项设置里设置的奖品数量
        let num = this.luckyUserList[this.awardsNum - 1].awards.count
        // 取中奖名单里的用户数量
        let luckyLen = this.luckyUserList[this.awardsNum - 1].lucky.length
        // 判断是否抽取完当前奖项的最后一个名额
        if (parseInt(num) === luckyLen) {
          // 停止滚动字幕
          this.rollingSubtitle = false
          console.log(this.timer)
          // 清楚定时器
          clearInterval(this.timer)
          // 本次抽奖结束，更新状态为默认
          this.isStart = false
          console.log(this.timer)
          return
        }
      }
      // 生成随机数滚动抽奖名单中的所有用户
      this.startNum()
    },
    // 保存设置
    save () {
      if (this.luckyUserList.length > 0) {
        // 取奖项设置里设置的奖品数量
        let num = this.luckyUserList[this.awardsNum - 1].awards.count
        // 取中奖名单里的用户数量
        let luckyLen = this.luckyUserList[this.awardsNum - 1].lucky.length
        // 判断上一次设置的奖项是都已经抽取完毕
        if (luckyLen < parseInt(num)) {
          alert('还有未结束的抽奖，请先结束当前奖项的抽奖再添加')
          return
        }
      }
      // 获取用户输入的值
      let grade = document.getElementById('grade').value
      let details = document.getElementById('details').value
      let count = document.getElementById('count').value
      // 校验正整数的正则
      let r = /^[0-9]*[1-9][0-9]*$/
      // 当是三个输入框的值都不为空时，保存为临时数据
      if (grade && details && count) {
        if (r.test(count) === false) {
          alert('请输入数字')
        } else {
          if (count > this.userList.length) {
            alert('奖品数量不能大于抽奖名单数量')
          } else {
            let data = {
              awards: {
                grade: grade,
                details: details,
                count: count
              },
              lucky: []
            }
            // 存入中奖名单
            this.luckyUserList.push(data)
            // 保存下标位置
            this.awardsNum++
          }
        }
      } else {
        alert('还有未填写的内容！')
      }
    },
    // 导出名单
    exportList () {
      let data = this.luckyUserList
      // {
      //   awards: {
      //     grade: '一等奖测试',
      //     details: '测试',
      //     count: '3'
      //   },
      //   lucky: ['123456', '123456', '123456']
      // }
      let text = ''
      for (let i in data) {
        let awards = data[i].awards.grade + '：' + data[i].awards.details + '*' + data[i].awards.count
        let lucky = data[i].lucky
        let users = ''
        for (let j in lucky) {
          users += (parseInt(j) + 1) + '.' + lucky[j] + '\n'
        }
        text += awards + '\n' + users
      }
      this.luckyList = text
      this.luckyModal = true
    }
  }
}
</script>
<style>
  .import-btn .xlsx-button {
    border: 0 solid #20a0ff !important;
    background-color: #20a0ff00 !important;
    font-size: 16px;
    width: 100%;
    height: 100%;
  }
</style>

<style scoped>

  .guide {
    position: absolute;
    top: 5%;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 30px;
  }

  .guide a:link, .guide a:visited, .guide a:active {
    color: white;
  }

  .guide a:hover {
    color: #f29807;
  }

  .luckyText {
    width: 400px;
    height: 200px;
  }

  .luckyText textarea {
    width: 100%;
    height: 100%;
    resize: none;
    overflow: auto;
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    font-size: 16px;
    padding: 10px;
    line-height: 22px;
  }

  .awards-title {
    text-align: center;
    border: 1px solid #f5ad18;
    padding: 5px;
    border-radius: 4px;
    background-color: #f29807;
    font-size: 16px;
  }

  .setting {
    padding: 120px 20px 20px 20px;
    height: 200px;
    width: 35%;
    min-width: 250px;
    margin: 0 auto;
  }

  @media screen and (min-width: 1366px) {
    .setting {
      padding: 50px 20px 20px 20px;
      width: 60%;
    }
  }

  @media screen and (min-width: 1600px) {
    .setting {
      padding: 50px 20px 20px 20px;
      width: 45%;
    }
  }

  @media screen and (min-width: 1900px) {
    .setting {
      padding: 50px 20px 20px 20px;
      width: 55%;
    }
  }

  @media screen and (min-width: 2200px) {
    .setting {
      padding: 80px 20px 20px 20px;
      width: 35%;
    }
  }

  .setting .menu {
    font-size: 18px;
    border: #f5ad18 1px solid;
    border-radius: 4px;
  }

  .setting .line {
    font-size: 18px;
    padding: 10px 5px;
  }

  .line input, .line label {
    padding: 5px;
  }

  .line input::-webkit-input-placeholder {
    font-size: 16px;
  }

  /*// 最外层 设置position定位*/
  .modal {
    position: relative;
    color: #2e2c2d;
    font-size: 16px;
    border: 1px solid red;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /*// 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩*/
  .modal-cover {
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    z-index: 200;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /*// 内容层 z-index要比遮罩大，否则会被遮盖，*/
  .modal-content {
    background-color: #fff;
    border-radius: 4px;
    position: fixed;
    width: 500px;
    /*height: 150px;*/
    top: 40%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 300;
    padding: 40px 15px;
  }

  .close {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 25px;
  }

  .close:hover {
    color: red;
  }

  .selectHead {
    margin: 0;
    padding: 0 20px;
    width: 70%;
  }

  .selectHead select {
    padding: 0 5px;
    width: 100%;
    font-size: 20px;
    border-radius: 8px;
    background: #fafdfe;
    height: 40px;
    line-height: 40px;
    border: 1px solid #fcb842;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
  }

  .import {
    padding: 0 20px;
    width: 30%;
    height: 40px;
  }

  .lucky-btn {
    cursor: pointer;
    background: #f29807;
    width: 100%;
    line-height: 40px;
    display: block;
    border-radius: 5px;
    text-decoration: none;
    color: #fff;
    border: 0;
    font-size: 16px;
  }

  .lucky-btn:focus {
    outline: none;
  }

  .portrait {
    background-image: url('./head.jpg')
  }

  .ce-pack-end {
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /*! autoprefixer: on */
    -webkit-box-pack: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  .luck-back {
    height: 100%;
    width: 100%;
    min-width: 1366px;
    min-height: 768px;
    background-image: url(./back.jpg);
    background-size: cover;
    background-position: top center;
    position: absolute;
    color: #fff;
  }

  .luck-content {
    position: absolute;
    top: 10%;
    bottom: 10%;
    left: 10%;
    right: 10%;
    background: rgba(0, 0, 0, .6);
    padding: 20px 260px;
    border-radius: 5px;
  }

  @media screen and (min-width: 1900px) {
    .luck-content {
      top: 20%;
      bottom: 20%;
      left: 20%;
      right: 20%;
    }
  }

  .luck-user {
    position: absolute;
    right: 20px;
    top: 20px;
    bottom: 20px;
    width: 240px;
    background-color: rgba(255, 255, 255, .2);
    border-radius: 5px;
  }

  .luck-list .luck-user-list {
    list-style-type: none;
    padding: 0 20px;
    margin: 0;
    overflow-y: scroll;
    position: absolute;
    top: 50px;
    bottom: 70px;
    width: 100%;
  }

  .user-list .luck-user-list {
    margin: 0;
    overflow-y: scroll;
    position: absolute;
    top: 50px;
    bottom: 70px;
    width: 100%;
  }

  .luck-user-list > li {
    margin-top: 10px;
    position: relative;
  }

  #userlist.luck-user-list > li {
    margin-left: 20px;
  }

  .luck-list .luck-user-list > li div.portrait {
    height: 30px;
    width: 30px;
    border-radius: 5px;
    background-position: center;
    background-size: cover;
  }

  .user-list .luck-user-list > li div.portrait {
    height: 30px;
    width: 30px;
    border-radius: 15px;
    background-position: center;
    background-size: cover;
    margin-top: -25px;
  }

  .luckuserName {
    line-height: 30px;
    position: absolute;
    top: 0;
    left: 40px;
    right: 0;
  }

  .user-list .luckuserName {
    top: -5px;
  }

  .luck-user-title {
    position: absolute;
    width: 90%;
    display: block;
    text-align: center;
    line-height: 40px;
    left: 5%;
    color: #f5b43a;
    font-weight: bold;
    font-size: 18px;
  }

  .luck-user-title::before {
    position: absolute;
    content: "";
    top: 100%;
    left: 0;
    width: 100%;
    background: -webkit-linear-gradient(left, rgba(248, 215, 59, 0), #f0d03a, rgba(248, 215, 59, 0));
    height: 1px;
  }

  .luck-user-btn {
    position: absolute;
    bottom: 20px;
    left: 5%;
    width: 90%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }

  .luck-user-btn > a, .import-btn {
    background: #f29807;
    width: 100%;
    line-height: 40px;
    display: block;
    border-radius: 5px;
    text-decoration: none;
    color: #fff;
    font-size: 16px;
  }

  .luck-user-btn > a:hover, .import-btn:hover, .lucky-btn:hover {
    background: #fcb842;
  }

  .luck-content-btn {
    width: 100%;
    text-align: center;
    line-height: 40px;
    padding-top: 20px;
    overflow: hidden;
  }

  .luck-content-btn a {
    background: #f29807;
    width: 200px;
    text-decoration: none;
    display: inline-block;
    color: #fff;
    text-align: center;
    /*margin: 0 10px;*/
    cursor: pointer;
    font-size: 16px;
  }

  .luck-content-btn a:hover {
    background: #fcb842;
  }

  .slotMachine {
    width: 200px;
    height: 200px;
    display: block;
    text-align: center;
    background-color: #ffffff;
    border-radius: 5px;
    margin: 0 auto;
    border: #f5ad18 4px solid;
    position: relative;
  }

  .slotMachine .slot {
    width: 100%;
    height: 100%;
    background-image: url(./jfla2.jpg);
    background-size: cover;
    background-position: center;
    position: absolute;
  }

  .slotMachine .slot > span {
    position: absolute;
    bottom: 35%;
    left: 0;
    line-height: 50px;
    text-decoration: none;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
    font-size: 25px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 16px;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 6px;
    background-color: rgba(255, 255, 255, .2);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: #fff;
  }

  .user-list {
    left: 20px;
  }

</style>
