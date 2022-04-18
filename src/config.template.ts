import { Config } from "./types";

export const config: Config = {
  // cookie json exported from EditThisCookie extension
  cookieJson: [],
  cookie: "",

  // target douban groups first page url
  doubanGroupIDs: [
    // 'szsh',
    "591624",
    "601971",
  ],

  findPagesPerTime: 10,

  rules: [
    {
      // location
      excludes: ["罗湖", "福田", "宝安", "西丽", "坪山", "龙岗", "龙华"],
      includeThenPass: ["南山", "后海"],
    },
    {
      // rent type
      excludes: ["合租", "求租", "次卧", "室友", "主卧", "短租"],
      includeThenPass: ["整租", "房东直租"],
    },
    {
      // rooms
      excludes: ["一房", "1房", "一居", "1居", "单间", "一室"],
    },
  ],

  email: {
    receivers: ["xxx@gmail.com"],
    sender: "xxx@gmail.com",
    host: "smtp.gmail.com",
    port: 587,
    password: "your_google_app_password",
  },
};
