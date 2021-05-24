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
                  v-model="pswd"
                  :rules="pswdRules"
                  label="密碼 / Password"
                  required
                ></v-text-field>
                <br />
                <v-btn
                  :disabled="!valid"
                  color="#87C1A2"
                  class="mr-4"
                  @click="validate"
                  >登入</v-btn
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
          <br />
          <v-row
            align="center"
            justify="center"
            length
            style="background-color: #17252a; color: white; zoom: 1.3"
          >
            {{ tipsText }}
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
// import HelloWorld from '../components/HelloWorld'
// let base64 = require("js-base64").Base64;
import md5 from "js-md5";
const axios = require("axios");
var config = require("../../config.json");

export default {
  name: "Home",
  data() {
    return {
      valid: false,
      pswd: "",
      pswdRules: [(v) => !!v || "請輸入密碼"],
      formShow: true,
      formLoadingShow: false,
      tipsText: "",
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
        this.tipsText = "";
        let self = this;
        axios
          .get(config.apiurl, {
            params: {
              a: "login",
              pswd: md5(this.pswd),
            },
          })
          .then(function (response) {
            if (response.data.err) {
              self.formShow = true;
              self.formLoadingShow = false;
              self.tipsText = "密碼錯誤";
            } else {
              localStorage.setItem("adminToken", response.data.message.token);
              localStorage.setItem(
                "adminExpireTime",
                response.data.message.expireTime
              );
              self.$router.push("/admin");
            }
          })
          .catch(function (error) {
            alert(error);
          });
      }
    },
  },
  mounted: function () {
    if (
      localStorage.getItem("adminExpireTime") &&
      localStorage.getItem("adminToken")
    ) {
      this.tipsText =
        "發現已經登入帳號且未過期，如果因其他操作無法使用，請重新登入";
    }
  },
};
</script>
