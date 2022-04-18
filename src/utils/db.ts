import fs from 'fs';
import path from 'path'

const FILE = 'db.json';
const REPO_PATH = path.join(__dirname, '../..');

export async function getDB() {
  const file = path.join(REPO_PATH, FILE);
  if (!checkFileExistsSync(file)) {
    fs.appendFileSync(file, '[]');
  }

  const rawData = fs.readFileSync(file, "utf8") || "";
  let posts: string[] = JSON.parse(rawData) || [];

  return {
    addPost: function (postId: string) {
      posts.push(postId);
      return this;
    },

    addPosts: function (postIds: string[]) {
      posts = posts.concat(postIds);
      return this;
    },

    hasPost: (postId: string) => {
      return posts.includes(postId);
    },

    filterPosts: function (postIds: string[]) {
      return postIds.filter(id => !this.hasPost(id));
    },

    end: () => {
      fs.writeFileSync(file, JSON.stringify(posts));
    },
  };
}

function checkFileExistsSync(filepath: string) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch(e) {
    flag = false;
  }
  return flag;
}