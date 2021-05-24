<template>
  <v-card elevation="0">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center" length><br /></v-row>

          <div>
            <v-row
              v-show="!cameraOn"
              align="center"
              justify="center"
              length
              style="background-color: #17252a; color: white; zoom: 1"
            >
              相機正在啟動或無法啟動相機
            </v-row>
            <v-row align="center" justify="center" length><br /></v-row>
            <!-- <v-row align="center" justify="center" length>
              <StreamBarcodeReader
                @decode="(a, b, c) => onDecode(a, b, c)"
                @loaded="() => onLoaded()"
                style="max-width: 344px"
              ></StreamBarcodeReader>
            </v-row> -->
            <br />
            <v-row align="center" justify="center" length>
              <v-form
                ref="form"
                v-model="valid"
                v-on:submit.prevent="validate"
                lazy-validation
              >
                <v-text-field
                  v-model="searchInput"
                  :rules="searchInputRules"
                  label="Token"
                  required
                ></v-text-field>
                <v-btn
                  v-show="formShow"
                  :disabled="!valid"
                  color="#87C1A2"
                  dar
                  class="mr-4"
                  @click="validate"
                  >送出</v-btn
                >
              </v-form>
            </v-row>
            <v-row align="center" justify="center" length>
              <br />
            </v-row>
          </div>
          <div v-show="formLoadingShow">
            <v-row align="center" justify="center" length><br /></v-row>
            <v-row align="center" justify="center" length>
              <v-progress-circular
                indeterminate
                color="amber"
              ></v-progress-circular>
            </v-row>
          </div>
          <v-row
            align="center"
            justify="center"
            length
            style="background-color: #17252a; color: white; zoom: 1.3"
          >
            {{ tipsText }}
          </v-row>

          <br />
          <div v-show="resultShow">
            <v-row align="center" justify="center" length>
              <br />
            </v-row>
            <v-row align="center" justify="center" length>
              <v-card elevation="0">
                <v-data-table
                  dense
                  :headers="headers"
                  :items="selfData"
                  hide-default-header
                  hide-default-footer
                  items-per-page="20"
                  class="elevation-1"
                >
                  <template v-slot:item.data="{ item }">
                    <h3 style="color: #2b7a78">
                      {{ item.data }}
                    </h3>
                  </template>
                </v-data-table>

                <br />

                <v-data-table
                  dense
                  :headers="headers"
                  :items="detailData"
                  hide-default-header
                  hide-default-footer
                  items-per-page="20"
                  class="elevation-1"
                >
                  <template v-slot:item.data="{ item }">
                    <h3 style="color: #2b7a78">
                      {{ item.data }}
                    </h3>
                  </template>
                </v-data-table>
                <v-row align="center" justify="left" length>
                  <br /><br />
                </v-row>
              </v-card>
            </v-row>
          </div>

          <div v-show="resultStartShow">
            <v-row align="center" justify="center" length>
              <br />
            </v-row>
          </div>

          <div v-show="resultStartShow">
            <v-row align="center" justify="center" length>
              <br />
            </v-row>
            <v-row align="center" justify="center" length>
              <v-form
                ref="certificateForm"
                v-model="certificateValid"
                lazy-validation
              >
                <v-radio-group v-model="select_radios" :rules="selectRules">
                  <v-radio value="Identity">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">身分證 / Identity Card</strong>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="Health">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">健保卡 / Health ID Card</strong>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="Driving">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">駕照 / Driving Licence</strong>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="Student">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">學生證 / Student Card</strong>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="Other">
                    <template v-slot:label>
                      <div>
                        <v-text-field
                          v-model="certificateOther"
                          label="其他 / Other"
                          required
                        ></v-text-field>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
                <v-btn
                  x-large
                  v-show="formShow"
                  :disabled="!certificateValid"
                  color="#C75754"
                  dark
                  class="mr-4"
                  @click="startVisit"
                  >收取證件並開始訪客</v-btn
                >
              </v-form>
            </v-row>
          </div>
          <div v-show="resultEndShow">
            <v-row align="center" justify="center" length>
              <br />
            </v-row>
            <v-row align="center" justify="center" length>
              <v-form
                ref="certificateForm"
                v-model="certificateValid"
                lazy-validation
              >
                <div v-show="resultExtendShow">
                  <v-btn
                    x-large
                    v-show="formShow"
                    color="#8954C7"
                    dark
                    class="mr-4"
                    @click="extendVisit"
                    >延長訪客時間</v-btn
                  >
                  <br /><br />
                </div>
                <v-btn
                  x-large
                  v-show="formShow"
                  color="#C75754"
                  dark
                  class="mr-4"
                  @click="endVisit"
                  >結束訪客並還取證件</v-btn
                >
              </v-form>
            </v-row>
          </div>
          <v-row align="center" justify="center" length>
            <br />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
// import HelloWorld from '../components/HelloWorld'
// let base64 = require("js-base64").Base64;
// import md5 from "js-md5";
// import { StreamBarcodeReader } from "vue-barcode-reader";
const axios = require("axios");
var config = require("../../config.json");

export default {
  name: "Home",
  data() {
    return {
      valid: false,
      certificateValid: false,
      searchInput: "",
      searchInputRules: [(v) => !!v || "請輸入資料"],
      select_radios: "N/A",
      certificateOther: "",
      selectRules: [
        (v) =>
          v === "Identity" ||
          v === "Health" ||
          v === "Driving" ||
          v === "Student" ||
          v === "Other" ||
          "請做出選擇",
      ],
      formShow: true,
      formLoadingShow: false,
      resultShow: false,
      resultStartShow: false,
      resultExtendShow: false,
      resultEndShow: false,
      tipsText: "",
      cameraOn: false,
      resultData: {
        applyTime: "null",
        name: "null",
        studentId: "null",
        phone: "null",
        building: "null",
        room: "null",
        bed: "null",
        visitor1: "null",
        visitor2: "null",
        startTime: "null",
        endTime: "null",
        fullTime: "null",
        extendTime: "null",
        certificate: "null",
        other: "null",
      },
      headers: [
        {
          text: "Title",
          align: "start",
          value: "title",
        },
        { text: "Date", value: "data" },
      ],
      selfData: [],
      detailData: [],
    };
  },
  components: {
    // StreamBarcodeReader,
  },
  methods: {
    onDecode(a, b, c) {
      console.log(a, b, c);
      this.searchInput = a;
      alert("掃到了，記得確認內容並按下送出鍵才能完成");
    },
    onLoaded() {
      this.cameraOn = true;
      console.log("load");
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.selfData = [];
        this.detailData = [];
        this.formShow = false;
        this.formLoadingShow = true;
        this.resultShow = false;
        this.resultStartShow = false;
        this.resultEndShow = false;
        this.tipsText = "";
        let self = this;
        axios
          .get(config.apiurl, {
            params: {
              a: "adminTake",
              token: localStorage.getItem("adminToken"),
              search: this.searchInput,
            },
          })
          .then(function (response) {
            if (response.data.err) {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = false;
              self.tipsText = "找不到資料";
            } else {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = true;
              self.makeTable(response.data.message);
            }
          })
          .catch(function (error) {
            self.formShow = true;
            self.formLoadingShow = false;
            self.resultShow = false;
            alert(error);
          });
      }
    },
    startVisit() {
      if (this.$refs.certificateForm.validate()) {
        this.selfData = [];
        this.detailData = [];
        this.formShow = false;
        this.formLoadingShow = true;
        this.resultShow = false;
        this.resultStartShow = false;
        this.resultEndShow = false;
        this.tipsText = "";
        var reqCertificate = "";
        if (this.select_radios === "Identity")
          reqCertificate = "身分證 / Identity Card";
        else if (this.select_radios === "Health")
          reqCertificate = "健保卡 / Health ID Card";
        else if (this.select_radios === "Driving")
          reqCertificate = "駕照 / Driving Licence";
        else if (this.select_radios === "Student")
          reqCertificate = "學生證 / Student Card";
        else if (this.select_radios === "Other")
          reqCertificate = this.certificateOther;
        let self = this;
        console.log(localStorage.getItem("adminTmpData"));
        console.log(JSON.parse(localStorage.getItem("adminTmpData")));
        axios
          .get(config.apiurl, {
            params: {
              a: "adminStatus",
              token: localStorage.getItem("adminToken"),
              change: "start",
              uuid: JSON.parse(localStorage.getItem("adminTmpData")).uuid,
              certificate: reqCertificate,
              note: "",
            },
          })
          .then(function (response) {
            if (response.data.err) {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = false;
              self.tipsText = "無法完成操作";
            } else {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = true;
              self.makeTable(response.data.message);
            }
          })
          .catch(function (error) {
            self.formShow = true;
            self.formLoadingShow = false;
            self.resultShow = false;
            alert(error);
          });
      }
    },
    extendVisit() {
      if (this.$refs.certificateForm.validate()) {
        this.selfData = [];
        this.detailData = [];
        this.formShow = false;
        this.formLoadingShow = true;
        this.resultShow = false;
        this.resultStartShow = false;
        this.resultEndShow = false;
        this.tipsText = "";
        let self = this;
        console.log(localStorage.getItem("adminTmpData"));
        console.log(JSON.parse(localStorage.getItem("adminTmpData")));
        axios
          .get(config.apiurl, {
            params: {
              a: "adminStatus",
              token: localStorage.getItem("adminToken"),
              change: "extend",
              uuid: JSON.parse(localStorage.getItem("adminTmpData")).uuid,
              certificate: "",
              note: "",
            },
          })
          .then(function (response) {
            if (response.data.err) {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = false;
              self.tipsText = "無法完成操作";
            } else {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = true;
              self.makeTable(response.data.message);
            }
          })
          .catch(function (error) {
            self.formShow = true;
            self.formLoadingShow = false;
            self.resultShow = false;
            alert(error);
          });
      }
    },
    endVisit() {
      if (this.$refs.certificateForm.validate()) {
        this.selfData = [];
        this.detailData = [];
        this.formShow = false;
        this.formLoadingShow = true;
        this.resultShow = false;
        this.resultStartShow = false;
        this.resultEndShow = false;
        this.tipsText = "";
        let self = this;
        console.log(localStorage.getItem("adminTmpData"));
        console.log(JSON.parse(localStorage.getItem("adminTmpData")));
        axios
          .get(config.apiurl, {
            params: {
              a: "adminStatus",
              token: localStorage.getItem("adminToken"),
              change: "end",
              uuid: JSON.parse(localStorage.getItem("adminTmpData")).uuid,
              certificate: "",
              note: "",
            },
          })
          .then(function (response) {
            if (response.data.err) {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = false;
              self.tipsText = "無法完成操作";
            } else {
              self.formShow = true;
              self.formLoadingShow = false;
              self.resultShow = true;
              self.makeTable(response.data.message);
            }
          })
          .catch(function (error) {
            self.formShow = true;
            self.formLoadingShow = false;
            self.resultShow = false;
            alert(error);
          });
      }
    },
    makeTable(resJson) {
      localStorage.setItem("adminTmpData", JSON.stringify(resJson));
      let self = this;
      // let applyDate = new Date(resJson.applyTime);
      self.resultData.applyTime = self.timeFormatMaker(resJson.applyTime);
      self.resultData.name = resJson.name;
      self.resultData.studentId = resJson.studentId;
      self.resultData.phone = "0" + resJson.phone;
      self.resultData.building = resJson.building;
      if (self.resultData.building == "sun") {
        self.resultData.building = "曉日";
      } else if (self.resultData.building == "moon") {
        self.resultData.building = "皓月";
      } else if (self.resultData.building == "star") {
        self.resultData.building = "繁星";
      } else if (self.resultData.building == "dawn") {
        self.resultData.building = "辰曦";
      }
      self.resultData.room = resJson.room;
      self.resultData.bed = resJson.bed;
      self.resultData.visitor1 = resJson.visitor1;
      self.resultData.visitor2 = resJson.visitor2;
      self.resultData.startTime = self.timeFormatMaker(resJson.startTime);
      self.resultData.endTime = self.timeFormatMaker(resJson.endTime);
      self.resultData.fullTime = resJson.fullTime;
      self.resultData.extendTime = resJson.extendTime;
      self.resultData.certificate = resJson.certificate;
      self.resultData.other = resJson.other;

      self.selfData = [];
      self.detailData = [];
      self.selfData.push({
        title: "申請時間",
        data: self.resultData.applyTime,
      });
      self.selfData.push({
        title: "姓名/學號",
        data: self.resultData.name + " - " + self.resultData.studentId,
      });
      self.selfData.push({
        title: "棟別/寢室/床號",
        data:
          self.resultData.building +
          " - " +
          self.resultData.room +
          " - " +
          self.resultData.bed,
      });
      self.selfData.push({
        title: "電話",
        data: self.resultData.phone,
      });
      self.selfData.push({
        title: "訪客 1",
        data: self.resultData.visitor1,
      });
      self.selfData.push({
        title: "訪客 2",
        data: self.resultData.visitor2,
      });

      self.detailData.push({
        title: "開始訪客時間",
        data: self.resultData.startTime,
      });
      self.detailData.push({
        title: "結束訪客時間",
        data: self.resultData.endTime,
      });
      var fullTime = self.resultData.fullTime;
      if (fullTime !== "N/A") {
        fullTime =
          parseInt(self.resultData.fullTime / 60 / 60) +
          " 小時 " +
          parseInt((self.resultData.fullTime % (60 * 60)) / 60) +
          " 分 " +
          parseInt(self.resultData.fullTime % 60) +
          " 秒";
      }
      self.detailData.push({
        title: "訪客總時長",
        data: fullTime,
      });
      self.detailData.push({
        title: "訪客時間延長",
        data: self.resultData.extendTime,
      });
      self.detailData.push({
        title: "留存證件",
        data: self.resultData.certificate,
      });
      self.detailData.push({
        title: "註記",
        data: self.resultData.other,
      });

      if (self.resultData.startTime === "N/A") {
        self.resultStartShow = true;
        self.resultExtendShow = false;
        self.resultEndShow = false;
      } else if (
        self.resultData.startTime !== "N/A" &&
        self.resultData.endTime === "N/A"
      ) {
        self.resultStartShow = false;
        self.resultExtendShow = !self.resultData.extendTime;
        self.resultEndShow = true;
      } else {
        self.resultStartShow = false;
        self.resultExtendShow = false;
        self.resultEndShow = false;
      }
    },
    timeFormatMaker(editTime) {
      if (editTime === "N/A") return editTime;
      editTime = new Date(editTime);
      let res = "";
      res =
        editTime.getFullYear() +
        "/" +
        String(parseInt(editTime.getMonth()) + 1) +
        "/" +
        editTime.getDate() +
        " " +
        editTime.getHours() +
        ":" +
        editTime.getMinutes() +
        ":" +
        editTime.getSeconds();
      return res;
    },
  },
  mounted: function () {
    if (
      localStorage.getItem("adminExpireTime") &&
      localStorage.getItem("adminToken")
    ) {
      let expireTime = new Date(localStorage.getItem("adminExpireTime"));
      let nowTime = new Date();
      if (expireTime < nowTime) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminExpireTime");
        alert("過期了，請重新登入");
        this.$router.push("/admin/login");
      }
    } else {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminExpireTime");
      this.$router.push("/admin/login");
    }
    // localStorage.setItem("adminToken", response.data.message.token);
    // localStorage.setItem("adminExpireTime", response.data.message.expireTime);
  },
};
</script>
