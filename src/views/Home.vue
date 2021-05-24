<template>
  <v-card elevation="0">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center" length><br /></v-row>
          <div v-show="formShow">
            <v-row align="center" justify="center" length>
              <v-form
                ref="form"
                v-model="valid"
                v-on:submit.prevent="validate"
                lazy-validation
              >
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="* 姓名 / Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="studentId"
                  :rules="studentIdRules"
                  type="number"
                  label="* 學號 / Student ID"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="phone"
                  :rules="phoneRules"
                  type="number"
                  label="* 電話 / Phone"
                  required
                ></v-text-field>
                <h4>棟別 / Building</h4>
                <v-radio-group v-model="select_radios" :rules="selectRules">
                  <v-radio value="sun">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">曉日樓 / Sun</strong>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="moon">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">皓月樓 / Moon</strong>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="star">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">繁星樓 / Star</strong>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="dawn">
                    <template v-slot:label>
                      <div>
                        <strong class="--text">辰曦樓 / Dawn</strong>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
                <v-text-field
                  v-model="room"
                  :rules="roomRules"
                  type="number"
                  label="* 寢室編號 / Room"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="bed"
                  :rules="bedRules"
                  type="number"
                  label="* 床號 / Bed"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="visitor1"
                  :rules="visitor1Rules"
                  label="* 訪客 1 姓名 / Visitor 1's Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="visitor2"
                  label="訪客 2 姓名 / Visitor 2's Name"
                  required
                ></v-text-field>
                <br />
                <v-btn
                  :disabled="!valid"
                  color="#87C1A2"
                  class="mr-4"
                  @click="validate"
                  >訪客要求申請</v-btn
                >
              </v-form>
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

          <div class="qrcode" v-show="qrcodeShow">
            <v-row align="center" justify="center" length>
              <br />
            </v-row>
            <v-row align="center" justify="center" length>
              <br />
            </v-row>
            <v-row align="center" justify="center" length>
              <qr-code :text="codeShowId"></qr-code>
            </v-row>
            <v-row align="center" justify="center" length>
              <barcode :value="codeShowId" :options="barcode_option"></barcode>
            </v-row>
            <v-row
              align="center"
              justify="center"
              length
              style="background-color: #17252a; color: white; zoom: 1.3"
            >
              {{ statusText }}
            </v-row>
            <br />
            <br />
            <v-row align="center" justify="center" length>
              <v-btn color="#87C1A2" class="mr-4" @click="reset_form"
                >重新申請</v-btn
              >
            </v-row>
          </div>
          <br /><br />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
// import HelloWorld from '../components/HelloWorld'
// let base64 = require("js-base64").Base64;
// import md5 from "js-md5";
const axios = require("axios");
var config = require("../../config.json");

export default {
  name: "Home",
  data() {
    return {
      valid: false,
      name: "",
      nameRules: [(v) => !!v || "請輸入姓名"],
      studentId: "",
      studentIdRules: [
        (v) => !!v || "請輸入學號",
        (v) => (v && v.length === 9) || "請輸入學號正確格式",
      ],
      phone: "",
      phoneRules: [(v) => !!v || "請輸入電話"],
      select_radios: "N/A",
      selectRules: [
        (v) =>
          v === "sun" ||
          v === "moon" ||
          v === "star" ||
          v === "dawn" ||
          "請做出選擇",
      ],
      room: "",
      roomRules: [(v) => !!v || "請輸入寢室編號"],
      bed: "",
      bedRules: [(v) => !!v || "請輸入床號"],
      visitor1: "",
      visitor1Rules: [(v) => !!v || "請輸入訪客 1 姓名"],
      visitor2: "",
      formShow: true,
      formLoadingShow: false,
      qrcodeShow: false,
      codeShowId: "undefined",
      statusText: "Loading...",
    };
  },
  components: {
    // HelloWorld,
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.formShow = false;
        this.formLoadingShow = true;
        if (
          this.select_radios === "sun" ||
          this.select_radios === "moon" ||
          this.select_radios === "star" ||
          this.select_radios === "dawn"
        ) {
          let self = this;
          axios
            .get(config.apiurl, {
              params: {
                a: "add",
                name: this.name,
                studentId: this.studentId,
                phone: this.phone,
                select_radios: this.select_radios,
                room: this.room,
                bed: this.bed,
                visitor1: this.visitor1,
                visitor2: this.visitor2,
              },
            })
            .then(function (response) {
              localStorage.setItem("id", response.data.message.uuid);
              localStorage.setItem("token", response.data.message.token);
              localStorage.setItem(
                "data",
                JSON.stringify({
                  applyTime: response.data.message.applyTime,
                  name: self.name,
                  studentId: self.studentId,
                  phone: self.phone,
                  select_radios: self.select_radios,
                  room: self.room,
                  bed: self.bed,
                  visitor1: self.visitor1,
                  visitor2: self.visitor2,
                })
              );
              self.codeShowId = response.data.message.uuid;
              self.formShow = false;
              self.formLoadingShow = false;
              self.qrcodeShow = true;
            })
            .catch(function (error) {
              alert(error);
            });
        } else {
          alert("有些內容沒有填寫到呢 / Should check the form");
          this.formShow = true;
          this.formLoadingShow = false;
        }
      }
    },
    reset_form() {
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("data");
      this.formShow = true;
      this.qrcodeShow = false;
    },
  },
  mounted: function () {
    if (localStorage.getItem("id")) {
      this.formShow = false;
      this.qrcodeShow = true;
      this.codeShowId = localStorage.getItem("id");
    }
    if (localStorage.getItem("statusTime")) {
      this.formShow = false;
      this.qrcodeShow = true;
      this.codeShowId = localStorage.getItem("id");
    } else {
      this.statusText = "尚未完成訪客登記，請至住輔組櫃台繼續完成後續步驟。";
    }
  },
};
</script>
